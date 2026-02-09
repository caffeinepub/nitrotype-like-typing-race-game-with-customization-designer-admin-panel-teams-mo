import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ImmutableTeam } from '../backend';

export function useGetTeams() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ImmutableTeam[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeams();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTeamById(teamId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ImmutableTeam | null>({
    queryKey: ['team', teamId],
    queryFn: async () => {
      if (!actor || !teamId) return null;
      return actor.getTeamById(BigInt(teamId));
    },
    enabled: !!actor && !actorFetching && !!teamId,
  });
}

export function useCreateTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTeam(teamName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
