import React from "react";
import { render, screen } from "@testing-library/react";

function PostTitle({ title }: { title: string }) {
  return <h1 data-testid="post-title">{title}</h1>;
}

function PostCard({
  post,
}: {
  post: { title: string; excerpt: string; viewCount: number };
}) {
  return (
    <article data-testid="post-card">
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span data-testid="view-count">Views: {post.viewCount}</span>
    </article>
  );
}

function PostList({
  posts,
}: {
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    viewCount: number;
  }>;
}) {
  if (posts.length === 0) {
    return <div data-testid="empty-message">No posts found</div>;
  }

  return (
    <div data-testid="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

describe("Blog Components", () => {
  describe("PostTitle", () => {
    it("should render post title correctly", () => {
      render(<PostTitle title="My Amazing Blog Post" />);

      expect(screen.getByTestId("post-title")).toBeInTheDocument();
      expect(screen.getByText("My Amazing Blog Post")).toBeInTheDocument();
    });
  });

  describe("PostCard", () => {
    it("should render post information correctly", () => {
      const mockPost = {
        title: "Getting Started with TypeScript",
        excerpt:
          "Learn the basics of TypeScript for better JavaScript development.",
        viewCount: 142,
      };

      render(<PostCard post={mockPost} />);

      expect(
        screen.getByText("Getting Started with TypeScript")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Learn the basics of TypeScript for better JavaScript development."
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId("view-count")).toHaveTextContent("Views: 142");
    });
  });

  describe("PostList", () => {
    it("should render list of posts", () => {
      const mockPosts = [
        {
          id: "1",
          title: "JavaScript Best Practices",
          excerpt: "Essential tips for writing clean JavaScript code.",
          viewCount: 89,
        },
        {
          id: "2",
          title: "CSS Grid Tutorial",
          excerpt: "Master CSS Grid for modern layouts.",
          viewCount: 156,
        },
      ];

      render(<PostList posts={mockPosts} />);

      expect(screen.getByTestId("post-list")).toBeInTheDocument();
      expect(screen.getByText("JavaScript Best Practices")).toBeInTheDocument();
      expect(screen.getByText("CSS Grid Tutorial")).toBeInTheDocument();
    });

    it("should show empty message when no posts", () => {
      render(<PostList posts={[]} />);

      expect(screen.getByTestId("empty-message")).toBeInTheDocument();
      expect(screen.getByText("No posts found")).toBeInTheDocument();
    });
  });
});
