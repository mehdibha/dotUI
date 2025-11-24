import type * as React from "react";

import { Index } from "@dotui/registry/ui/demos";

import { InteractiveDemoClient } from "./interactive-demo.client";
import type { InteractiveDemoSharedConfig } from "./types";

export interface InteractiveDemoProps extends InteractiveDemoSharedConfig {
  /** Registry demo name, e.g. "button/demos/default". */
  name: string;
}

export function InteractiveDemo({
  name,
  controls,
  initialProps,
  description,
  jsxTemplate,
}: InteractiveDemoProps) {
  const demoEntry = Index[name];

  if (!demoEntry) {
    return (
      <div className="mt-6 rounded-md border border-border-danger bg-danger-muted/30 p-4 text-sm text-fg-danger">
        Interactive demo "{name}" was not found in the registry.
      </div>
    );
  }

  if (!jsxTemplate) {
    throw new Error(
      `InteractiveDemo "${name}" requires a jsxTemplate prop to render.`,
    );
  }

  return (
    <InteractiveDemoClient
      name={name}
      controls={controls}
      initialProps={initialProps}
      description={description}
      jsxTemplate={jsxTemplate}
    />
  );
}

