export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResult {
  limit: number;
  offset: number;
  page: number;
  pageSize: number;
}

export function parsePagination(query: PaginationParams, maxPageSize = 50): PaginationResult {
  const pageSize = Math.min(Math.abs(Number(query.pageSize) || Number(query.limit) || 20), maxPageSize);
  const page = Math.max(1, Number(query.page) || 1);
  const offset = Number(query.offset) || (page - 1) * pageSize;
  return { limit: pageSize, offset, page, pageSize };
}

export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  { page, pageSize }: Pick<PaginationResult, "page" | "pageSize">
) {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
}
