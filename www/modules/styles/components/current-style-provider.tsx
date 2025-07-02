"use client";

import { useQuery } from "@tanstack/react-query";

import { StyleProvider } from "@dotui/ui";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { useMounted } from "@/hooks/use-mounted";
import { authClient } from "@/modules/auth/lib/client";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useTRPC } from "@/trpc/react";

export function CurrentStyleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMounted = useMounted();
  const session = authClient.useSession();
  const { currentMode, currentStyleSlug } = usePreferences();

  const selectedStyle = session.data
    ? session.data.user.selectedStyle
    : currentStyleSlug;

  const trpc = useTRPC();
  const { data: style, isSuccess } = useQuery({
    ...trpc.style.bySlug.queryOptions({
      slug: selectedStyle,
    }),
    enabled: isMounted,
  });

  if (!isSuccess || !style || !isMounted) {
    return <Skeleton>{children}</Skeleton>;
  }

  return (
    <StyleProvider mode={currentMode} style={style}>
      {children}
    </StyleProvider>
  );
}
