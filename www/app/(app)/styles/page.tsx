import { caller, HydrateClient, prefetch, trpc } from "@/lib/trpc/server";
import { StylesList } from "@/modules/styles/components/styles-list";

export const dynamic = "force-static";

export default async function FeaturedStylesPage() {
  const styles = await caller.style.all({ isFeatured: true });

  return <StylesList styles={styles} />;
}
