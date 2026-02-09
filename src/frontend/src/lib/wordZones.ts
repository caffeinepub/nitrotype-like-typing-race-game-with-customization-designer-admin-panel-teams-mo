/**
 * Word zone mapping based on WPM ranges.
 * Each zone determines the target word count for race text generation.
 */

export type WordZone =
  | { kind: 'range'; minWords: number; maxWords: number; zoneLabel: string; wpmRange: string }
  | { kind: 'exact'; exactWords: number; zoneLabel: string; wpmRange: string };

/**
 * Maps a WPM value to its corresponding word zone.
 * 
 * WPM Ranges:
 * - 10-30 WPM → 10-15 words
 * - 31-45 WPM → 15-40 words
 * - 46-65 WPM → 45-55 words
 * - 66-85 WPM → 55-60 words
 * - 86-200 WPM → 100 words (exact)
 * 
 * Fallback behavior:
 * - WPM < 10: Clamped to 10-30 zone (10-15 words)
 * - WPM > 200: Clamped to 86-200 zone (100 words)
 * 
 * @param wpm - Words per minute value
 * @returns WordZone object with target word count and metadata
 */
export function getWordZoneForWPM(wpm: number): WordZone {
  // Clamp WPM to valid range
  const clampedWPM = Math.max(10, Math.min(200, wpm));

  if (clampedWPM >= 10 && clampedWPM <= 30) {
    return {
      kind: 'range',
      minWords: 10,
      maxWords: 15,
      zoneLabel: 'Beginner',
      wpmRange: '10-30 WPM',
    };
  }

  if (clampedWPM >= 31 && clampedWPM <= 45) {
    return {
      kind: 'range',
      minWords: 15,
      maxWords: 40,
      zoneLabel: 'Intermediate',
      wpmRange: '31-45 WPM',
    };
  }

  if (clampedWPM >= 46 && clampedWPM <= 65) {
    return {
      kind: 'range',
      minWords: 45,
      maxWords: 55,
      zoneLabel: 'Advanced',
      wpmRange: '46-65 WPM',
    };
  }

  if (clampedWPM >= 66 && clampedWPM <= 85) {
    return {
      kind: 'range',
      minWords: 55,
      maxWords: 60,
      zoneLabel: 'Expert',
      wpmRange: '66-85 WPM',
    };
  }

  // 86-200 WPM
  return {
    kind: 'exact',
    exactWords: 100,
    zoneLabel: 'Master',
    wpmRange: '86-200 WPM',
  };
}

/**
 * Selects a random target word count from a word zone.
 * For ranged zones, returns a random value within min/max.
 * For exact zones, returns the fixed value.
 * 
 * @param zone - WordZone object
 * @returns Target word count
 */
export function selectTargetWordCount(zone: WordZone): number {
  if (zone.kind === 'exact') {
    return zone.exactWords;
  }

  // Random value within range (inclusive)
  return Math.floor(Math.random() * (zone.maxWords - zone.minWords + 1)) + zone.minWords;
}
