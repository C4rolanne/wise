export type ApiValidationErrors = Record<string, string[] | string>;

export interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export interface ApiListResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface RequestState {
  loading: boolean;
  error: string | null;
}
