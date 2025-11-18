import { Button } from "@dotui/registry/ui/button";
import { Index } from "@dotui/registry/ui/demos";

import { ActiveStyleProvider } from "@/modules/styles/components/active-style-provider";

export interface ExampleProps {
  name: string;
}

export const Example = async ({ name }: ExampleProps) => {
  const demoItem = Index[name];

  if (!demoItem) return null;

  const Component = demoItem.component;

  return (
    <div className="relative flex flex-col">
      <ActiveStyleProvider
        unstyled
        className="flex flex-1 items-center justify-center rounded-t-md border bg-bg py-14"
      >
        <Component />
      </ActiveStyleProvider>
      <div className="flex items-center justify-between gap-4 rounded-b-lg border border-t-0 bg-card/50 p-1.5 pl-3">
        <p className="truncate text-fg-muted text-sm">
          Basic input component without label
        </p>
        <Button size="sm" className="h-7">
          View code
        </Button>
      </div>
    </div>
  );
};
