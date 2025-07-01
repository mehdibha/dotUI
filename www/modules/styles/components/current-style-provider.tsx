"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { StyleProvider } from "@dotui/ui";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { authClient } from "@/modules/auth/lib/client";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useTRPC } from "@/trpc/react";

export function CurrentStyleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = authClient.useSession();
  const { currentMode, currentStyleSlug } = usePreferences();

  const selectedStyle = session.data
    ? session.data.user.selectedStyle
    : currentStyleSlug;

  const trpc = useTRPC();
  const { data: style, isSuccess } = useSuspenseQuery(
    trpc.style.bySlug.queryOptions({
      slug: selectedStyle,
    }),
  );

  if (!isSuccess || !style) {
    return <Skeleton>{children}</Skeleton>;
  }

  return (
    <StyleProvider mode={currentMode} style={style}>
      {children}
    </StyleProvider>
  );
}
