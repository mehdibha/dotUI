import { BlockView } from "@/components/block-view";

export const dynamicParams = false;

const categories = [
  { slug: "authentication", label: "Authentication" },
  { slug: "marketing", label: "Marketing" },
];

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function BlocksPage({
  params,
}: {
  params: { category?: string };
}) {
  return (
    <div>
      <BlockView name="Simple login form" />
      <BlockView name="Simple register form" />
      <BlockView name="Simple password reset form" />
    </div>
  );
}
