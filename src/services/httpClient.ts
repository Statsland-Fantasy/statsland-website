import type { ApiError } from "@/types";
import { config } from "@/config/env";

/** Status codes that indicate transient errors worth retrying */
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Generic HTTP client with auth, timeout, error handling, and automatic retry
 * Reusable across all Statsland games
 */
class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private retryConfig: RetryConfig;
  private getAccessTokenSilently?: (options?: {
    authorizationParams?: {
      audience?: string;
    };
  }) => Promise<string>;

  constructor(
    baseUrl: string,
    timeout: number = 10000,
    retryConfig: Partial<RetryConfig> = {}
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Set the Auth0 getAccessTokenSilently function
   * This should be called after the Auth0Provider is initialized
   */
  setGetAccessToken(
    getAccessTokenSilently: (options?: {
      authorizationParams?: {
        audience?: string;
      };
    }) => Promise<string>
  ): void {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  /**
   * Check if an error is retryable (transient network/server error)
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Network errors and timeouts are retryable
      if (
        error.name === "AbortError" ||
        error.name === "TypeError" ||
        error.message.includes("network") ||
        error.message.includes("Failed to fetch")
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if an HTTP status code is retryable
   */
  private isRetryableStatus(status: number): boolean {
    return RETRYABLE_STATUS_CODES.has(status);
  }

  /**
   * Calculate delay for retry with exponential backoff and jitter
   */
  private getRetryDelay(
    attempt: number,
    retryAfterHeader?: string | null
  ): number {
    // Respect Retry-After header if present (for 429 responses)
    if (retryAfterHeader) {
      const retryAfterSeconds = parseInt(retryAfterHeader, 10);
      if (!isNaN(retryAfterSeconds)) {
        return Math.min(retryAfterSeconds * 1000, this.retryConfig.maxDelayMs);
      }
    }

    // Exponential backoff with jitter
    const exponentialDelay =
      this.retryConfig.baseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return Math.min(exponentialDelay + jitter, this.retryConfig.maxDelayMs);
  }

  /**
   * Sleep for a specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Fetch with timeout and authentication
   */
  async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let token: string | undefined;
    if (this.getAccessTokenSilently) {
      try {
        token = await this.getAccessTokenSilently({
          authorizationParams: {
            audience: config.auth0.audience,
          },
        });
      } catch (error) {
        console.error("Error getting access token:", error);
        // Continue without token - let the backend handle unauthorized requests
      }
    }

    let lastError: unknown;
    let lastResponse: Response | undefined;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
          },
        });
        clearTimeout(timeoutId);

        // If response is OK or not retryable, return immediately
        if (response.ok || !this.isRetryableStatus(response.status)) {
          return response;
        }

        // Retryable status code - save response and retry
        lastResponse = response;
        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.getRetryDelay(
            attempt,
            response.headers.get("Retry-After")
          );
          await this.sleep(delay);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error;

        // If not retryable, throw immediately
        if (!this.isRetryableError(error)) {
          throw error;
        }

        // Retryable error - retry after delay
        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.getRetryDelay(attempt);
          await this.sleep(delay);
        }
      }
    }

    // All retries exhausted - throw last error or return last response
    if (lastResponse) {
      return lastResponse;
    }
    throw lastError;
  }

  /**
   * Handle HTTP response and extract JSON
   */
  async handleResponse<T>(response: Response): Promise<T> {
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
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url);
    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Format error for display
   */
  formatError(error: any, defaultMessage: string): ApiError {
    if (error.name === "AbortError") {
      return {
        message: "Request timeout - please try again",
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

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export { HttpClient };
