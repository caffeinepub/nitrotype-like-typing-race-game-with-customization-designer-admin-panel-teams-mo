import { useInternetIdentity } from './useInternetIdentity';
import { useGetInventory } from './useQueries';

export function useCurrentUserInventory() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || null;
  
  return useGetInventory(principal);
}
