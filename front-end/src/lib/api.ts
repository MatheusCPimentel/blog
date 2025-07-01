import axios, { AxiosResponse } from "axios";
import {
  ApiResponse,
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostFilterQuery,
  PaginatedPosts,
} from "../types/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error) => {
    if (!error.response) {
      throw new Error("Network error: Please check your connection");
    }

    const message =
      error.response.data?.error ||
      error.response.statusText ||
      "An error occurred";

    throw new Error(message);
  }
);

export const postApi = {
  getPosts: async (filters: PostFilterQuery = {}): Promise<PaginatedPosts> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get<ApiResponse<Post[]>>(
      `/posts?${params.toString()}`
    );

    return {
      posts: response.data.data || [],
      pagination: response.data.pagination!,
    };
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);

    if (!response.data.data) {
      throw new Error("Post not found");
    }

    return response.data.data;
  },

  getPostBySlug: async (slug: string): Promise<Post> => {
    const response = await api.get<ApiResponse<Post>>(`/posts/slug/${slug}`);

    if (!response.data.data) {
      throw new Error("Post not found");
    }

    return response.data.data;
  },

  createPost: async (postData: CreatePostDto): Promise<Post> => {
    const response = await api.post<ApiResponse<Post>>("/posts", postData);

    if (!response.data.data) {
      throw new Error("Failed to create post");
    }

    return response.data.data;
  },

  updatePost: async (id: string, postData: UpdatePostDto): Promise<Post> => {
    const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, postData);

    if (!response.data.data) {
      throw new Error("Failed to update post");
    }

    return response.data.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export default api;
