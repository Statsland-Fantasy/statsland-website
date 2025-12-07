// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  useMockData: process.env.REACT_APP_USE_MOCK_DATA === 'true',
  endpoints: {
    // Player endpoints
    getPlayerBySportAndDate: (sport: string, date: string) =>
      `/api/players/${sport}/${date}`,

    // Round stats endpoints
    getRoundStats: (sport: string, date: string) =>
      `/api/round-stats/${sport}/${date}`,

    // Game results submission
    submitGameResults: '/api/game-results',

    // User stats endpoints
    getUserStats: (userId: string) => `/api/user-stats/${userId}`,
  },
  timeout: 10000, // 10 second timeout
};

export default API_CONFIG;
