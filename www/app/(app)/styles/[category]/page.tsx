import { StylesList } from "@/modules/styles/components/styles-list";
import { prefetch, trpc } from "@/trpc/server";

export const dynamicParams = false;

const categories = [{ slug: "community", label: "Community" }];

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryStylesPage({
  params,
}: {
  params: { category?: string };
}) {
  prefetch(
    trpc.style.all.queryOptions({
      isFeatured: true,
    }),
  );

  return <StylesList />;
}
