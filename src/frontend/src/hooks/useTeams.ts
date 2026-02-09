import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

// Stub type for team functionality (backend support pending)
interface ImmutableTeam {
  id: bigint;
  name: string;
  balance: bigint;
  memberLimit: bigint;
  founder: Principal;
  members: Principal[];
}

export function useGetTeams() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ImmutableTeam[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      // Teams feature temporarily disabled - backend support pending
      return [];
    },
    enabled: false,
  });
}

export function useGetTeamById(teamId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ImmutableTeam | null>({
    queryKey: ['team', teamId],
    queryFn: async () => {
      // Teams feature temporarily disabled - backend support pending
      return null;
    },
    enabled: false,
  });
}

export function useCreateTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamName: string) => {
      if (!actor) throw new Error('Actor not available');
      // Feature temporarily disabled - backend support pending
      throw new Error('Team creation is not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
