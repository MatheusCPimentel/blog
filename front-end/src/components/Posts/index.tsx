"use client";

import React from "react";
import { PostsHeader } from "./PostsHeader";
import { PostsList } from "./PostsList";

export const Posts: React.FC = () => {
  return (
    <div className="space-y-6">
      <PostsHeader />
      <PostsList />
    </div>
  );
};
