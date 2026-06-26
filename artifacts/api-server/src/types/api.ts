export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface SearchQuery extends PaginationQuery, SortQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface WebhookEvent {
  event: string;
  data: Record<string, unknown>;
  timestamp: number;
}
