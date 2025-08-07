import { featuredBlocks } from "@dotui/registry-definition/registry-blocks";

import { BlockView } from "@/modules/blocks/block-view";

export const dynamic = "force-dynamic";

export default function BlocksPage() {
  return (
    <div className="space-y-6">
      {featuredBlocks.map((block) => (
        <div key={block}>
          <BlockView name={block} />
        </div>
      ))}
    </div>
  );
}
