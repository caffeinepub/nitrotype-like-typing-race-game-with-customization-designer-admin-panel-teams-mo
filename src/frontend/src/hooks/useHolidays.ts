import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Holiday } from '../backend';

export function useGetHolidays() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Holiday[]>({
    queryKey: ['holidays'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHolidays();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddHoliday() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, date }: { name: string; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addHoliday(name, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
  });
}

export function useRemoveHoliday() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (holidayId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeHoliday(holidayId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
  });
}
