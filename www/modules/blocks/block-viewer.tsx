import { Index } from "@dotui/registry/blocks";

export function BlockViewer({ name }: { name: string }) {
  const block = Index[name];

  if (!block) {
    return <div>Block not found</div>;
  }

  const Component = block.component;

  return <Component />;
}
