import { DemoClient } from "./demo.client";
import { loadDemo } from "./load-demo";
import type { DemoControl } from "./types";

export interface DemoProps {
  name: string;
  controls?: DemoControl[];
}

export async function Demo({ name, controls }: DemoProps) {
  const {
    component: Component,
    source,
    highlightedSource,
    preview,
    highlightedPreview,
  } = await loadDemo(name);

  return (
    <DemoClient
      component={<Component />}
      source={source}
      highlightedSource={highlightedSource}
      preview={preview}
      highlightedPreview={highlightedPreview}
      controls={controls}
    />
  );
}
