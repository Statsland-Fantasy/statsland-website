import API_CONFIG from '../config/api';
import type {
  PlayerData,
  RoundStats,
  GameResult,
  GameResultResponse,
  ApiError,
} from '../types/api';

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.timeout = API_CONFIG.timeout;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.details = errorData;
        error.message = errorData.message || error.message;
      } catch {
        // Response body is not JSON
      }

      throw error;
    }

    return response.json();
  }

  /**
   * Get player data by sport and date
   * @param sport - The sport (baseball, basketball, football)
   * @param date - The date in YYYY-MM-DD format (optional, defaults to today)
   */
  async getPlayerBySportAndDate(
    sport: string,
    date?: string
  ): Promise<PlayerData> {
    const dateParam = date || new Date().toISOString().split('T')[0];
    const url = `${this.baseUrl}${API_CONFIG.endpoints.getPlayerBySportAndDate(sport, dateParam)}`;

    try {
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<PlayerData>(response);
    } catch (error) {
      console.error('Error fetching player data:', error);
      throw this.formatError(error, 'Failed to load player data');
    }
  }

  /**
   * Get round statistics by sport and date
   * @param sport - The sport (baseball, basketball, football)
   * @param date - The date in YYYY-MM-DD format (optional, defaults to today)
   */
  async getRoundStats(sport: string, date?: string): Promise<RoundStats> {
    const dateParam = date || new Date().toISOString().split('T')[0];
    const url = `${this.baseUrl}${API_CONFIG.endpoints.getRoundStats(sport, dateParam)}`;

    try {
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<RoundStats>(response);
    } catch (error) {
      console.error('Error fetching round stats:', error);
      throw this.formatError(error, 'Failed to load round statistics');
    }
  }

  /**
   * Submit game results
   * @param gameResult - The game result data
   */
  async submitGameResults(
    gameResult: GameResult
  ): Promise<GameResultResponse> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.submitGameResults}`;

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(gameResult),
      });
      return this.handleResponse<GameResultResponse>(response);
    } catch (error) {
      console.error('Error submitting game results:', error);
      throw this.formatError(error, 'Failed to submit game results');
    }
  }

  /**
   * Get user statistics
   * @param userId - The user ID
   */
  async getUserStats(userId: string): Promise<any> {
    const url = `${this.baseUrl}${API_CONFIG.endpoints.getUserStats(userId)}`;

    try {
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<any>(response);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw this.formatError(error, 'Failed to load user statistics');
    }
  }

  private formatError(error: any, defaultMessage: string): ApiError {
    if (error.name === 'AbortError') {
      return {
        message: 'Request timeout - please try again',
        status: 408,
      };
    }

    if (error.message && error.status) {
      return error as ApiError;
    }

    return {
      message: defaultMessage,
      details: error,
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
