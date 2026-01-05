/**
 * Centralized Environment Configuration
 * All environment variables are loaded and validated here
 */

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    useMockData: boolean;
  };
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
  };
}

/**
 * Load and validate environment variables
 * Throws an error if required variables are missing
 */
function loadConfig(): AppConfig {
  // Define required environment variables
  const requiredVars = [
    'REACT_APP_AUTH0_DOMAIN',
    'REACT_APP_AUTH0_CLIENT_ID',
    'REACT_APP_AUTH0_AUDIENCE',
  ];

  // Check for missing required variables
  const missing = requiredVars.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  return {
    api: {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
      timeout: 10000, // 10 second timeout
      useMockData: process.env.REACT_APP_USE_MOCK_DATA === 'true',
    },
    auth0: {
      domain: process.env.REACT_APP_AUTH0_DOMAIN!,
      clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
    },
  };
}

// Export the loaded configuration
export const config = loadConfig();
