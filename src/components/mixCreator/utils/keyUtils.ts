/**
 * Checks if two musical keys are compatible
 * @param key1 First key (e.g. "1A", "7B")
 * @param key2 Second key to check compatibility with
 * @returns boolean indicating if keys are compatible
 */
export const isCompatibleKey = (key1: string, key2: string): boolean => {
  // This is a simplified version - in a real app, this would use the Camelot wheel
  // to determine truly compatible keys
  if (key1 === key2) return true;

  // Extract numeric part and letter part
  const num1 = parseInt(key1.replace(/[AB]$/, ""));
  const num2 = parseInt(key2.replace(/[AB]$/, ""));
  const letter1 = key1.slice(-1);
  const letter2 = key2.slice(-1);

  // Perfect fifth/fourth relationship (+7/-5 hours on wheel)
  if ((num1 + 7) % 12 === num2 || (num1 - 5 + 12) % 12 === num2) return true;

  // Adjacent keys (+1/-1 hour on wheel)
  if ((num1 + 1) % 12 === num2 || (num1 - 1 + 12) % 12 === num2) return true;

  // Modal shift (A→B or B→A of same number)
  if (num1 === num2 && letter1 !== letter2) return true;

  return false;
};

/**
 * Calculate compatibility score between two keys
 * @param key1 First key
 * @param key2 Second key
 * @returns Score from 0-100 where 100 is perfect match
 */
export const getKeyCompatibilityScore = (
  key1: string,
  key2: string,
): number => {
  if (key1 === key2) return 100; // Perfect match

  // Extract numeric part and letter part
  const num1 = parseInt(key1.replace(/[AB]$/, ""));
  const num2 = parseInt(key2.replace(/[AB]$/, ""));
  const letter1 = key1.slice(-1);
  const letter2 = key2.slice(-1);

  // Modal shift (A→B or B→A of same number)
  if (num1 === num2 && letter1 !== letter2) return 90;

  // Adjacent keys (+1/-1 hour on wheel)
  if ((num1 + 1) % 12 === num2 || (num1 - 1 + 12) % 12 === num2) {
    // Same letter type (A→A or B→B) is better than crossing (A→B or B→A)
    return letter1 === letter2 ? 80 : 70;
  }

  // Perfect fifth/fourth relationship (+7/-5 hours on wheel)
  if ((num1 + 7) % 12 === num2 || (num1 - 5 + 12) % 12 === num2) {
    return letter1 === letter2 ? 65 : 55;
  }

  // Relative minor/major relationship
  if ((num1 + 3) % 12 === num2 || (num1 - 3 + 12) % 12 === num2) {
    return 50;
  }

  // Distant but still workable
  if ((num1 + 2) % 12 === num2 || (num1 - 2 + 12) % 12 === num2) {
    return 40;
  }

  // Challenging combinations
  if ((num1 + 6) % 12 === num2 || (num1 - 6 + 12) % 12 === num2) {
    return 30; // Tritone relationship
  }

  // All other combinations are difficult
  return 20;
};

/**
 * Get the transition type between two keys
 * @param key1 First key
 * @param key2 Second key
 * @returns Transition type as string
 */
export const getTransitionType = (key1: string, key2: string): string => {
  if (key1 === key2) return "PERFECT";

  // Extract numeric part and letter part
  const num1 = parseInt(key1.replace(/[AB]$/, ""));
  const num2 = parseInt(key2.replace(/[AB]$/, ""));
  const letter1 = key1.slice(-1);
  const letter2 = key2.slice(-1);

  // Modal shift (A→B or B→A of same number)
  if (num1 === num2 && letter1 !== letter2) return "MODAL";

  // Adjacent keys (+1/-1 hour on wheel)
  if ((num1 + 1) % 12 === num2 || (num1 - 1 + 12) % 12 === num2) {
    return "NATURAL";
  }

  // Perfect fifth/fourth relationship (+7/-5 hours on wheel)
  if ((num1 + 7) % 12 === num2 || (num1 - 5 + 12) % 12 === num2) {
    return "ENERGY";
  }

  return "TENSION";
};

/**
 * Get all compatible keys for a given key
 * @param key The source key
 * @returns Array of compatible keys sorted by compatibility
 */
export const getCompatibleKeys = (
  key: string,
): { key: string; score: number; type: string }[] => {
  const result = [];
  const num = parseInt(key.replace(/[AB]$/, ""));
  const letter = key.slice(-1);

  // All possible keys
  const allKeys = [];
  for (let i = 1; i <= 12; i++) {
    allKeys.push(`${i}A`);
    allKeys.push(`${i}B`);
  }

  // Score each key
  for (const otherKey of allKeys) {
    if (otherKey === key) continue; // Skip self

    const score = getKeyCompatibilityScore(key, otherKey);
    const type = getTransitionType(key, otherKey);

    result.push({
      key: otherKey,
      score,
      type,
    });
  }

  // Sort by score descending
  return result.sort((a, b) => b.score - a.score);
};
