import { prefetch, trpc } from "@/lib/trpc/server";
import { StylesList } from "@/modules/styles/components/styles-list";

export const dynamicParams = false;

const categories: { slug: string; label: string }[] = [];

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryStylesPage({
  params,
}: {
  params: Promise<{ category?: string }>;
}) {
  await prefetch(trpc.style.all.queryOptions({ isFeatured: true }));
  return <StylesList styles={[]} />;
}
