import { highlight } from "fumadocs-core/highlight";
import type { ComponentType } from "react";

import type { Control } from "@dotui/registry/playground";

import { Pre } from "@/modules/docs/code-block";

import { InteractiveDemoClient } from "./interactive-demo.client";

export interface InteractiveDemoProps {
  component: ComponentType<Record<string, unknown>>;
  controls: Control[];
  className?: string;
  fallback?: string;
}

export async function InteractiveDemo({
  component,
  controls,
  className,
  fallback = "",
}: InteractiveDemoProps) {
  const highlightedFallback = await highlight(fallback, {
    lang: "tsx",
    components: {
      pre: (props) => <Pre {...props} />,
    },
  });

  return (
    <InteractiveDemoClient
      component={component}
      controls={controls}
      className={className}
      fallback={highlightedFallback}
    />
  );
}
