import { Index } from "@dotui/ui/__registry__/blocks";

export function BlockViewer({ name }: { name: string }) {
  const block = Index[name];

  if (!block) {
    return <div>Block not found</div>;
  }

  const Component = block.component;

  return <Component />;
}
