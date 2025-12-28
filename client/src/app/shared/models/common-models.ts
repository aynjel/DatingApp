export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  title: string;
  status: number;
  detail: string;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface PaginationHeaderResponse {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationHeaderResponse;
}
