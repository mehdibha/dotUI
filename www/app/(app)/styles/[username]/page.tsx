import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/lib/trpc/react";

export default function UserStylesPage() {
  const trpc = useTRPC();

  const styles = useQuery(trpc.style.getUserStyles.queryOptions());

  return <StylesList styles={styles} />;
}
