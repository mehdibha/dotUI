import { StylesList } from "@/modules/styles/components/styles-list";
import { caller } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export default async function MyStylesPage() {
  const styles = await caller.style.getMine({});
  return <StylesList styles={styles} />;
}
