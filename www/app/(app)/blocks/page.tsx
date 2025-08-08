import { featuredBlocks } from "@dotui/registry-definition/registry-blocks";

import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server";
import { BlockView } from "@/modules/blocks/block-view";

export default async function BlocksPage() {
  prefetch(trpc.style.getFeatured.queryOptions({}));

  return (
    <HydrateClient>
      <div className="space-y-6">
        {featuredBlocks.map((block) => (
          <div key={block}>
            <BlockView name={block} />
          </div>
        ))}
      </div>
    </HydrateClient>
  );
}
