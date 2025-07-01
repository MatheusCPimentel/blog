"use client";

import React, { useState } from "react";
import {
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from "../../hooks/usePost";
import { Post, CreatePostDto, UpdatePostDto } from "../../types/api";
import { Plus, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { createPostSchema, updatePostSchema } from "../../lib/validation";
import { z } from "zod";
import { PostItem } from "./PostItem";
import { Pagination } from "../shared/Pagination";
import { PostForm } from "./PostForm";

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
}

interface EditingPost {
  id: string;
  data: PostFormData;
}

interface FormErrors {
  title?: string;
  content?: string;
  excerpt?: string;
  general?: string;
}

export const PostsList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<EditingPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    excerpt: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = usePosts({
    page: currentPage.toString(),
    limit: "3",
  });

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const validateForm = (data: PostFormData, isUpdate: boolean = false) => {
    const schema = isUpdate ? updatePostSchema : createPostSchema;

    try {
      schema.parse(data);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          if (field) {
            errors[field] = err.message;
          }
        });

        setFormErrors(errors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm(formData, !!editingPost);

    if (!isValid) {
      return;
    }

    try {
      if (editingPost) {
        await updatePostMutation.mutateAsync({
          id: editingPost.id,
          data: formData as UpdatePostDto,
        });

        toast.success("Post updated successfully!");
        setEditingPost(null);
      } else {
        await createPostMutation.mutateAsync(formData as CreatePostDto);
        toast.success("Post created successfully!");
        setShowForm(false);
      }

      resetForm();
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };

      if (
        errorResponse?.response?.data?.message?.includes("Validation failed")
      ) {
        const serverMessage = errorResponse.response.data.message;
        setFormErrors({ general: serverMessage });
        toast.error("Please check the form for errors");
      } else {
        toast.error(
          editingPost ? "Failed to update post" : "Failed to create post"
        );
      }
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost({
      id: post.id,
      data: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
      },
    });

    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
    });

    setShowForm(false);
    setFormErrors({});
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePostMutation.mutateAsync(postId);
        toast.success("Post deleted successfully!");
      } catch {
        toast.error("Failed to delete post");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
    });

    setFormErrors({});
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
    setEditingPost(null);
    resetForm();
  };

  const handleCancelForm = () => {
    if (editingPost) {
      setEditingPost(null);
    } else {
      setShowForm(false);
    }

    resetForm();
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Failed to load posts</p>

        <button
          onClick={() => refetch()}
          className="mt-2 text-emerald-600 hover:text-emerald-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const hasToShowPostForm = showForm || !!editingPost;
  const hasToShowPostItems = postsData?.posts && postsData.posts.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Posts ({postsData?.pagination.total || 0})
        </h3>

        <button
          onClick={handleShowForm}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Post</span>
        </button>
      </div>

      {hasToShowPostForm && (
        <PostForm
          isEditing={!!editingPost}
          formData={formData}
          formErrors={formErrors}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isSubmitting={
            editingPost
              ? updatePostMutation.isPending
              : createPostMutation.isPending
          }
        />
      )}

      <div className="space-y-4 min-h-[600px]">
        {hasToShowPostItems ? (
          postsData.posts.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deletePostMutation.isPending}
            />
          ))
        ) : (
          <div className="text-center p-8">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>

            <p className="text-gray-600 mb-2">No posts found</p>
            <p className="text-sm text-gray-500">Create your first post!</p>
          </div>
        )}
      </div>

      {postsData?.pagination && postsData.pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={postsData.pagination.totalPages}
          hasNext={postsData.pagination.hasNext}
          hasPrev={postsData.pagination.hasPrev}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
