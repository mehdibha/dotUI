import { BlockView } from "@/components/block-view";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { slug: "featured" },
    { slug: "authentication" },
    { slug: "marketing" },
  ].map((category) => ({
    categories: [category.slug],
  }));
}

export default async function BlocksPage({
  params,
}: {
  params: { categories?: string[] };
}) {
  return (
    <div>
      <BlockView name="Simple login form" />
      <BlockView name="Simple register form" />
      <BlockView name="Simple password reset form" />
    </div>
  );
}
