import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfile, Inventory, LeaderboardEntry, UserRole, RacePerformance } from '../backend';
import { LeaderboardType } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile(userPrincipal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return null;
      const principal = Principal.fromText(userPrincipal);
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useGetInventory(userPrincipal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Inventory>({
    queryKey: ['inventory', userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return { cars: [] };
      const principal = Principal.fromText(userPrincipal);
      return actor.getInventory(principal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useGetLeaderboard(leaderboardType: LeaderboardType = LeaderboardType.wpmLeaderboard, length: number = 100) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', leaderboardType, length],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard(leaderboardType, BigInt(length));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePromoteToAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUser: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.promoteToAdmin(targetUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
    },
  });
}

export function useRevokeAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUser: Principal) => {
      if (!actor) throw new Error('Actor not available');
      // Use assignCallerUserRole to demote admin to user
      return actor.assignCallerUserRole(targetUser, { user: null } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
    },
  });
}

export function useSaveRacePerformance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (performance: RacePerformance) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveRacePerformance(performance);
      await actor.updateBestPerformance(performance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['raceHistory'] });
    },
  });
}

export function useGetRaceHistory(userPrincipal: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RacePerformance[]>({
    queryKey: ['raceHistory', userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const principal = Principal.fromText(userPrincipal);
      const performances = await actor.getRacePerformances(principal);
      // Sort by timestamp descending (most recent first)
      return performances.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}
