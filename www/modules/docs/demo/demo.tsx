import type React from "react";

import { cn } from "@dotui/registry/lib/utils";

import { DemoClient } from "./demo.client";
import { loadDemo } from "./load-demo";

export interface DemoProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export async function Demo({ name, className, ...props }: DemoProps) {
  try {
    const {
      component: Component,
      highlightedPreview,
      highlightedSource,
    } = await loadDemo(name);

    return (
      <div className={cn("not-first:mt-6", className)} {...props}>
        <DemoClient
          component={<Component />}
          highlightedPreview={highlightedPreview}
          highlightedSource={highlightedSource}
        />
      </div>
    );
  } catch (error) {
    return (
      <div
        className={cn(
          "mt-6",
          "flex",
          "items-center",
          "gap-2",
          "rounded-md",
          "border",
          "bg-card/80",
          "p-6",
          "text-sm",
          "text-fg-muted",
          className,
        )}
        {...props}
      >
        {error instanceof Error ? error.message : "Demo failed to load."}
      </div>
    );
  }
}
