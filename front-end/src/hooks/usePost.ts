import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "../lib/api";
import { queryKeys } from "../lib/query-client";
import {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostFilterQuery,
  PaginatedPosts,
} from "../types/api";

export const usePosts = (filters: PostFilterQuery = {}) => {
  return useQuery({
    queryKey: queryKeys.posts.list(filters as Record<string, unknown>),
    queryFn: () => postApi.getPosts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postApi.getPostById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.posts.bySlug(slug),
    queryFn: () => postApi.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onMutate: async (newPost: CreatePostDto) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.lists() });

      const previousPosts = queryClient.getQueriesData<PaginatedPosts>({
        queryKey: queryKeys.posts.lists(),
      });

      queryClient.setQueriesData<PaginatedPosts>(
        { queryKey: queryKeys.posts.lists() },
        (old) => {
          if (!old) return old;

          const tempPost: Post = {
            id: `temp-${Date.now()}`,
            title: newPost.title,
            content: newPost.content,
            excerpt: newPost.excerpt || null,
            slug: newPost.slug || `temp-slug-${Date.now()}`,
            viewCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            posts: [tempPost, ...old.posts],
            pagination: {
              ...old.pagination,
              total: old.pagination.total + 1,
            },
          };
        }
      );

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostDto }) =>
      postApi.updatePost(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(id) });

      const previousPost = queryClient.getQueryData<Post>(
        queryKeys.posts.detail(id)
      );

      if (previousPost) {
        const updatedPost: Post = {
          ...previousPost,
          ...data,
          slug: data.slug || previousPost.slug,
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(queryKeys.posts.detail(id), updatedPost);

        queryClient.setQueriesData<PaginatedPosts>(
          { queryKey: queryKeys.posts.lists() },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              posts: old.posts.map((post) =>
                post.id === id ? updatedPost : post
              ),
            };
          }
        );
      }

      return { previousPost, id };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost && context?.id) {
        queryClient.setQueryData(
          queryKeys.posts.detail(context.id),
          context.previousPost
        );
      }
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.deletePost,
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });

      const previousPosts = queryClient.getQueriesData<PaginatedPosts>({
        queryKey: queryKeys.posts.lists(),
      });

      const previousPost = queryClient.getQueryData<Post>(
        queryKeys.posts.detail(postId)
      );

      queryClient.setQueriesData<PaginatedPosts>(
        { queryKey: queryKeys.posts.lists() },
        (old) => {
          if (!old) return old;
          return {
            posts: old.posts.filter((post) => post.id !== postId),
            pagination: {
              ...old.pagination,
              total: Math.max(0, old.pagination.total - 1),
            },
          };
        }
      );

      queryClient.setQueriesData<PaginatedPosts>(
        { queryKey: queryKeys.posts.all },
        (old) => {
          if (!old) return old;

          return {
            posts: old.posts.filter((post) => post.id !== postId),
            pagination: {
              ...old.pagination,
              total: Math.max(0, old.pagination.total - 1),
            },
          };
        }
      );

      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });

      return { previousPosts, previousPost, postId };
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousPost && context?.postId) {
        queryClient.setQueryData(
          queryKeys.posts.detail(context.postId),
          context.previousPost
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};
