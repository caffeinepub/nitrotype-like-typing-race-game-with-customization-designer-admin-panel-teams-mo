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
export type GrantCoinsResult = {
    __kind__: "error";
    error: string;
} | {
    __kind__: "success";
    success: {
        grantedAmount: bigint;
        finalBalance: bigint;
    };
};
export type UpdateAssistantResult = {
    __kind__: "error";
    error: {
        error: string;
    };
} | {
    __kind__: "success";
    success: string;
};
export interface UserProfile {
    username: string;
    balance: bigint;
    displayName: string;
    createdAt: Time;
    banned: boolean;
    totalMessagesSent: bigint;
    racesPlayed: bigint;
    averageWPM: number;
    bestWPM: number;
    accuracy: number;
}
export type UpdateAssistantAction = {
    __kind__: "grantCoins";
    grantCoins: null;
} | {
    __kind__: "unbanUser";
    unbanUser: {
        adminActor: Principal;
        targetUser: Principal;
    };
} | {
    __kind__: "banUser";
    banUser: {
        userId: Principal;
        adminActor: Principal;
    };
} | {
    __kind__: "changeSeason";
    changeSeason: {
        desiredSeason: Season;
        adminActor: Principal;
    };
} | {
    __kind__: "setUserBalance";
    setUserBalance: {
        adminActor: Principal;
        newBalance: bigint;
        targetUser: Principal;
    };
};
export enum CarColor {
    red = "red",
    blue = "blue",
    black = "black",
    white = "white",
    yellow = "yellow"
}
export enum Season {
    winter = "winter",
    autumn = "autumn",
    summer = "summer",
    spring = "spring"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUser(user: Principal): Promise<void>;
    buyCar(carId: bigint): Promise<void>;
    executeAssistantInstruction(action: UpdateAssistantAction): Promise<UpdateAssistantResult | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCarCatalog(): Promise<Array<Car>>;
    getInventory(user: Principal): Promise<Inventory>;
    getSeason(): Promise<Season>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantCoins(targetUser: Principal, amount: bigint): Promise<GrantCoinsResult>;
    initializeSystem(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setBalance(targetUser: Principal, newBalance: bigint): Promise<void>;
    setSeason(season: Season): Promise<void>;
    unbanUser(user: Principal): Promise<void>;
}
