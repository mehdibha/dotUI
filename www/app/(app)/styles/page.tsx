import { StylesList } from "@/modules/styles/components/styles-list";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function FeaturedStylesPage() {
  await prefetch(trpc.style.all.queryOptions({ isFeatured: true }));

  return (
    <HydrateClient>
      <StylesList />
    </HydrateClient>
  );
}
