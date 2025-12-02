import { highlight } from "fumadocs-core/highlight";

import type { ControlInput } from "@dotui/registry/playground";

import { Pre } from "@/modules/docs/code-block";

import { InteractiveDemoClient } from "./interactive-demo.client";
import {
  buildControlsFromReference,
  enrichControlsWithReference,
  loadComponent,
} from "./loader";

export interface InteractiveDemoProps {
  name: string;
  /**
   * Simplified control inputs. Can be:
   * - A prop name string (e.g., "variant") - type, options, and defaults are inferred from API reference
   * - An object with name and optional overrides (e.g., { name: "children", defaultValue: "Button" })
   * - An object with name and type for custom controls (e.g., { name: "prefix", type: "icon" })
   */
  controls: ControlInput[];
  className?: string;
  fallback?: string;
}

export async function InteractiveDemo({
  name,
  controls: controlInputs,
  className,
  fallback = "",
}: InteractiveDemoProps) {
  const component = await loadComponent(name);

  // Build controls from simplified inputs + API reference
  const controls = await buildControlsFromReference(name, controlInputs);

  // Enrich controls with descriptions, highlighted types, etc.
  const enrichedControls = await enrichControlsWithReference(name, controls);

  const highlightedFallback = await highlight(fallback, {
    lang: "tsx",
    components: {
      pre: (props) => <Pre {...props} />,
    },
  });

  return (
    <InteractiveDemoClient
      component={component}
      controls={enrichedControls}
      className={className}
      fallback={highlightedFallback}
    />
  );
}
