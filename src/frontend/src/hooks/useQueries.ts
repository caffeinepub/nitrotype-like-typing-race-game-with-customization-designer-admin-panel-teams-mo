import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { UserProfile, Inventory, UserRole, Car } from '../backend';

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

export function usePromoteToAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUser: Principal) => {
      if (!actor) throw new Error('Actor not available');
      // Use assignCallerUserRole to promote to admin
      return actor.assignCallerUserRole(targetUser, { admin: null } as any);
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

export function useGetCarCatalog() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Car[]>({
    queryKey: ['carCatalog'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCarCatalog();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useBuyCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.buyCar(carId);
    },
    onSuccess: () => {
      // Invalidate inventory and profile (balance) after purchase
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Helper to map car IDs to catalog entries
export function useCarById(carId: bigint | null) {
  const { data: catalog } = useGetCarCatalog();
  
  if (!carId || !catalog) return null;
  return catalog.find(car => car.id === carId) || null;
}
