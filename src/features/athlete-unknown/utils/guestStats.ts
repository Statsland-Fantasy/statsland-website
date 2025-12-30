/**
 * Guest User Stats Tracking
 * Manages statistics for guest (non-authenticated) users in localStorage
 */

import type { SportType } from "@/features/athlete-unknown/config";
import type { TileTracker } from "@/features/athlete-unknown/types";

const GUEST_STATS_KEY = "guestStats";

/**
 * Statistics for a specific sport
 */
export interface GuestSportStats {
  sport: string;
  totalPlays: number;
  percentageCorrect: number;
  highestScore: number;
  averageCorrectScore: number;
  averageNumberOfTileFlips: number;
  mostCommonFirstTileFlipped: string;
  mostCommonLastTileFlipped: string;
  mostCommonTileFlipped: string;
  leastCommonTileFlipped: string;
  firstTileFlippedTracker: TileTracker;
  lastTileFlippedTracker: TileTracker;
  mostTileFlippedTracker: TileTracker;
}

/**
 * Game result data for updating stats
 */
export interface GuestGameResult {
  sport: SportType;
  score: number;
  isCorrect: boolean;
  tilesFlipped: string[]; // Array of tile names that were flipped
}

/**
 * Create an empty tile tracker
 */
const createEmptyTileTracker = (): TileTracker => ({
  bio: 0,
  playerInformation: 0,
  draftInformation: 0,
  teamsPlayedOn: 0,
  jerseyNumbers: 0,
  careerStats: 0,
  personalAchievements: 0,
  photo: 0,
  yearsActive: 0,
});

/**
 * Create initial stats for a sport
 */
const createInitialSportStats = (sport: SportType): GuestSportStats => ({
  sport,
  totalPlays: 0,
  percentageCorrect: 0,
  highestScore: 0,
  averageCorrectScore: 0,
  averageNumberOfTileFlips: 0,
  mostCommonFirstTileFlipped: "",
  mostCommonLastTileFlipped: "",
  mostCommonTileFlipped: "",
  leastCommonTileFlipped: "",
  firstTileFlippedTracker: createEmptyTileTracker(),
  lastTileFlippedTracker: createEmptyTileTracker(),
  mostTileFlippedTracker: createEmptyTileTracker(),
});

/**
 * Load all guest stats from localStorage
 */
export const loadGuestStats = (): GuestSportStats[] => {
  try {
    const data = localStorage.getItem(GUEST_STATS_KEY);
    if (data) {
      return JSON.parse(data) as GuestSportStats[];
    }
    return [];
  } catch (error) {
    console.error("[GuestStats] Error loading guest stats:", error);
    return [];
  }
};

/**
 * Save guest stats to localStorage
 */
const saveGuestStats = (stats: GuestSportStats[]): void => {
  try {
    localStorage.setItem(GUEST_STATS_KEY, JSON.stringify(stats));
    console.log("[GuestStats] Saved guest stats to localStorage");
  } catch (error) {
    console.error("[GuestStats] Error saving guest stats:", error);
  }
};

/**
 * Increment a tile in the tracker
 */
const incrementTileTracker = (
  tracker: TileTracker,
  tileName: string
): void => {
  const key = tileName as keyof TileTracker;
  if (key in tracker) {
    tracker[key]++;
  }
};

/**
 * Find the most common tile from a tracker
 */
const findMostCommonTile = (tracker: TileTracker): string => {
  let maxCount = 0;
  let mostCommon = "";

  for (const [tile, count] of Object.entries(tracker)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = tile;
    }
  }

  return mostCommon;
};

/**
 * Find the least common tile from a tracker (ignoring zeros)
 */
const findLeastCommonTile = (tracker: TileTracker): string => {
  let minCount = Infinity;
  let leastCommon = "";

  for (const [tile, count] of Object.entries(tracker)) {
    if (count > 0 && count < minCount) {
      minCount = count;
      leastCommon = tile;
    }
  }

  return leastCommon;
};

/**
 * Update guest stats with a new game result
 */
export const updateGuestStats = (result: GuestGameResult): void => {
  try {
    console.log("[GuestStats] Updating guest stats for", result.sport);

    const allStats = loadGuestStats();
    let sportStats = allStats.find((s) => s.sport === result.sport);

    // Initialize stats for this sport if it doesn't exist
    if (!sportStats) {
      sportStats = createInitialSportStats(result.sport);
      allStats.push(sportStats);
    }

    // Update total plays
    sportStats.totalPlays++;

    // Update score-related stats
    if (result.isCorrect) {
      // Update average correct score
      const totalCorrectGames =
        Math.round(sportStats.totalPlays * (sportStats.percentageCorrect / 100));
      const newTotalCorrectGames = totalCorrectGames + 1;
      const oldTotalCorrectScore =
        sportStats.averageCorrectScore * totalCorrectGames;
      sportStats.averageCorrectScore =
        (oldTotalCorrectScore + result.score) / newTotalCorrectGames;

      // Update percentage correct
      sportStats.percentageCorrect =
        (newTotalCorrectGames / sportStats.totalPlays) * 100;

      // Update highest score
      if (result.score > sportStats.highestScore) {
        sportStats.highestScore = result.score;
      }
    }

    // Update average number of tile flips
    const oldTotalTileFlips =
      sportStats.averageNumberOfTileFlips * (sportStats.totalPlays - 1);
    sportStats.averageNumberOfTileFlips =
      (oldTotalTileFlips + result.tilesFlipped.length) / sportStats.totalPlays;

    // Update tile trackers
    if (result.tilesFlipped.length > 0) {
      // First tile flipped
      const firstTile = result.tilesFlipped[0];
      incrementTileTracker(sportStats.firstTileFlippedTracker, firstTile);

      // Last tile flipped
      const lastTile = result.tilesFlipped[result.tilesFlipped.length - 1];
      incrementTileTracker(sportStats.lastTileFlippedTracker, lastTile);

      // All tiles flipped (most flipped tracker)
      for (const tile of result.tilesFlipped) {
        incrementTileTracker(sportStats.mostTileFlippedTracker, tile);
      }

      // Update most/least common tiles
      sportStats.mostCommonFirstTileFlipped = findMostCommonTile(
        sportStats.firstTileFlippedTracker
      );
      sportStats.mostCommonLastTileFlipped = findMostCommonTile(
        sportStats.lastTileFlippedTracker
      );
      sportStats.mostCommonTileFlipped = findMostCommonTile(
        sportStats.mostTileFlippedTracker
      );
      sportStats.leastCommonTileFlipped = findLeastCommonTile(
        sportStats.mostTileFlippedTracker
      );
    }

    // Save updated stats
    saveGuestStats(allStats);

    console.log("[GuestStats] Updated stats:", sportStats);
  } catch (error) {
    console.error("[GuestStats] Error updating guest stats:", error);
  }
};

/**
 * Clear all guest stats (useful for testing or user reset)
 */
export const clearGuestStats = (): void => {
  try {
    localStorage.removeItem(GUEST_STATS_KEY);
    console.log("[GuestStats] Cleared all guest stats");
  } catch (error) {
    console.error("[GuestStats] Error clearing guest stats:", error);
  }
};
