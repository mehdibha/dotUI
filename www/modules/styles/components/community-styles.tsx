"use client";

import { useQuery } from "@tanstack/react-query";

import { useMounted } from "@/hooks/use-mounted";
import { useTRPC } from "@/lib/trpc/react";
import { StylesList } from "@/modules/styles/components/styles-list";

export function CommunityStyles() {
  const trpc = useTRPC();
  const isMounted = useMounted();

  const { data: styles, isLoading } = useQuery({
    ...trpc.style.getPublicRecent.queryOptions({}),
    retry: false,
  });

  if (!isMounted) {
    return <StylesList skeleton />;
  }

  return <StylesList styles={styles ?? []} skeleton={isLoading} />;
}
