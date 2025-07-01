import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { postApi } from "../../lib/api";

jest.mock("../../lib/api");
const mockPostApi = postApi as jest.Mocked<typeof postApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

import { useQuery, useMutation } from "@tanstack/react-query";

const usePosts = (filters = {}) => {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: () => postApi.getPosts(filters),
  });
};

const usePost = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postApi.getPostById(id),
    enabled: !!id,
  });
};

const useCreatePost = () => {
  return useMutation({
    mutationFn: postApi.createPost,
  });
};

describe("Post Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usePosts", () => {
    it("should fetch posts successfully", async () => {
      const mockResult = {
        posts: [
          {
            id: "1",
            title: "Test Post",
            content: "Test content",
            excerpt: "Test excerpt",
            slug: "test-post",
            viewCount: 10,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
          },
        ],
        pagination: {
          page: 1,
          limit: 3,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockPostApi.getPosts.mockResolvedValue(mockResult);

      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResult);
      expect(mockPostApi.getPosts).toHaveBeenCalledWith({});
    });

    it("should handle fetch errors", async () => {
      mockPostApi.getPosts.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(new Error("Network error"));
    });
  });

  describe("usePost", () => {
    it("should fetch post by ID successfully", async () => {
      const mockPost = {
        id: "1",
        title: "Test Post",
        content: "Test content",
        excerpt: "Test excerpt",
        slug: "test-post",
        viewCount: 5,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      mockPostApi.getPostById.mockResolvedValue(mockPost);

      const { result } = renderHook(() => usePost("1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPost);
      expect(mockPostApi.getPostById).toHaveBeenCalledWith("1");
    });

    it("should not fetch when ID is empty", () => {
      const { result } = renderHook(() => usePost(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockPostApi.getPostById).not.toHaveBeenCalled();
    });
  });

  describe("useCreatePost", () => {
    it("should create post successfully", async () => {
      const createPostDto = {
        title: "New Post",
        content: "New content",
        excerpt: "New excerpt",
        slug: "new-post",
      };

      const mockCreatedPost = {
        id: "1",
        ...createPostDto,
        viewCount: 0,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      mockPostApi.createPost.mockResolvedValue(mockCreatedPost);

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(createPostDto);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCreatedPost);
      expect(mockPostApi.createPost).toHaveBeenCalledWith(createPostDto);
    });

    it("should handle creation errors", async () => {
      mockPostApi.createPost.mockRejectedValue(new Error("Title is required"));

      const { result } = renderHook(() => useCreatePost(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ title: "", content: "Content" });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(new Error("Title is required"));
    });
  });
});
