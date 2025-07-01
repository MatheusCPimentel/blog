import MockAdapter from "axios-mock-adapter";
import {
  CreatePostDto,
  UpdatePostDto,
  Post,
  ApiResponse,
} from "../../types/api";

import api from "../../lib/api";

const mockAxios = new MockAdapter(api);

describe("postApi", () => {
  const baseURL = "http://localhost:3001/api";

  beforeEach(() => {
    mockAxios.reset();
  });

  afterAll(() => {
    mockAxios.restore();
  });

  describe("getPosts", () => {
    it("should fetch posts successfully", async () => {
      const mockPosts: Post[] = [
        {
          id: "1",
          title: "Test Post 1",
          content: "Content 1",
          excerpt: "Excerpt 1",
          slug: "test-post-1",
          viewCount: 10,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          title: "Test Post 2",
          content: "Content 2",
          excerpt: "Excerpt 2",
          slug: "test-post-2",
          viewCount: 20,
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
        },
      ];

      const mockResponse: ApiResponse<Post[]> = {
        success: true,
        data: mockPosts,
        pagination: {
          page: 1,
          limit: 3,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockAxios.onGet("/posts?").reply(200, mockResponse);

      const { postApi } = await import("../../lib/api");
      const result = await postApi.getPosts();

      expect(result).toEqual({
        posts: mockPosts,
        pagination: mockResponse.pagination,
      });
    });

    it("should fetch posts with search filter", async () => {
      const mockResponse: ApiResponse<Post[]> = {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 3,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockAxios.onGet("/posts?search=javascript").reply(200, mockResponse);

      const { postApi } = await import("../../lib/api");
      const result = await postApi.getPosts({ search: "javascript" });

      expect(result).toEqual({
        posts: [],
        pagination: mockResponse.pagination,
      });
    });

    it("should handle API errors", async () => {
      mockAxios.onGet("/posts?").reply(500, {
        success: false,
        error: "Internal server error",
      });

      const { postApi } = await import("../../lib/api");
      await expect(postApi.getPosts()).rejects.toThrow("Internal server error");
    });
  });

  describe("getPostById", () => {
    it("should fetch post by ID successfully", async () => {
      const mockPost: Post = {
        id: "1",
        title: "Test Post",
        content: "Test content",
        excerpt: "Test excerpt",
        slug: "test-post",
        viewCount: 5,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      const mockResponse: ApiResponse<Post> = {
        success: true,
        data: mockPost,
      };

      mockAxios.onGet("/posts/1").reply(200, mockResponse);

      const { postApi } = await import("../../lib/api");
      const result = await postApi.getPostById("1");

      expect(result).toEqual(mockPost);
    });

    it("should throw error when post not found", async () => {
      mockAxios.onGet("/posts/999").reply(404, {
        success: false,
        error: "Post not found",
      });

      const { postApi } = await import("../../lib/api");
      await expect(postApi.getPostById("999")).rejects.toThrow(
        "Post not found"
      );
    });
  });

  describe("getPostBySlug", () => {
    it("should fetch post by slug successfully", async () => {
      const mockPost: Post = {
        id: "1",
        title: "Test Post",
        content: "Test content",
        excerpt: "Test excerpt",
        slug: "test-post",
        viewCount: 5,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      const mockResponse: ApiResponse<Post> = {
        success: true,
        data: mockPost,
      };

      mockAxios
        .onGet(`${baseURL}/posts/slug/test-post`)
        .reply(200, mockResponse);

      const { postApi } = await import("../../lib/api");
      const result = await postApi.getPostBySlug("test-post");

      expect(result).toEqual(mockPost);
    });
  });

  describe("createPost", () => {
    it("should create post successfully", async () => {
      const createPostDto: CreatePostDto = {
        title: "New Post",
        content: "New content that is long enough",
        excerpt: "New excerpt",
        slug: "new-post",
      };

      const mockCreatedPost: Post = {
        id: "1",
        title: createPostDto.title,
        content: createPostDto.content,
        excerpt: createPostDto.excerpt || "",
        slug: createPostDto.slug || "",
        viewCount: 0,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      const mockResponse: ApiResponse<Post> = {
        success: true,
        data: mockCreatedPost,
      };

      mockAxios.onPost("/posts").reply(201, mockResponse);

      const { postApi } = await import("../../lib/api");
      const result = await postApi.createPost(createPostDto);

      expect(result).toEqual(mockCreatedPost);
    });

    it("should handle creation errors", async () => {
      const createPostDto: CreatePostDto = {
        title: "",
        content: "Content",
      };

      mockAxios.onPost("/posts").reply(400, {
        success: false,
        error: "Title is required",
      });

      const { postApi } = await import("../../lib/api");
      await expect(postApi.createPost(createPostDto)).rejects.toThrow(
        "Title is required"
      );
    });
  });

  describe("updatePost", () => {
    it("should update post successfully", async () => {
      const updatePostDto: UpdatePostDto = {
        title: "Updated Title",
        content: "Updated content",
      };

      const mockUpdatedPost: Post = {
        id: "1",
        title: "Updated Title",
        content: "Updated content",
        excerpt: "Test excerpt",
        slug: "test-post",
        viewCount: 5,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      };

      const mockResponse: ApiResponse<Post> = {
        success: true,
        data: mockUpdatedPost,
      };

      mockAxios
        .onPut(`${baseURL}/posts/1`, updatePostDto)
        .reply(200, mockResponse);

      const { postApi } = await import("../../lib/api");
      const result = await postApi.updatePost("1", updatePostDto);

      expect(result).toEqual(mockUpdatedPost);
    });

    it("should handle update errors", async () => {
      mockAxios.onPut(`${baseURL}/posts/999`).reply(404, {
        success: false,
        error: "Post not found",
      });

      const { postApi } = await import("../../lib/api");
      await expect(
        postApi.updatePost("999", { title: "New Title" })
      ).rejects.toThrow("Post not found");
    });
  });

  describe("deletePost", () => {
    it("should delete post successfully", async () => {
      const mockResponse: ApiResponse = {
        success: true,
        message: "Post deleted successfully",
      };

      mockAxios.onDelete(`${baseURL}/posts/1`).reply(200, mockResponse);

      const { postApi } = await import("../../lib/api");
      await expect(postApi.deletePost("1")).resolves.not.toThrow();
    });

    it("should handle deletion errors", async () => {
      mockAxios.onDelete(`${baseURL}/posts/999`).reply(404, {
        success: false,
        error: "Post not found",
      });

      const { postApi } = await import("../../lib/api");
      await expect(postApi.deletePost("999")).rejects.toThrow("Post not found");
    });
  });
});
