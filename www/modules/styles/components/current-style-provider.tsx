"use client";

import { useQuery } from "@tanstack/react-query";

import { StyleProvider } from "@dotui/ui";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { useMounted } from "@/hooks/use-mounted";
import { useTRPC } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/lib/client";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export function CurrentStyleProvider(
  props: Omit<React.ComponentProps<"div">, "style">,
) {
  const isMounted = useMounted();
  const session = authClient.useSession();
  const { currentMode, currentStyleSlug } = usePreferences();

  const selectedStyle = session.data
    ? session.data.user.selectedStyle
    : currentStyleSlug;

  const trpc = useTRPC();
  const { data: style } = useQuery({
    ...trpc.style.bySlug.queryOptions({
      slug: selectedStyle,
    }),
    enabled: isMounted,
    placeholderData: (prev) => prev,
  });

  if (!style || !isMounted) {
    return <Skeleton>{props.children}</Skeleton>;
  }

  return (
    <StyleProvider mode={currentMode} style={style} {...props}>
      {props.children}
    </StyleProvider>
  );
}
