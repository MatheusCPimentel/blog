import { z } from "zod";

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

export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
