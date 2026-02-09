import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    username : Text;
    displayName : Text;
    createdAt : Time.Time;
    racesPlayed : Nat;
    bestWPM : Float;
    averageWPM : Float;
    accuracy : Float;
    balance : Nat;
    totalMessagesSent : Nat;
  };

  public type RaceText = {
    id : Nat;
    content : Text;
    category : Text;
    enabled : Bool;
  };

  public type Car = {
    id : Nat;
    name : Text;
    price : Nat;
  };

  public type Inventory = {
    cars : [Nat];
  };

  public type RacePerformance = {
    wpm : Float;
    accuracy : Float;
    raceTime : Nat;
    raceTextId : Nat;
    timestamp : Time.Time;
  };

  // New immutable type alias for Team API return
  public type ImmutableTeam = {
    id : Nat;
    name : Text;
    balance : Nat;
    memberLimit : Nat;
    founder : Principal;
    members : [Principal];
  };

  public type LeaderboardEntry = {
    user : Principal;
    wpm : Float;
    accuracy : Float;
    combinedScore : Float;
  };

  public type Team = {
    id : Nat;
    name : Text;
    balance : Nat;
    memberLimit : Nat;
    founder : Principal;
    members : Set.Set<Principal>;
  };

  public type Holiday = {
    id : Nat;
    date : Text;
    name : Text;
    enabled : Bool;
  };

  public type CreditResult = {
    finalBalance : Nat;
    creditAmount : Nat;
    status : Nat;
    message : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let raceTexts = Map.empty<Nat, RaceText>();
  let cars = Map.empty<Nat, Car>();
  let userInventories = Map.empty<Principal, Inventory>();
  let racePerformances = Map.empty<Principal, [RacePerformance]>();
  let usersBestPerformance = Map.empty<Principal, RacePerformance>();
  let teams = Map.empty<Nat, Team>();
  let holidays = Map.empty<Nat, Holiday>();

  var profileCount : Nat = 0;
  var teamCounter : Nat = 0;
  var holidayCounter : Nat = 0;

  // Now using explicit Nat literal, not invalid public immutable actor field
  let TEAM_CREATE_COST : Nat = 50_000_000;

  func isInitialAdmin() : Bool {
    profileCount < 5;
  };

  module RacePerformanceModule {
    public func compareByWPM(a : (Principal, RacePerformance), b : (Principal, RacePerformance)) : Order.Order {
      if (a.1.wpm > b.1.wpm) { #less } else if (a.1.wpm < b.1.wpm) {
        #greater;
      } else if (a.1.accuracy > b.1.accuracy) { #less } else if (a.1.accuracy < b.1.accuracy) {
        #greater;
      } else { #equal };
    };

    public func compareByAccuracy(a : (Principal, RacePerformance), b : (Principal, RacePerformance)) : Order.Order {
      if (a.1.accuracy > b.1.accuracy) { #less } else if (a.1.accuracy < b.1.accuracy) {
        #greater;
      } else if (a.1.wpm > b.1.wpm) { #less } else if (a.1.wpm < b.1.wpm) {
        #greater;
      } else { #equal };
    };

    public func compareCombinedScore(a : (Principal, RacePerformance), b : (Principal, RacePerformance)) : Order.Order {
      let combinedScoreA = a.1.wpm * a.1.accuracy / 100.0;
      let combinedScoreB = b.1.wpm * b.1.accuracy / 100.0;

      if (combinedScoreA > combinedScoreB) {
        #less;
      } else if (combinedScoreA < combinedScoreB) {
        #greater;
      } else if (a.1.accuracy > b.1.accuracy) {
        #less;
      } else if (a.1.accuracy < b.1.accuracy) {
        #greater;
      } else {
        compareByWPM(a, b);
      };
    };
  };

  func validateUniqueUsername(username : Text) {
    let cleanUsername = username.trim(#char ' ');

    // Validate unique username
    let isUsernameTaken = userProfiles.values().any(
      func(p) { p.username.trim(#char ' ') == cleanUsername }
    );
    if (isUsernameTaken) { Runtime.trap("Username is already taken") };
  };

  func getUser(caller : Principal) : UserProfile {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func createUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    switch (userProfiles.get(caller)) {
      case (?_) { Runtime.trap("Profile already exists") };
      case (null) {
        validateUniqueUsername(profile.username);

        if (isInitialAdmin()) {
          AccessControl.assignRole(accessControlState, caller, caller, #admin);
        };

        userProfiles.add(caller, profile);
        usersBestPerformance.add(
          caller,
          {
            wpm = 0.0;
            accuracy = 0.0;
            raceTime = 0;
            raceTextId = 0;
            timestamp = Time.now();
          },
        );
        profileCount += 1;
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    if (not AccessControl.isAdmin(accessControlState, caller)) {
      validateUniqueUsername(profile.username);
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getInventory(user : Principal) : async Inventory {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own inventory");
    };
    switch (userInventories.get(user)) {
      case (null) { { cars = [] } };
      case (?inventory) { inventory };
    };
  };

  public shared ({ caller }) func promoteToAdmin(targetUser : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can promote others to admin");
    };

    switch (userProfiles.get(targetUser)) {
      case (null) { Runtime.trap("Target user does not exist") };
      case (?_) { AccessControl.assignRole(accessControlState, caller, targetUser, #admin) };
    };
  };

  public shared ({ caller }) func saveRacePerformance(performance : RacePerformance) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save race performances");
    };

    let currentPerformances = switch (racePerformances.get(caller)) {
      case (null) { [] };
      case (?perfs) { perfs };
    };

    let newPerformances = currentPerformances.concat([performance]);
    let performancesFiltered =
      if (newPerformances.size() > 1000) {
        newPerformances.sliceToArray(0, 1000);
      } else { newPerformances };

    racePerformances.add(caller, performancesFiltered);
  };

  func shouldUpdateBestPerformance(oldBest : RacePerformance, newPerformance : RacePerformance) : Bool {
    if (oldBest.wpm < newPerformance.wpm) { return true };
    if (oldBest.wpm == newPerformance.wpm and oldBest.accuracy < newPerformance.accuracy) {
      return true;
    };
    false;
  };

  public shared ({ caller }) func updateBestPerformance(perf : RacePerformance) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update best performances");
    };

    let oldBest = switch (usersBestPerformance.get(caller)) {
      case (null) { perf };
      case (?best) { best };
    };

    if (shouldUpdateBestPerformance(oldBest, perf)) {
      usersBestPerformance.add(caller, perf);
      return true;
    };
    false;
  };

  public query ({ caller }) func getRacePerformances(user : Principal) : async [RacePerformance] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own race performances");
    };

    switch (racePerformances.get(user)) {
      case (null) { [] };
      case (?perfs) { perfs };
    };
  };

  public type LeaderboardType = {
    #wpmLeaderboard;
    #accuracyLeaderboard;
    #combinedLeaderboard;
  };

  public query func getLeaderboard(lType : LeaderboardType, length : ?Nat) : async [LeaderboardEntry] {
    let entries = usersBestPerformance.entries().toArray();
    let sliceLength = switch (length) {
      case (null) { 100 };
      case (?l) {
        if (l > 500 or l <= 0) { 100 } else { l };
      };
    };

    let sortedEntries = entries.sort(
      func(a, b) {
        switch (lType) {
          case (#wpmLeaderboard) { RacePerformanceModule.compareByWPM(a, b) };
          case (#accuracyLeaderboard) { RacePerformanceModule.compareByAccuracy(a, b) };
          case (#combinedLeaderboard) { RacePerformanceModule.compareCombinedScore(a, b) };
        };
      }
    );

    let safeLength = if (sliceLength > sortedEntries.size()) { sortedEntries.size() } else {
      sliceLength;
    };

    let resultEntries = Array.tabulate(
      safeLength,
      func(i) { sortedEntries[i] },
    );

    resultEntries.map<(Principal, RacePerformance), LeaderboardEntry>(
      func((user, perf)) {
        {
          user;
          wpm = perf.wpm;
          accuracy = perf.accuracy;
          combinedScore = perf.wpm * perf.accuracy / 100.0;
        };
      }
    );
  };

  public shared ({ caller }) func createTeam(teamName : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create teams");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        if (profile.balance < TEAM_CREATE_COST) {
          Runtime.trap("Insufficient balance to create team");
        };

        let newTeam : Team = {
          id = teamCounter;
          name = teamName;
          balance = 0;
          memberLimit = 100;
          founder = caller;
          members = Set.empty<Principal>();
        };

        newTeam.members.add(caller);
        teams.add(teamCounter, newTeam);

        let updatedProfile = { profile with balance = profile.balance - TEAM_CREATE_COST };
        userProfiles.add(caller, updatedProfile);

        teamCounter += 1;
      };
    };
  };

  public query ({ caller }) func getTeams() : async [ImmutableTeam] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view teams");
    };

    let teamsIter = teams.values();
    let teamsList = teamsIter.toList<Team>();
    let immutableTeamsList = teamsList.map<Team, ImmutableTeam>(
      func(team) {
        {
          id = team.id;
          name = team.name;
          balance = team.balance;
          memberLimit = team.memberLimit;
          founder = team.founder;
          members = team.members.values().toArray();
        };
      }
    );
    immutableTeamsList.toArray();
  };

  public shared ({ caller }) func getTeamById(teamId : Nat) : async ?ImmutableTeam {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view team details");
    };

    switch (teams.get(teamId)) {
      case (null) { null };
      case (?team) {
        ?{
          id = team.id;
          name = team.name;
          balance = team.balance;
          memberLimit = team.memberLimit;
          founder = team.founder;
          members = team.members.values().toArray();
        };
      };
    };
  };

  private func calculateRaceAward() : Nat {
    let timeBasedValue = Int.abs(Time.now()) % 101;
    900 + timeBasedValue;
  };

  private func creditCoinsInternal(receiver : Principal, amount : Nat) : CreditResult {
    switch (userProfiles.get(receiver)) {
      case (null) {
        { finalBalance = 0; creditAmount = 0; status = 100; message = "User profile not found" };
      };
      case (?profile) {
        let finalBalance = profile.balance + amount;
        userProfiles.add(receiver, { profile with balance = finalBalance });
        {
          finalBalance;
          creditAmount = amount;
          status = 200;
          message = "Credit successful";
        };
      };
    };
  };

  public shared ({ caller }) func adminGrantTrpCoins(amount : Nat, user : Principal) : async CreditResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can grant TRP Coins");
    };
    creditCoinsInternal(user, amount);
  };

  public shared ({ caller }) func completeRace() : async CreditResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can complete races");
    };
    let awardAmount = calculateRaceAward();
    creditCoinsInternal(caller, awardAmount);
  };

  public shared ({ caller }) func addHoliday(name : Text, date : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add holidays");
    };
    holidays.add(
      holidayCounter,
      { id = holidayCounter; name; date; enabled = true },
    );
    holidayCounter += 1;
  };

  public shared ({ caller }) func removeHoliday(holidayId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can remove holidays");
    };
    holidays.remove(holidayId);
  };

  public query ({ caller }) func getHolidays() : async [Holiday] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view holidays");
    };
    holidays.values().toArray();
  };
};
