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
        className="flex flex-1 py-14 bg-bg rounded-t-md items-center border justify-center"
      >
        <Component />
      </ActiveStyleProvider>
      <div className="bg-card/50 border border-t-0 rounded-b-lg flex items-center justify-between p-1.5 pl-3 gap-4">
        <p className="text-sm text-fg-muted truncate">
          Basic input component without label
        </p>
        <Button size="sm" className="h-7">
          View code
        </Button>
      </div>
    </div>
  );
};
