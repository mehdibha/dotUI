import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";

export function useFeaturedStyles() {
  const trpc = useTRPC();
  return useQuery(trpc.style.getFeatured.queryOptions({}));
}
