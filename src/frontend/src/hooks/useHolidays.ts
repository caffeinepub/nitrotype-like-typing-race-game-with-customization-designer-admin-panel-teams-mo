import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Stub type for holiday functionality (backend support pending)
interface Holiday {
  id: bigint;
  date: string;
  name: string;
  enabled: boolean;
}

export function useGetHolidays() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Holiday[]>({
    queryKey: ['holidays'],
    queryFn: async () => {
      // Holiday feature temporarily disabled - backend support pending
      return [];
    },
    enabled: false,
  });
}

export function useAddHoliday() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, date }: { name: string; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Feature temporarily disabled - backend support pending
      throw new Error('Holiday management is not yet available');
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
      // Feature temporarily disabled - backend support pending
      throw new Error('Holiday management is not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
  });
}
