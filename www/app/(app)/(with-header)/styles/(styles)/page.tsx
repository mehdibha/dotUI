import { caller } from "@/lib/trpc/server";
import { StylesList } from "@/modules/styles/components/styles-list";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function FeaturedStylesPage() {
  const styles = await caller.style.getPublicStyles({ featured: true });

  return <StylesList styles={styles} search />;
}
