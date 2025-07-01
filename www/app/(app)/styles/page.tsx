import { StylesList } from "@/modules/styles/components/styles-list";
import { prefetch, trpc } from "@/trpc/server";

export default function FeaturedStylesPage() {
  prefetch(
    trpc.style.all.queryOptions({
      isFeatured: true,
    }),
  );
  return <StylesList />;
}
