"use client";

import React from "react";
import { X, Check } from "lucide-react";

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  excerpt?: string;
  general?: string;
}

interface PostFormProps {
  isEditing: boolean;
  formData: PostFormData;
  formErrors: FormErrors;
  onFormDataChange: (data: PostFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  isEditing,
  formData,
  formErrors,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const computeButtonText = () => {
    if (isSubmitting) {
      return isEditing ? "Updating..." : "Creating...";
    }

    return isEditing ? "Update Post" : "Create Post";
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        isEditing ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"
      }`}
    >
      <h4 className="font-medium text-gray-900 mb-4">
        {isEditing ? "Edit Post" : "Create New Post"}
      </h4>

      {formErrors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{formErrors.general}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>

          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              onFormDataChange({ ...formData, title: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.title
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-emerald-500"
            }`}
            placeholder="Enter post title"
          />

          {formErrors.title && (
            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Excerpt
          </label>
          <input
            type="text"
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              onFormDataChange({ ...formData, excerpt: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.excerpt
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-emerald-500"
            }`}
            placeholder="Brief description of the post"
          />
          {formErrors.excerpt && (
            <p className="mt-1 text-sm text-red-600">{formErrors.excerpt}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content *
          </label>

          <textarea
            id="content"
            rows={4}
            value={formData.content}
            onChange={(e) =>
              onFormDataChange({ ...formData, content: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.content
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-emerald-500"
            }`}
            placeholder="Write your post content here..."
          />

          {formErrors.content && (
            <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span>{computeButtonText()}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
};
