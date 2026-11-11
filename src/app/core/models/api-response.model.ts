export interface ApiResponse<T> {
  readonly data: T;
  readonly message?: string;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly page_size: number;
  readonly total_pages: number;
}

