import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UpdateAssistantAction, UpdateAssistantResult } from '../backend';

export function useExecuteAssistantAction() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (action: UpdateAssistantAction): Promise<UpdateAssistantResult | null> => {
      if (!actor) throw new Error('Actor not available');
      
      const result = await actor.executeAssistantInstruction(action);
      
      if (!result) {
        throw new Error('No result returned from backend');
      }

      if (result.__kind__ === 'error') {
        throw new Error(result.error.error);
      }

      return result;
    },
  });
}
