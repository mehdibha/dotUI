"use client";

import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useMounted } from "@/hooks/use-mounted";
import { useTRPC } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/lib/client";
import { StylesList } from "@/modules/styles/components/styles-list";

export function MyStyles() {
  const trpc = useTRPC();
  const isMounted = useMounted();
  const { data: session, isPending } = authClient.useSession();

  const { data: styles, isLoading } = useQuery({
    ...trpc.style.getMyStyles.queryOptions({}),
    enabled: !!session?.user,
    retry: false,
  });

  if (isMounted && !isPending && !session?.user) {
    redirect("/login");
  }

  return (
    <StylesList
      styles={styles ?? []}
      skeleton={isLoading || !isMounted}
      search
    />
  );
}
