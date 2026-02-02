/**
 * LocalStorage key constants
 * Centralized location for all localStorage keys used in the application
 */

import type {
  SportType,
  TileType,
  GuessMessageType,
} from "@/features/athlete-unknown/config";

export const STORAGE_KEYS = {
  CURRENT_SESSION_PREFIX: "currentSession_",
  GUEST_STATS_KEY: "guestStats",
  USERNAME: "statsland_username",
} as const;

/**
 * Get the current session key for a specific sport and date
 */
export const getCurrentSessionKey = (
  sport: SportType,
  playDate: string
): string => {
  return `${STORAGE_KEYS.CURRENT_SESSION_PREFIX}${sport}_${playDate}`;
};

/**
 * Mid-round progress data structure
 */
export interface MidRoundProgress {
  sport: string;
  playDate: string;
  isCompleted: boolean;
  flippedTiles: TileType[];
  previousGuesses: string[];
  incorrectGuesses: number;
  lastSubmittedGuess: string;
  message: string;
  messageType: GuessMessageType;
  playerName: string;
  previousCloseGuess: string;
  score: number;
}

/**
 * Save mid-round progress to localStorage
 */
export const saveMidRoundProgress = (
  sport: SportType,
  playDate: string,
  progress: MidRoundProgress
): void => {
  try {
    const key = getCurrentSessionKey(sport, playDate);
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error("[Storage] Error saving mid-round progress:", error);
  }
};

/**
 * Load mid-round progress from localStorage
 */
export const loadMidRoundProgress = (
  sport: SportType,
  playDate: string
): MidRoundProgress | null => {
  try {
    const key = getCurrentSessionKey(sport, playDate);
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as MidRoundProgress;
    }
    return null;
  } catch (error) {
    console.error("[Storage] Error loading mid-round progress:", error);
    return null;
  }
};

/**
 * Clear mid-round progress from localStorage
 */
export const clearMidRoundProgress = (
  sport: SportType,
  playDate: string
): void => {
  try {
    const key = getCurrentSessionKey(sport, playDate);
    localStorage.removeItem(key);
  } catch (error) {
    console.error("[Storage] Error clearing mid-round progress:", error);
  }
};

/**
 * Clear all game-related localStorage entries
 */
export const clearAllGameData = (): void => {
  try {
    Object.keys(localStorage)
      .filter(
        (key) =>
          key.startsWith(STORAGE_KEYS.CURRENT_SESSION_PREFIX) ||
          key === STORAGE_KEYS.GUEST_STATS_KEY ||
          key === STORAGE_KEYS.USERNAME
      )
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("[Storage] Error clearing all game data:", error);
  }
};

/**
 * Check if there are any game-related localStorage entries
 * Returns true if the user has any saved game data (not a first-time visitor)
 */
export const hasAnyGameData = (): boolean => {
  try {
    // Check all localStorage & sessionStorage keys for game-related entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        // Check if key matches any of our game data patterns
        if (
          key.startsWith(STORAGE_KEYS.CURRENT_SESSION_PREFIX) ||
          key === STORAGE_KEYS.GUEST_STATS_KEY ||
          sessionStorage.getItem("au-splash-shown") // Everything is good
        ) {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error("[Storage] Error checking for game data:", error);
    return false;
  }
};
