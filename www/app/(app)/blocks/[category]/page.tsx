import { notFound } from "next/navigation";

import {
  blocksCategories,
  registryBlocks,
} from "@dotui/registry-definition/registry-blocks";

import { BlockView } from "@/modules/blocks/block-view";

export const dynamicParams = false;

export async function generateStaticParams() {
  return blocksCategories
    .filter((category) => !category.slug.includes("featured"))
    .map((category) => ({
      category: category.slug,
    }));
}

export default async function BlocksPage({
  params,
}: PageProps<"/blocks/[category]">) {
  const { category } = await params;

  const blocks = registryBlocks.filter((block) =>
    block.categories?.includes(category),
  );

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockView key={block.name} name={block.name} />
      ))}
    </div>
  );
}
