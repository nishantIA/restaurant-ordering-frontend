/**
 * API Client
 */

import { ApiSuccessResponse, ApiErrorResponse } from '@/types/api-response';

/**
 * Custom API Error Class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
    public validationErrors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    if (this.validationErrors && this.validationErrors.length > 0) {
      return this.validationErrors.join(', ');
    }
    return this.message;
  }
}

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

/**
 * Request Configuration
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, unknown>;
  timeout?: number;
}

/**
 * API Client Class (Singleton)
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiClientConfig) {
    // Ensure baseURL ends with trailing slash
    this.baseURL = config.baseURL.endsWith('/') ? config.baseURL : `${config.baseURL}/`;
    this.timeout = config.timeout || 30000;
    console.log('🔧 API Client initialized with BASE_URL:', this.baseURL);
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Build request headers with session ID
   */
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    
    // Set default content type if not already set
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add session ID from localStorage (browser only)
    if (typeof window !== 'undefined') {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        headers.set('x-session-id', sessionId);
      }
    }
    
    return headers;
  }

  /**
   * Core request method
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, timeout, ...fetchConfig } = config;
    
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(config.headers);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || this.timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const data = await response.json();

      // Handle error responses
      if (!response.ok || !data.success) {
        const errorData = data as ApiErrorResponse;
        throw new ApiError(
          response.status,
          errorData.error.code,
          errorData.error.message,
          errorData.error.details,
          errorData.error.validationErrors
        );
      }

      // Return unwrapped data
      const successData = data as ApiSuccessResponse<T>;
      return successData.data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(408, 'TIMEOUT', 'Request timeout');
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError(0, 'NETWORK_ERROR', 'Network error. Please check your connection.');
      }

      // Re-throw API errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Unknown errors
      throw new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * GET request with pagination (preserves metadata)
   */
  async getPaginated<T>(endpoint: string, config?: RequestConfig): Promise<{
    data: T;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }> {
    const { params, timeout, ...fetchConfig } = config || {};
    
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(config?.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || this.timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        const errorData = responseData as ApiErrorResponse;
        throw new ApiError(
          response.status,
          errorData.error.code,
          errorData.error.message,
          errorData.error.details,
          errorData.error.validationErrors
        );
      }

      // Return data + pagination from metadata
      return {
        data: responseData.data,
        pagination: responseData.metadata.pagination,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(408, 'TIMEOUT', 'Request timeout');
      }

      if (error instanceof TypeError) {
        throw new ApiError(0, 'NETWORK_ERROR', 'Network error. Please check your connection.');
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred');
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }
}

/**
 * Singleton instance
 */
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  timeout: 30000,
});