import { StylesList } from "@/modules/styles/components/styles-list";

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
  return <StylesList />;
}
