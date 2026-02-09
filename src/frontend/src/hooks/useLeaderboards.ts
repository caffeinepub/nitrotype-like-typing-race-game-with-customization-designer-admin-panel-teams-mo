import { useGetLeaderboard, useGetUserProfile } from './useQueries';
import { useQuery } from '@tanstack/react-query';
import { LeaderboardType } from '../backend';

export function useLeaderboardWithProfiles(leaderboardType: LeaderboardType = LeaderboardType.wpmLeaderboard, length: number = 100) {
  const { data: entries = [], isLoading: entriesLoading } = useGetLeaderboard(leaderboardType, length);
  
  return useQuery({
    queryKey: ['leaderboardWithProfiles', leaderboardType, entries],
    queryFn: async () => {
      return entries.map(entry => ({
        ...entry,
        userPrincipal: entry.user.toString(),
        displayName: '',
        username: '',
      }));
    },
    enabled: !entriesLoading && entries.length > 0,
  });
}
