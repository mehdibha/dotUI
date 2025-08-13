"use client";

import React from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/components/page-layout";
import { useMounted } from "@/hooks/use-mounted";
import { useTRPCClient } from "@/lib/trpc/react";
import { StylesList } from "@/modules/styles/components/styles-list";

const PAGE_SIZE = 8;

export default function AdminStylesModerationPage() {
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();
  const isMounted = useMounted();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["style.getPublicRecent", { type: "infinite", limit: PAGE_SIZE }],
      initialPageParam: 0,
      retry: false,
      queryFn: async ({ pageParam }) => {
        const offset = typeof pageParam === "number" ? pageParam : 0;
        const items = await trpcClient.style.getPublicRecent.query({
          limit: PAGE_SIZE,
          offset,
        });
        const nextOffset = items.length === PAGE_SIZE ? offset + PAGE_SIZE : undefined;
        return { items, nextOffset };
      },
      getNextPageParam: (lastPage) => lastPage.nextOffset,
    });

  const setFeaturedMutation = useMutation({
    mutationFn: async (variables: { styleId: string; isFeatured: boolean }) => {
      return trpcClient.style.setFeatured.mutate(variables);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["style.getPublicRecent"] });
      void queryClient.invalidateQueries({ queryKey: ["style.getFeatured"] });
    },
  });

  const styles = React.useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!isMounted) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isMounted]);

  if (!isMounted) {
    return <StylesList skeleton defaultView="ui-kit" />;
  }

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Admin: Feature public styles</PageHeaderHeading>
        <PageHeaderDescription>
          Browse recent public styles and toggle whether they are featured.
        </PageHeaderDescription>
        <PageActions />
      </PageHeader>
      <div className="container mt-8 space-y-6">
        <StylesList
          styles={styles}
          skeleton={isLoading && styles.length === 0}
          defaultView="ui-kit"
          onToggleFeatured={(id, next) => setFeaturedMutation.mutate({ styleId: id, isFeatured: next })}
        />
        <div ref={sentinelRef} />
        {isFetchingNextPage && <StylesList skeleton defaultView="ui-kit" />}
      </div>
    </>
  );
}