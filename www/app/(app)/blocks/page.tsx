import { BlockView } from "@/modules/blocks/components/block-view";
import { featuredBlocks } from "@dotui/registry-definition/registry-blocks";


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
