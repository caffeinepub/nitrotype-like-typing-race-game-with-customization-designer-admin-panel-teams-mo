import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, {
      username : Text;
      displayName : Text;
      createdAt : Time.Time;
      racesPlayed : Nat;
      bestWPM : Float;
      averageWPM : Float;
      accuracy : Float;
      balance : Nat;
      totalMessagesSent : Nat;
    }>;
    raceTexts : Map.Map<Nat, {
      id : Nat;
      content : Text;
      category : Text;
      enabled : Bool;
    }>;
    cars : Map.Map<Nat, {
      id : Nat;
      name : Text;
      price : Nat;
    }>;
    userInventories : Map.Map<Principal, {
      cars : [Nat];
    }>;
    racePerformances : Map.Map<Principal, [{
      wpm : Float;
      accuracy : Float;
      raceTime : Nat;
      raceTextId : Nat;
      timestamp : Time.Time;
    }]>;
    usersBestPerformance : Map.Map<Principal, {
      wpm : Float;
      accuracy : Float;
      raceTime : Nat;
      raceTextId : Nat;
      timestamp : Time.Time;
    }>;
    profileCount : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, {
      username : Text;
      displayName : Text;
      createdAt : Time.Time;
      racesPlayed : Nat;
      bestWPM : Float;
      averageWPM : Float;
      accuracy : Float;
      balance : Nat;
      totalMessagesSent : Nat;
    }>;
    raceTexts : Map.Map<Nat, {
      id : Nat;
      content : Text;
      category : Text;
      enabled : Bool;
    }>;
    cars : Map.Map<Nat, {
      id : Nat;
      name : Text;
      price : Nat;
    }>;
    userInventories : Map.Map<Principal, {
      cars : [Nat];
    }>;
    racePerformances : Map.Map<Principal, [{
      wpm : Float;
      accuracy : Float;
      raceTime : Nat;
      raceTextId : Nat;
      timestamp : Time.Time;
    }]>;
    usersBestPerformance : Map.Map<Principal, {
      wpm : Float;
      accuracy : Float;
      raceTime : Nat;
      raceTextId : Nat;
      timestamp : Time.Time;
    }>;
    teams : Map.Map<Nat, {
      id : Nat;
      name : Text;
      balance : Nat;
      memberLimit : Nat;
      founder : Principal;
      members : Set.Set<Principal>;
    }>;
    holidays : Map.Map<Nat, {
      id : Nat;
      date : Text;
      name : Text;
      enabled : Bool;
    }>;
    profileCount : Nat;
    teamCounter : Nat;
    holidayCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let teams = Map.empty<Nat, {
      id : Nat;
      name : Text;
      balance : Nat;
      memberLimit : Nat;
      founder : Principal;
      members : Set.Set<Principal>;
    }>();
    let holidays = Map.empty<Nat, {
      id : Nat;
      date : Text;
      name : Text;
      enabled : Bool;
    }>();

    {
      old with teams;
      holidays;
      teamCounter = 0;
      holidayCounter = 0;
    };
  };
};
