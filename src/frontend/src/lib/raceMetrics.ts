export interface RaceMetrics {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
}

export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0;
  const words = correctChars / 5; // Standard: 5 characters = 1 word
  const minutes = elapsedSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

export function computeRaceMetrics(
  correctChars: number,
  totalChars: number,
  elapsedSeconds: number
): RaceMetrics {
  const wpm = calculateWPM(correctChars, elapsedSeconds);
  const accuracy = calculateAccuracy(correctChars, totalChars);

  return {
    wpm,
    accuracy,
    elapsedSeconds,
  };
}
