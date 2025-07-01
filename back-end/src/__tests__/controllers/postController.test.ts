import { Request, Response, NextFunction } from "express";

const mockPostServiceInstance = {
  createPost: jest.fn(),
  getPosts: jest.fn(),
  getPostById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  getPostBySlug: jest.fn(),
  incrementViewCount: jest.fn(),
};

jest.mock("../../services/postService", () => ({
  PostService: jest.fn().mockImplementation(() => mockPostServiceInstance),
}));

import { PostController } from "../../controllers/postController";

describe("PostController", () => {
  let postController: PostController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    Object.values(mockPostServiceInstance).forEach((mock) => {
      if (typeof mock === "function" && mock.mockReset) {
        mock.mockReset();
      }
    });

    postController = new PostController();

    mockRequest = {
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe("createPost", () => {
    it("should create a new post successfully", async () => {
      const postData = {
        title: "Test Post",
        content: "Test content",
        excerpt: "Test excerpt",
        slug: "test-post",
      };

      const createdPost = {
        id: "1",
        ...postData,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = postData;
      mockPostServiceInstance.createPost.mockResolvedValue(createdPost);

      await postController.createPost(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockPostServiceInstance.createPost).toHaveBeenCalledWith(postData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createdPost,
        message: "Post created successfully",
      });
    });
  });

  describe("getPosts", () => {
    it("should retrieve posts with pagination", async () => {
      const mockResult = {
        posts: [
          {
            id: "1",
            title: "Test Post",
            content: "Test content",
            excerpt: "Test excerpt",
            slug: "test-post",
            viewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
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

      mockRequest.query = { page: "1", limit: "3" };
      mockPostServiceInstance.getPosts.mockResolvedValue(mockResult);

      await postController.getPosts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockPostServiceInstance.getPosts).toHaveBeenCalledWith({
        page: "1",
        limit: "3",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.posts,
        pagination: mockResult.pagination,
        message: "Posts retrieved successfully",
      });
    });
  });

  describe("getPostById", () => {
    it("should retrieve a post by ID", async () => {
      const mockPost = {
        id: "1",
        title: "Test Post",
        content: "Test content",
        excerpt: "Test excerpt",
        slug: "test-post",
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: "1" };
      mockPostServiceInstance.getPostById.mockResolvedValue(mockPost);

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockPostServiceInstance.getPostById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockPost,
        message: "Post retrieved successfully",
      });
    });

    it("should return 404 when post not found", async () => {
      mockRequest.params = { id: "999" };
      mockPostServiceInstance.getPostById.mockResolvedValue(null);

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockPostServiceInstance.getPostById).toHaveBeenCalledWith("999");
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Post not found",
      });
    });

    it("should return 400 when ID is missing", async () => {
      mockRequest.params = {};

      await postController.getPostById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Post ID is required",
      });
    });
  });
});
