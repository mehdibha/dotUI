import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";
import { authClient } from "@/modules/auth/client";

export function useUserStyles() {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  return useQuery({
    ...trpc.style.getMyStyles.queryOptions({}),
    enabled: !!session?.user,
  });
}
