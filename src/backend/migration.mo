import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

module {
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
    founder : Principal.Principal;
    members : [Principal.Principal];
  };

  public type LeaderboardEntry = {
    user : Principal.Principal;
    wpm : Float;
    accuracy : Float;
    combinedScore : Float;
  };

  public type Team = {
    id : Nat;
    name : Text;
    balance : Nat;
    memberLimit : Nat;
    founder : Principal.Principal;
    members : Set.Set<Principal.Principal>;
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

  public type OldActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    raceTexts : Map.Map<Nat, RaceText>;
    cars : Map.Map<Nat, Car>;
    userInventories : Map.Map<Principal.Principal, Inventory>;
    racePerformances : Map.Map<Principal.Principal, [RacePerformance]>;
    usersBestPerformance : Map.Map<Principal.Principal, RacePerformance>;
    teams : Map.Map<Nat, Team>;
    holidays : Map.Map<Nat, Holiday>;
    profileCount : Nat;
    teamCounter : Nat;
    holidayCounter : Nat;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    raceTexts : Map.Map<Nat, RaceText>;
    cars : Map.Map<Nat, Car>;
    userInventories : Map.Map<Principal.Principal, Inventory>;
    racePerformances : Map.Map<Principal.Principal, [RacePerformance]>;
    usersBestPerformance : Map.Map<Principal.Principal, RacePerformance>;
    teams : Map.Map<Nat, Team>;
    holidays : Map.Map<Nat, Holiday>;
    profileCount : Nat;
    teamCounter : Nat;
    holidayCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let DEFAULT_BALANCE = 1_000_000_000_000_000;

    // Only set default balance for profiles with zero balance (new profiles)
    // Preserve existing balances for users who already have funds
    let updatedProfiles = old.userProfiles.map<Principal.Principal, UserProfile, UserProfile>(
      func(_p, p) {
        if (p.balance == 0) {
          { p with balance = DEFAULT_BALANCE };
        } else {
          p;
        };
      }
    );

    {
      old with
      userProfiles = updatedProfiles;
    };
  };
};
