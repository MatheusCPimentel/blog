import { QueryClient } from "@tanstack/react-query";

const getQueryClientConfig = () => ({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount: number, error: unknown) => {
        if (error instanceof Error && error.message.includes("40")) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      gcTime: 5 * 1000,
    },
  },
});

export const createQueryClient = () => new QueryClient(getQueryClientConfig());

export const queryClient = createQueryClient();

export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.posts.all, "slug", slug] as const,
    published: (filters: Record<string, unknown>) =>
      [...queryKeys.posts.all, "published", filters] as const,
  },
} as const;
