import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export function useAdminGrantTrpCoins() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, user }: { amount: bigint; user: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Parse the principal from the user string
      let targetPrincipal: Principal;
      try {
        targetPrincipal = Principal.fromText(user);
      } catch (error) {
        throw new Error('Invalid principal ID format');
      }

      // Call the backend grantCoins function
      const result = await actor.grantCoins(targetPrincipal, amount);

      // Handle the result variant
      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }

      return result.success;
    },
    onSuccess: () => {
      // Invalidate relevant profile queries to refresh balances
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useAdminSetBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetUser, newBalance }: { targetUser: string; newBalance: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      
      let targetPrincipal: Principal;
      try {
        targetPrincipal = Principal.fromText(targetUser);
      } catch (error) {
        throw new Error('Invalid principal ID format');
      }

      return actor.setBalance(targetPrincipal, newBalance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useCompleteRace() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Feature temporarily disabled - backend support pending
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
