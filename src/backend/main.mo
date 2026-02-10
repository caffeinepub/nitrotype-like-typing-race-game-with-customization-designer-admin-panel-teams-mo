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
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type CarColor = {
    #blue;
    #black;
    #red;
    #yellow;
    #white;
  };

  public type Car = {
    id : Nat;
    name : Text;
    price : Nat;
    color : CarColor;
  };

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

  public type GrantCoinsResult = {
    #success : { finalBalance : Nat; grantedAmount : Nat };
    #error : Text;
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
  var systemInitialized : Bool = false;

  let TEAM_CREATE_COST : Nat = 50_000_000;
  let DEFAULT_BALANCE : Nat = 1_000_000_000_000_000;

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

  func updateUserBalance(user : Principal, newBalance : Nat) {
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?profile) {
        userProfiles.add(user, { profile with balance = newBalance });
      };
    };
  };

  func calculateAverageWPM(raceHistory : [RacePerformance]) : Float {
    if (raceHistory.size() == 0) { return 0.0 };
    let totalWPM = raceHistory.foldLeft(
      0.0,
      func(acc, perf) { acc + perf.wpm },
    );
    totalWPM / raceHistory.size().toFloat();
  };

  func initializeCarCatalog() {
    if (cars.isEmpty()) {
      let carCatalog : [(Nat, Car)] = [
        (1, { id = 1; name = "Lamborghini Urus"; price = 1_000_000_000; color = #blue }),
        (2, { id = 2; name = "Lamborghini Urus"; price = 1_000_000_000; color = #black }),
        (3, { id = 3; name = "Lamborghini Urus"; price = 1_000_000_000; color = #red }),
        (4, { id = 4; name = "Lamborghini Urus"; price = 1_000_000_000; color = #yellow }),
        (5, { id = 5; name = "Lamborghini Urus"; price = 1_000_000_000; color = #white }),
        (6, { id = 6; name = "Lamborghini Revuelto"; price = 2_000_000_000; color = #blue }),
        (7, { id = 7; name = "Lamborghini Revuelto"; price = 2_000_000_000; color = #black }),
        (8, { id = 8; name = "Lamborghini Revuelto"; price = 2_000_000_000; color = #red }),
        (9, { id = 9; name = "Lamborghini Revuelto"; price = 2_000_000_000; color = #yellow }),
        (10, { id = 10; name = "Lamborghini Revuelto"; price = 2_000_000_000; color = #white }),
        (11, { id = 11; name = "Lamborghini Temerario"; price = 2_000_000_000; color = #blue }),
        (12, { id = 12; name = "Lamborghini Temerario"; price = 2_000_000_000; color = #black }),
        (13, { id = 13; name = "Lamborghini Temerario"; price = 2_000_000_000; color = #red }),
        (14, { id = 14; name = "Lamborghini Temerario"; price = 2_000_000_000; color = #yellow }),
        (15, { id = 15; name = "Lamborghini Temerario"; price = 2_000_000_000; color = #white }),
        (16, { id = 16; name = "Lamborghini Huracan"; price = 1_500_000_000; color = #blue }),
        (17, { id = 17; name = "Lamborghini Huracan"; price = 1_500_000_000; color = #black }),
        (18, { id = 18; name = "Lamborghini Huracan"; price = 1_500_000_000; color = #red }),
        (19, { id = 19; name = "Lamborghini Huracan"; price = 1_500_000_000; color = #yellow }),
        (20, { id = 20; name = "Lamborghini Huracan"; price = 1_500_000_000; color = #white }),
        (21, { id = 21; name = "Bugatti Veyron"; price = 3_000_000_000; color = #blue }),
        (22, { id = 22; name = "Bugatti Veyron"; price = 3_000_000_000; color = #black }),
        (23, { id = 23; name = "Bugatti Veyron"; price = 3_000_000_000; color = #red }),
        (24, { id = 24; name = "Bugatti Veyron"; price = 3_000_000_000; color = #yellow }),
        (25, { id = 25; name = "Bugatti Veyron"; price = 3_000_000_000; color = #white }),
        (26, { id = 26; name = "Bugatti Chiron"; price = 4_000_000_000; color = #blue }),
        (27, { id = 27; name = "Bugatti Chiron"; price = 4_000_000_000; color = #black }),
        (28, { id = 28; name = "Bugatti Chiron"; price = 4_000_000_000; color = #red }),
        (29, { id = 29; name = "Bugatti Chiron"; price = 4_000_000_000; color = #yellow }),
        (30, { id = 30; name = "Bugatti Chiron"; price = 4_000_000_000; color = #white }),
      ];
      for ((id, car) in carCatalog.values()) {
        cars.add(id, car);
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    // Check if this is a new profile or an update
    switch (userProfiles.get(caller)) {
      case (null) {
        // New profile: validate username and set default balance
        validateUniqueUsername(profile.username);

        userProfiles.add(
          caller,
          {
            profile with
            balance = DEFAULT_BALANCE;
            createdAt = Time.now();
          },
        );
        profileCount += 1;

        // Grant admin role to the user since they now have a profile
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
      };
      case (?existingProfile) {
        // Existing profile: preserve balance and other sensitive fields
        validateUniqueUsername(profile.username);

        userProfiles.add(
          caller,
          {
            profile with
            balance = existingProfile.balance;
            createdAt = existingProfile.createdAt;
          },
        );
      };
    };
  };

  public query ({ caller }) func getInventory(user : Principal) : async Inventory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventories");
    };
    
    // Users can only view their own inventory unless they are admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own inventory");
    };
    
    switch (userInventories.get(user)) {
      case (null) { { cars = [] } };
      case (?inventory) { inventory };
    };
  };

  func shouldUpdateBestPerformance(oldBest : RacePerformance, newPerformance : RacePerformance) : Bool {
    if (oldBest.wpm < newPerformance.wpm) { return true };
    if (oldBest.wpm == newPerformance.wpm and oldBest.accuracy < newPerformance.accuracy) {
      return true;
    };
    false;
  };

  func calculateRaceAward() : Nat {
    let timeBasedValue = Int.abs(Time.now()) % 101;
    900 + timeBasedValue;
  };

  public shared ({ caller }) func initializeSystem() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize system");
    };
    if (systemInitialized) {
      Runtime.trap("System already initialized");
    };
    initializeCarCatalog();
    systemInitialized := true;
  };

  public query ({ caller }) func getCarCatalog() : async [Car] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view car catalog");
    };
    initializeCarCatalog();
    cars.values().toArray();
  };

  public shared ({ caller }) func buyCar(carId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can buy cars");
    };
    initializeCarCatalog();

    switch (cars.get(carId)) {
      case (null) { Runtime.trap("Car with ID " # carId.toText() # " does not exist") };
      case (?car) {
        let user = getUser(caller);

        if (user.balance < car.price) {
          Runtime.trap("Insufficient balance");
        };

        let updatedBalance = user.balance - car.price;

        let currentInventory = switch (userInventories.get(caller)) {
          case (null) { { cars = [] } };
          case (?inventory) { inventory };
        };
        let hasCar = currentInventory.cars.any(func(id) { id == carId });
        if (hasCar) { Runtime.trap("User already owns car") };

        let newCars = currentInventory.cars.concat([carId]);
        userInventories.add(caller, { currentInventory with cars = newCars });

        updateUserBalance(caller, updatedBalance);
      };
    };
  };

  public shared ({ caller }) func grantCoins(targetUser : Principal, amount : Nat) : async GrantCoinsResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can grant coins");
    };
    switch (userProfiles.get(targetUser)) {
      case (null) {
        #error("User does not exist");
      };
      case (?profile) {
        let newBalance = profile.balance + amount;
        updateUserBalance(targetUser, newBalance);
        #success({
          finalBalance = newBalance;
          grantedAmount = amount;
        });
      };
    };
  };
};
