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
  componentName,
  importPath,
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

  const slug = name.split("/")[0] ?? "component";
  const resolvedComponentName = componentName ?? toPascalCase(slug);
  const resolvedImportPath = importPath ?? `@dotui/registry/ui/${slug}`;

  return (
    <InteractiveDemoClient
      name={name}
      componentName={resolvedComponentName}
      importPath={resolvedImportPath}
      controls={controls}
      initialProps={initialProps}
      description={description}
      jsxTemplate={jsxTemplate}
    />
  );
}

function toPascalCase(value: string) {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

