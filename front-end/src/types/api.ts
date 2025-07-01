export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  slug: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string | null;
  slug?: string | null;
}

export interface PostFilterQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginatedPosts {
  posts: Post[];
  pagination: PaginationInfo;
}
