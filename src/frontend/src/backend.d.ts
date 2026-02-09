import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    wpm: number;
    user: Principal;
    combinedScore: number;
    accuracy: number;
}
export type Time = bigint;
export interface Inventory {
    cars: Array<bigint>;
}
export interface ImmutableTeam {
    id: bigint;
    members: Array<Principal>;
    balance: bigint;
    name: string;
    memberLimit: bigint;
    founder: Principal;
}
export interface RacePerformance {
    wpm: number;
    raceTextId: bigint;
    raceTime: bigint;
    timestamp: Time;
    accuracy: number;
}
export interface CreditResult {
    status: bigint;
    creditAmount: bigint;
    message: string;
    finalBalance: bigint;
}
export interface Holiday {
    id: bigint;
    date: string;
    name: string;
    enabled: boolean;
}
export interface UserProfile {
    username: string;
    balance: bigint;
    displayName: string;
    createdAt: Time;
    totalMessagesSent: bigint;
    racesPlayed: bigint;
    averageWPM: number;
    bestWPM: number;
    accuracy: number;
}
export enum LeaderboardType {
    wpmLeaderboard = "wpmLeaderboard",
    accuracyLeaderboard = "accuracyLeaderboard",
    combinedLeaderboard = "combinedLeaderboard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addHoliday(name: string, date: string): Promise<void>;
    adminGrantTrpCoins(amount: bigint, user: Principal): Promise<CreditResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeRace(): Promise<CreditResult>;
    createTeam(teamName: string): Promise<void>;
    createUserProfile(profile: UserProfile): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHolidays(): Promise<Array<Holiday>>;
    getInventory(user: Principal): Promise<Inventory>;
    getLeaderboard(lType: LeaderboardType, length: bigint | null): Promise<Array<LeaderboardEntry>>;
    getRacePerformances(user: Principal): Promise<Array<RacePerformance>>;
    getTeamById(teamId: bigint): Promise<ImmutableTeam | null>;
    getTeams(): Promise<Array<ImmutableTeam>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    promoteToAdmin(targetUser: Principal): Promise<void>;
    removeHoliday(holidayId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveRacePerformance(performance: RacePerformance): Promise<void>;
    updateBestPerformance(perf: RacePerformance): Promise<boolean>;
}
