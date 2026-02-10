import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export function useBanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      
      let targetPrincipal: Principal;
      try {
        targetPrincipal = Principal.fromText(userPrincipal);
      } catch (error) {
        throw new Error('Invalid principal ID format');
      }

      return actor.banUser(targetPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useUnbanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      
      let targetPrincipal: Principal;
      try {
        targetPrincipal = Principal.fromText(userPrincipal);
      } catch (error) {
        throw new Error('Invalid principal ID format');
      }

      return actor.unbanUser(targetPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
