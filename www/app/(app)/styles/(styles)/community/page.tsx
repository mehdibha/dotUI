import { caller } from "@/lib/trpc/server";
import { StylesList } from "@/modules/styles/components/styles-list";

export const dynamic = "force-static";

export default async function CommunityStylesPage() {
  const styles = await caller.style.getPublicRecent({});
  return <StylesList styles={styles} />;
}
