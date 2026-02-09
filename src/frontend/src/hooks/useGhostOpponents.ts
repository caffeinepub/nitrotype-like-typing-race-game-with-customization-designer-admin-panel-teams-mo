import { useState, useEffect, useRef } from 'react';
import { useGetLeaderboard } from './useQueries';

interface GhostOpponent {
  name: string;
  targetFinishTime: number;
  progress: number;
}

export function useGhostOpponents(textLength: number, raceStartTime: number | null) {
  const { data: leaderboard = [] } = useGetLeaderboard();
  const [ghosts, setGhosts] = useState<GhostOpponent[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Initialize ghosts from leaderboard data
    if (leaderboard.length > 0 && ghosts.length === 0) {
      const topRacers = leaderboard.slice(0, 3);
      const initialGhosts = topRacers.map((entry) => {
        const wpm = entry.wpm || 40;
        const wordsInText = textLength / 5;
        const estimatedMinutes = wordsInText / wpm;
        const estimatedSeconds = estimatedMinutes * 60;

        return {
          name: entry.user.toString().slice(0, 8),
          targetFinishTime: estimatedSeconds,
          progress: 0,
        };
      });

      setGhosts(initialGhosts);
    }
  }, [leaderboard, textLength, ghosts.length]);

  useEffect(() => {
    if (!raceStartTime || ghosts.length === 0) return;

    const updateGhostProgress = () => {
      const elapsedSeconds = (Date.now() - raceStartTime) / 1000;

      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          const progress = Math.min((elapsedSeconds / ghost.targetFinishTime) * 100, 100);
          return { ...ghost, progress };
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateGhostProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateGhostProgress);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [raceStartTime, ghosts.length]);

  return {
    ghosts,
    hasGhosts: ghosts.length > 0,
  };
}
