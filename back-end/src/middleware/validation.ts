import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "./errorHandler";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title cannot exceed 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  excerpt: z
    .string()
    .max(300, "Excerpt cannot exceed 300 characters")
    .optional(),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(),
});

export const updatePostSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),
    content: z
      .string()
      .min(10, "Content must be at least 10 characters long")
      .optional(),
    excerpt: z
      .string()
      .max(300, "Excerpt cannot exceed 300 characters")
      .nullable()
      .optional(),
    slug: z
      .string()
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      )
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val))
    .pipe(z.number().int().min(1).max(100)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        throw new AppError(`Validation failed: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req.query);
      req.query = result as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        throw new AppError(`Validation failed: ${messages.join(", ")}`, 400);
      }
      throw error;
    }
  };
};

export const validateCreatePost = validate(createPostSchema);
export const validateUpdatePost = validate(updatePostSchema);
export const validatePagination = validateQuery(paginationSchema);
