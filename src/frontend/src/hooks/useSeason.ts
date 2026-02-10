import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Season } from '../backend';

export function useGetSeason() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Season>({
    queryKey: ['season'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSeason();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetSeason() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (season: Season) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setSeason(season);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['season'] });
    },
  });
}
