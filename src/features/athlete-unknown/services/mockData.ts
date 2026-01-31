import type { Round, UserStats } from "@/features/athlete-unknown/types";
import type { SportType } from "@/config";

// Mock data service - used when REACT_APP_USE_MOCK_DATA=true
class MockDataService {
  static async getRoundData(sport: string): Promise<Round> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Load from local JSON files as before
    const sportFiles: Record<string, string> = {
      baseball: "/AthleteUnknownBaseballData.json",
      basketball: "/AthleteUnknownBasketballData.json",
      football: "/AthleteUnknownFootballData.json",
    };

    const response = await fetch(sportFiles[sport]);
    const data: any = await response.json();
    return data;
  }

  static async getUserStats(): Promise<UserStats> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Load from local JSON files
    const response = await fetch("/AthleteUnknownUserStats.json");
    const userStats: UserStats = await response.json();

    return userStats;
  }

  static async getRounds(sport: SportType): Promise<Round[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const sportFiles: Record<string, string> = {
      baseball: "/sample-BaseballRoundSummary.json",
      basketball: "/sample-BasketballRoundSummary.json",
      football: "/sample-FootballRoundSummary.json",
    };

    const response = await fetch(sportFiles[sport]);
    const data: Round[] = await response.json();

    const filterLastPlaytesterOnlyData = data.slice(0, data.length);

    return filterLastPlaytesterOnlyData;
  }

  static async getUpcomingRounds(sport: SportType): Promise<Round[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const sportFiles: Record<string, string> = {
      baseball: "/sample-BaseballRoundSummary.json",
      basketball: "/sample-BasketballRoundSummary.json",
      football: "/sample-FootballRoundSummary.json",
    };

    const response = await fetch(sportFiles[sport]);
    const data: Round[] = await response.json();

    return data;
  }
}

export { MockDataService };
