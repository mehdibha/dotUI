import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/lib/client";
import { usePreferences } from "../atoms/preferences-atom";

export function useActiveStyleSuspense() {
  const trpc = useTRPC();
  const { activeStyleId: localActiveStyleId } = usePreferences();

  const { data: featuredStyles } = useSuspenseQuery(
    trpc.style.getFeatured.queryOptions({}),
  );

  const { data: authedActiveStyleId } = useSuspenseQuery({
    ...trpc.style.getActive.queryOptions(),
  });

  const activeStyleId =
    authedActiveStyleId || localActiveStyleId || featuredStyles?.[0]?.id;

  if (!activeStyleId) {
    throw new Error("No active style available");
  }

  return useSuspenseQuery(
    trpc.style.getById.queryOptions({
      id: activeStyleId,
    }),
  );
}
