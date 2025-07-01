import { Request, Response } from "express";

export interface ApiResponse<T = any> {
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

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
  excerpt?: string;
  slug?: string;
}

export interface PostFilterQuery extends PaginationQuery {
  search?: string;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: any
) => Promise<any>;

export interface ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
