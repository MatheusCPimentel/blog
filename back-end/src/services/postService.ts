import { Prisma, Post } from "@prisma/client";
import { db } from "../config/database";
import {
  CreatePostDto,
  UpdatePostDto,
  PostFilterQuery,
  PaginationInfo,
} from "../types";
import { AppError } from "../middleware/errorHandler";

export class PostService {
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  private async ensureUniqueSlug(
    baseSlug: string,
    excludeId?: string
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingPost = await db.post.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existingPost || (excludeId && existingPost.id === excludeId)) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    try {
      let slug = data.slug;
      if (!slug) {
        slug = this.generateSlug(data.title);
      }

      slug = await this.ensureUniqueSlug(slug);

      const post = await db.post.create({
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt ?? null,
          slug,
        },
      });

      return post;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new AppError("Post with this slug already exists", 409);
        }
      }
      throw error;
    }
  }

  async getPosts(filters: PostFilterQuery): Promise<{
    posts: Post[];
    pagination: PaginationInfo;
  }> {
    const page = parseInt(filters.page || "1", 10);
    const limit = parseInt(filters.limit || "3", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { content: { contains: filters.search } },
        { excerpt: { contains: filters.search } },
      ];
    }

    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";

    switch (sortBy) {
      case "title":
        orderBy.title = sortOrder;
        break;
      case "viewCount":
        orderBy.viewCount = sortOrder;
        break;
      case "updatedAt":
        orderBy.updatedAt = sortOrder;
        break;
      default:
        orderBy.createdAt = sortOrder;
    }

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return { posts, pagination };
  }

  async getPostById(id: string): Promise<Post | null> {
    const post = await db.post.findUnique({
      where: { id },
    });

    return post;
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    const post = await db.post.findUnique({
      where: { slug },
    });

    return post;
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    try {
      const existingPost = await db.post.findUnique({
        where: { id },
        select: { id: true, slug: true },
      });

      if (!existingPost) {
        throw new AppError("Post not found", 404);
      }

      let slug = existingPost.slug;

      if (data.title) {
        if (data.slug) {
          slug = data.slug;
        } else {
          slug = this.generateSlug(data.title);
        }
        slug = await this.ensureUniqueSlug(slug, id);
      } else if (data.slug) {
        slug = await this.ensureUniqueSlug(data.slug, id);
      }

      const post = await db.post.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.content && { content: data.content }),
          ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
          slug,
        },
      });

      return post;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("Post not found", 404);
        }
        if (error.code === "P2002") {
          throw new AppError("Post with this slug already exists", 409);
        }
      }
      throw error;
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      await db.post.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("Post not found", 404);
        }
      }
      throw error;
    }
  }

  async incrementViewCount(id: string): Promise<Post> {
    try {
      const post = await db.post.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      return post;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("Post not found", 404);
        }
      }
      throw error;
    }
  }
}
