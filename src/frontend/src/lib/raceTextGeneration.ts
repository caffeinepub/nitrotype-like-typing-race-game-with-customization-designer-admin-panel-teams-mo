import { getWordZoneForWPM, selectTargetWordCount } from './wordZones';

/**
 * Default word pool for generating race texts.
 * This is a fallback when no custom texts are available.
 */
const DEFAULT_WORD_POOL = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'practice', 'makes',
  'perfect', 'typing', 'speed', 'accuracy', 'keyboard', 'fingers', 'home', 'row', 'rhythm',
  'technique', 'consistent', 'natural', 'steady', 'proper', 'maintain', 'focus', 'improve',
  'challenge', 'master', 'skill', 'develop', 'enhance', 'progress', 'achieve', 'excellence',
  'dedication', 'patience', 'persistence', 'determination', 'effort', 'success', 'growth',
  'learning', 'training', 'exercise', 'routine', 'habit', 'discipline', 'concentration',
  'attention', 'precision', 'control', 'coordination', 'dexterity', 'agility', 'fluency',
  'proficiency', 'competence', 'expertise', 'capability', 'performance', 'achievement',
  'accomplishment', 'milestone', 'goal', 'target', 'objective', 'purpose', 'intention',
  'motivation', 'inspiration', 'aspiration', 'ambition', 'drive', 'passion', 'enthusiasm',
  'energy', 'vitality', 'vigor', 'strength', 'power', 'force', 'momentum', 'velocity',
  'acceleration', 'pace', 'tempo', 'cadence', 'flow', 'smoothness', 'efficiency', 'effectiveness',
  'productivity', 'output', 'result', 'outcome', 'consequence', 'impact', 'influence', 'effect',
];

/**
 * Retrieves the effective WPM for the current user.
 * Priority order:
 * 1. Most recent race WPM (from localStorage)
 * 2. User profile best WPM (if logged in)
 * 3. Default fallback (30 WPM)
 * 
 * @param userProfileWPM - Optional WPM from user profile
 * @returns Effective WPM value
 */
export function getEffectiveWPM(userProfileWPM?: number): number {
  // Try to get last race WPM from localStorage
  const lastRaceWPM = localStorage.getItem('lastRaceWPM');
  if (lastRaceWPM) {
    const wpm = parseFloat(lastRaceWPM);
    if (!isNaN(wpm) && wpm > 0) {
      return wpm;
    }
  }

  // Fall back to user profile WPM
  if (userProfileWPM !== undefined && userProfileWPM > 0) {
    return userProfileWPM;
  }

  // Default fallback for new users
  return 30;
}

/**
 * Stores the most recent race WPM in localStorage for future races.
 * 
 * @param wpm - WPM value to store
 */
export function storeLastRaceWPM(wpm: number): void {
  localStorage.setItem('lastRaceWPM', wpm.toString());
}

/**
 * Generates race text with a specific target word count.
 * Uses a word pool to create varied text that matches the target length.
 * 
 * @param targetWordCount - Desired number of words
 * @param wordPool - Optional custom word pool (defaults to DEFAULT_WORD_POOL)
 * @returns Generated race text string
 */
export function generateRaceText(targetWordCount: number, wordPool: string[] = DEFAULT_WORD_POOL): string {
  if (targetWordCount <= 0) {
    throw new Error('Target word count must be positive');
  }

  const words: string[] = [];
  
  // Generate words by randomly selecting from the pool
  for (let i = 0; i < targetWordCount; i++) {
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    words.push(wordPool[randomIndex]);
  }

  // Join words with spaces and capitalize first letter
  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

/**
 * Generates race text based on the user's effective WPM.
 * Determines the appropriate word zone and generates text accordingly.
 * 
 * @param userProfileWPM - Optional WPM from user profile
 * @param wordPool - Optional custom word pool
 * @returns Object containing the generated text, zone info, and target word count
 */
export function generateRaceTextForUser(
  userProfileWPM?: number,
  wordPool?: string[]
): {
  text: string;
  zone: ReturnType<typeof getWordZoneForWPM>;
  targetWordCount: number;
  effectiveWPM: number;
} {
  const effectiveWPM = getEffectiveWPM(userProfileWPM);
  const zone = getWordZoneForWPM(effectiveWPM);
  const targetWordCount = selectTargetWordCount(zone);
  const text = generateRaceText(targetWordCount, wordPool);

  return {
    text,
    zone,
    targetWordCount,
    effectiveWPM,
  };
}
