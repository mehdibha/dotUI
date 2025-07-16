import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server";
import { StylesList } from "@/modules/styles/components/styles-list";

export const dynamic = "force-static";

export default async function FeaturedStylesPage() {
  await prefetch(trpc.style.all.queryOptions({ isFeatured: true }));

  return (
    <HydrateClient>
      <StylesList />
    </HydrateClient>
  );
}
