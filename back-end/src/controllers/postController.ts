import { Request, Response } from "express";
import { PostService } from "../services/postService";
import {
  CreatePostDto,
  UpdatePostDto,
  PostFilterQuery,
  ApiResponse,
} from "../types";
import { asyncHandler } from "../middleware/errorHandler";

const postService = new PostService();

export class PostController {
  createPost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const postData: CreatePostDto = req.body;

      const post = await postService.createPost(postData);

      const response: ApiResponse = {
        success: true,
        data: post,
        message: "Post created successfully",
      };

      res.status(201).json(response);
    }
  );

  getPosts = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const filters: PostFilterQuery = req.query;

      const result = await postService.getPosts(filters);

      const response: ApiResponse = {
        success: true,
        data: result.posts,
        pagination: result.pagination,
        message: "Posts retrieved successfully",
      };

      res.status(200).json(response);
    }
  );

  getPostById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: "Post ID is required",
        };
        res.status(400).json(response);
        return;
      }

      const post = await postService.getPostById(id as string);

      if (!post) {
        const response: ApiResponse = {
          success: false,
          error: "Post not found",
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: post,
        message: "Post retrieved successfully",
      };

      res.status(200).json(response);
    }
  );

  getPostBySlug = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { slug } = req.params;

      if (!slug) {
        const response: ApiResponse = {
          success: false,
          error: "Post slug is required",
        };
        res.status(400).json(response);
        return;
      }

      const post = await postService.getPostBySlug(slug as string);

      if (!post) {
        const response: ApiResponse = {
          success: false,
          error: "Post not found",
        };
        res.status(404).json(response);
        return;
      }

      await postService.incrementViewCount(post.id);

      const response: ApiResponse = {
        success: true,
        data: post,
        message: "Post retrieved successfully",
      };

      res.status(200).json(response);
    }
  );

  updatePost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updateData: UpdatePostDto = req.body;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: "Post ID is required",
        };
        res.status(400).json(response);
        return;
      }

      const existingPost = await postService.getPostById(id as string);
      if (!existingPost) {
        const response: ApiResponse = {
          success: false,
          error: "Post not found",
        };
        res.status(404).json(response);
        return;
      }

      const post = await postService.updatePost(id as string, updateData);

      const response: ApiResponse = {
        success: true,
        data: post,
        message: "Post updated successfully",
      };

      res.status(200).json(response);
    }
  );

  deletePost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: "Post ID is required",
        };
        res.status(400).json(response);
        return;
      }

      const existingPost = await postService.getPostById(id as string);
      if (!existingPost) {
        const response: ApiResponse = {
          success: false,
          error: "Post not found",
        };
        res.status(404).json(response);
        return;
      }

      await postService.deletePost(id as string);

      const response: ApiResponse = {
        success: true,
        message: "Post deleted successfully",
      };

      res.status(200).json(response);
    }
  );

  incrementViewCount = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: "Post ID is required",
        };
        res.status(400).json(response);
        return;
      }

      const post = await postService.incrementViewCount(id as string);

      const response: ApiResponse = {
        success: true,
        data: post,
        message: "View count incremented successfully",
      };

      res.status(200).json(response);
    }
  );
}
