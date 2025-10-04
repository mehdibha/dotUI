import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/lib/client";
import { usePreferences } from "../atoms/preferences-atom";

export function useActiveStyleId() {
  const trpc = useTRPC();

  const { data: session } = authClient.useSession();
  const { activeStyleId: localActiveStyleId } = usePreferences();

  const { data: authedActiveStyleId } = useQuery({
    ...trpc.style.getActive.queryOptions(),
    retry: false,
    enabled: !!session,
  });

  const { data: featuredStyles } = useQuery(
    trpc.style.getPublicStyles.queryOptions({
      featured: true,
      limit: 1,
    }),
  );

  return authedActiveStyleId || localActiveStyleId || featuredStyles?.[0]?.id;
}

export function useActiveStyle() {
  const trpc = useTRPC();

  const activeStyleId = useActiveStyleId();

  return useQuery({
    ...trpc.style.getById.queryOptions({
      id: activeStyleId!,
    }),
    enabled: !!activeStyleId,
    placeholderData: (prev) => prev,
  });
}

export function useActiveStyleSuspense() {
  const trpc = useTRPC();

  const activeStyleId = useActiveStyleId();

  return useSuspenseQuery({
    ...trpc.style.getById.queryOptions({
      id: activeStyleId!,
    }),
  });
}
