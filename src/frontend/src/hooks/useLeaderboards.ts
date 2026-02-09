import { useQuery } from '@tanstack/react-query';

// Stub types for leaderboard functionality (backend support pending)
export enum LeaderboardType {
  wpmLeaderboard = 'wpmLeaderboard',
  accuracyLeaderboard = 'accuracyLeaderboard',
  combinedLeaderboard = 'combinedLeaderboard',
}

interface LeaderboardEntryWithProfile {
  userPrincipal: string;
  displayName: string;
  username: string;
  wpm: number;
  accuracy: number;
  combinedScore: number;
}

export function useLeaderboardWithProfiles(leaderboardType: LeaderboardType = LeaderboardType.wpmLeaderboard, length: number = 100) {
  return useQuery<LeaderboardEntryWithProfile[]>({
    queryKey: ['leaderboardWithProfiles', leaderboardType, length],
    queryFn: async () => {
      // Leaderboard feature temporarily disabled - backend support pending
      return [];
    },
    enabled: false,
  });
}
