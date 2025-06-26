import { BlockView } from "@/components/block-view";

const FEATURED_BLOCKS = ["login-01", "calendar-01"];

export default function BlocksPage() {
  return (
    <div className="space-y-6">
      {FEATURED_BLOCKS.map((block) => (
        <div key={block}>
          <BlockView name={block} />
        </div>
      ))}
    </div>
  );
}
