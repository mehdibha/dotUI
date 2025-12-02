import { highlight } from "fumadocs-core/highlight";
import type { ComponentType } from "react";

import type { Control } from "@dotui/registry/playground";

import { toCamelCase, toPascalCase } from "@/lib/utils";
import { Pre } from "@/modules/docs/code-block";

import { InteractiveDemoClient } from "./interactive-demo.client";

export interface InteractiveDemoProps {
  name: string;
  className?: string;
  fallback?: string;
}

/**
 * Loads a component and its controls from the playground file.
 * @param componentName - The name of the component (e.g., "alert", "button", "text-field")
 * @returns An object with the component and controls
 */
async function loadPlaygroundComponent(componentName: string) {
  const componentExportName = `${toPascalCase(componentName)}Playground`;
  const controlsExportName = `${toCamelCase(componentName)}Controls`;

  try {
    const module = await import(
      `@dotui/registry/ui/${componentName}/demos/playground`
    );

    const Component = module[componentExportName] as
      | ComponentType<Record<string, unknown>>
      | undefined;

    if (!Component) {
      throw new Error(
        `Component ${componentExportName} not found in ${componentName}/demos/playground`,
      );
    }

    const controls =
      (module[controlsExportName] as Control[] | undefined) || [];

    return { component: Component, controls };
  } catch (error) {
    throw new Error(
      `Failed to load playground for component "${componentName}": ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function InteractiveDemo({
  name,
  className,
  fallback = "",
}: InteractiveDemoProps) {
  const { component, controls } = await loadPlaygroundComponent(name);

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
