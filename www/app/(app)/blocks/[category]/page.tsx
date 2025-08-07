import {
  blocksCategories,
  registryBlocks,
} from "@dotui/registry-definition/registry-blocks";

import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server";
import { BlockView } from "@/modules/blocks/block-view";

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  return blocksCategories.map((category) => ({
    category: category.slug,
  }));
}

export default async function BlocksPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  prefetch(trpc.style.getFeatured.queryOptions({}));

  const { category } = await params;
  const blocks = registryBlocks.filter((block) =>
    block.categories?.includes(category),
  );

  return (
    <HydrateClient>
      <div className="space-y-6">
        {blocks.map((block) => (
          <BlockView key={block.name} name={block.name} />
        ))}
      </div>
    </HydrateClient>
  );
}
