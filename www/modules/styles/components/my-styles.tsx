"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks/use-mounted";
import { authClient } from "@/modules/auth/lib/client";
import { StylesList } from "@/modules/styles/components/styles-list";
import { useUserStyles } from "@/modules/styles/hooks/use-user-styles";

export function MyStyles() {
  const router = useRouter();
  const isMounted = useMounted();
  const { data: session, isPending } = authClient.useSession();

  const { data: styles, isLoading } = useUserStyles();

  React.useEffect(() => {
    if (isMounted && !isPending && !session?.user) {
      router.push("/login");
    }
  }, [isMounted, isPending, session?.user, router]);

  return (
    <StylesList
      styles={styles ?? []}
      isLoading={isLoading || !isMounted || isPending}
      search
    />
  );
}
