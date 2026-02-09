import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Car {
    id: bigint;
    name: string;
    color: CarColor;
    price: bigint;
}
export type Time = bigint;
export interface Inventory {
    cars: Array<bigint>;
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
export enum CarColor {
    red = "red",
    blue = "blue",
    black = "black",
    white = "white",
    yellow = "yellow"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    buyCar(carId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCarCatalog(): Promise<Array<Car>>;
    getInventory(user: Principal): Promise<Inventory>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSystem(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
