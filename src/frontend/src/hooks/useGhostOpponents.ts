import { useState } from 'react';

interface GhostOpponent {
  name: string;
  targetFinishTime: number;
  progress: number;
}

export function useGhostOpponents(textLength: number, raceStartTime: number | null) {
  const [ghosts] = useState<GhostOpponent[]>([]);

  // Ghost opponents feature temporarily disabled due to missing backend leaderboard support
  return {
    ghosts,
    hasGhosts: false,
  };
}
