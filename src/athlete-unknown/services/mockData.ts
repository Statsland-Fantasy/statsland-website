import type { Round } from "../types/api";

// Mock data service - used when REACT_APP_USE_MOCK_DATA=true or when API calls fail
export class MockDataService {
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
    const data: any[] = await response.json();

    const key = `playerIndex_${sport}`;
    const storedIndex = parseInt(localStorage.getItem(key) || "0");
    const index = storedIndex % data.length;
    const roundData = data[index];

    localStorage.setItem(key, ((index + 1) % data.length).toString());

    return roundData;
  }
}

export default MockDataService;
