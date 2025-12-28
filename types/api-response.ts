/**
 * Standard API Response Types
 * Based on backend's standardized response format
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  metadata: {
    timestamp: string;
    requestId?: string;
    pagination?: PaginationMetadata;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    validationErrors?: string[];
  };
  metadata: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;