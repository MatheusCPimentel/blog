"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export const PostsHeader: React.FC = () => {
  return (
    <div className="bg-emerald-50 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-emerald-600 text-white rounded-lg">
          <BookOpen className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-bold text-gray-900">Posts</h2>
      </div>

      <p className="text-gray-600">Create, edit, and manage blog posts</p>
    </div>
  );
};
