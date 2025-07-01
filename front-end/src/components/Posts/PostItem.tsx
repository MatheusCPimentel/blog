"use client";

import React from "react";
import { Post } from "../../types/api";
import { Edit, Trash2, Eye, Calendar } from "lucide-react";

interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  isDeleting?: boolean;
}

export const PostItem: React.FC<PostItemProps> = ({
  post,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {post.title}
          </h4>

          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount} views</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(post)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit post"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={() => onDelete(post.id)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
            title="Delete post"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {post.excerpt && (
        <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
      )}

      <p className="text-gray-700 text-sm leading-relaxed">
        {truncateText(post.content, 200)}
      </p>
    </div>
  );
};
