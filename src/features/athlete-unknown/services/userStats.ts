import { API_CONFIG } from "@/config";
import { athleteUnknownApiService } from "./api";
import { UserStats } from "../types";

/**
 * User Stats Service
 * Handles fetching user statistics for the Athlete Unknown game
 */
class UserStatsService {
  private useMockData: boolean;

  constructor() {
    this.useMockData = API_CONFIG.useMockData;
    console.log(
      `UserStatsService initialized - Using ${this.useMockData ? "MOCK" : "API"} data`
    );
  }

  /**
   * Get user statistics
   * Falls back to mock data if API call fails
   */
  async getUserStats(): Promise<any> {
    if (this.useMockData) {
      console.log("[MOCK] Fetching user stats");
      return this.getMockUserStats();
    }

    try {
      console.log("[API] Fetching user stats");
      return await athleteUnknownApiService.getUserStats();
    } catch (error) {
      console.warn(
        "[API] Failed to fetch user stats, falling back to mock data:",
        error
      );
      return this.getMockUserStats();
    }
  }

  /**
   * Mock user stats for development/testing
   */
  private getMockUserStats(): UserStats {
    return {
      userId: "test user",
      userName: "test user name",
      userCreated: "yesterday",
      currentDailyStreak: 5,
      lastDayPlayed: "2025-12-01",
      sports: [
        {
          sport: "baseball",
          stats: {
            totalPlays: 100,
            percentageCorrect: 81,
            averageCorrectScore: 88,
            averageNumberOfTileFlips: 2.2,
            highestScore: 97,
            mostCommonFirstTileFlipped: "playerInformation",
            mostCommonLastTileFlipped: "photo",
            mostCommonTileFlipped: "teamsPlayedOn",
            leastCommonTileFlipped: "bio",
            mostFlippedTracker: {
              bio: 11,
              careerStats: 11,
              draftInformation: 11,
              jerseyNumbers: 11,
              personalAchievements: 11,
              photo: 11,
              playerInformation: 11,
              teamsPlayedOn: 11,
              yearsActive: 11,
            },
            firstFlippedTracker: {
              bio: 12,
              careerStats: 12,
              draftInformation: 12,
              jerseyNumbers: 12,
              personalAchievements: 12,
              photo: 12,
              playerInformation: 12,
              teamsPlayedOn: 12,
              yearsActive: 12,
            },
            lastFlippedTracker: {
              bio: 13,
              careerStats: 13,
              draftInformation: 13,
              jerseyNumbers: 13,
              personalAchievements: 13,
              photo: 13,
              playerInformation: 13,
              teamsPlayedOn: 13,
              yearsActive: 13,
            },
          },
          history: [
            {
              playDate: "2025-12-02",
              score: 99,
              isCorrect: true,
              tilesFlipped: ["bio", "photo"],
              incorrectGuesses: 0,
            },
          ],
        },
      ],
    };
  }

  /**
   * Toggle between mock and API data (for testing)
   */
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
    console.log(
      `UserStatsService switched to ${useMock ? "MOCK" : "API"} data mode`
    );
  }

  /**
   * Check if currently using mock data
   */
  isUsingMockData(): boolean {
    return this.useMockData;
  }
}

// Export singleton instance
const userStatsService = new UserStatsService();
export { userStatsService };
