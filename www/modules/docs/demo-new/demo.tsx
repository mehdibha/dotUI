import type React from "react";

import { DemoClient } from "./demo.client";
import { loadDemo } from "./load-demo";
import { normalizeControls } from "./utils";
import type { DemoControl } from "./types";

export interface DemoProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  controls?: DemoControl[];
}

export async function Demo({ name, controls, className, ...props }: DemoProps) {
  const {
    component: Component,
    source,
    highlightedSource,
    preview,
    highlightedPreview,
  } = await loadDemo(name);

  const normalizedControls = normalizeControls(controls);

  return (
    <DemoClient
      className={className}
      component={<Component />}
      source={source}
      highlightedSource={highlightedSource}
      preview={preview}
      highlightedPreview={highlightedPreview}
      controls={normalizedControls}
      {...props}
    />
  );
}
