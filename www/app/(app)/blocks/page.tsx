import { registryBlocks } from "@dotui/registry-definition/registry-blocks";

import { BlockView } from "@/modules/blocks/block-view";

export default async function BlocksPage(props: PageProps<"/blocks">) {
  const blocks = registryBlocks.filter((block) =>
    block.categories?.includes("featured"),
  );

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockView key={block.name} block={block} />
      ))}
    </div>
  );
}
