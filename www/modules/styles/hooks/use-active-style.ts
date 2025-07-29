import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/lib/client";
import { usePreferences } from "../atoms/preferences-atom";

export function useActiveStyle() {
  const trpc = useTRPC();

  const { data: session } = authClient.useSession();
  const { activeStyleId: localActiveStyleId } = usePreferences();

  const { data: authedActiveStyle } = useQuery({
    ...trpc.style.getActiveStyleId.queryOptions(),
    retry: false,
    enabled: !!session,
  });

  const { data: featuredStyles } = useQuery(
    trpc.style.featured.queryOptions({
      limit: 1,
    }),
  );

  const activeStyleId =
    authedActiveStyle || localActiveStyleId || featuredStyles?.[0]?.id;

  return useQuery({
    ...trpc.style.byId.queryOptions({
      id: activeStyleId,
    }),
    enabled: !!activeStyleId,
    placeholderData: (prev) => prev,
  });

}
