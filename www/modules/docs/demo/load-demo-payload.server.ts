import type { ReactElement, ReactNode } from "react";
import { createElement } from "react";
import { highlight } from "fumadocs-core/highlight";

import { Index } from "@dotui/registry/ui/demos";

import { Pre } from "@/modules/docs/code-block";
import type { DemoControl } from "@/modules/docs/component-controls";
import { getFileSource } from "@/modules/docs/get-file-source";

export type LoadDemoPayloadResult =
  | LoadDemoPayloadSuccess
  | LoadDemoPayloadError;

export interface LoadDemoPayloadSuccess {
  status: "success";
  name: string;
  files: string[];
  component: ReactElement;
  highlightedCode: ReactNode;
  highlightedPreview: ReactNode;
  codeSource: string;
  previewSource: string;
  controls?: DemoControl[];
}

export interface LoadDemoPayloadError {
  status: "error";
  code: "not-found" | "file-missing" | "load-error";
  name: string;
  message: string;
}

const highlightSource = (source: string) =>
  highlight(source, {
    lang: "tsx",
    components: {
      pre: (props) => createElement(Pre, props),
    },
  });

export async function loadDemoPayload(
  name: string,
  controls?: DemoControl[],
): Promise<LoadDemoPayloadResult> {
  const demoItem = Index[name];

  if (!demoItem) {
    return {
      status: "error",
      code: "not-found",
      name,
      message: `Component ${name} not found in registry.`,
    };
  }

  const filePath = demoItem.files[0];

  if (!filePath) {
    return {
      status: "error",
      code: "file-missing",
      name,
      message: `File path not found for component ${name}.`,
    };
  }

  try {
    const Component = demoItem.component;

    const { content: rawCode, preview: rawPreview } =
      await getFileSource(filePath);

    const [highlightedCode, highlightedPreview] = await Promise.all([
      highlightSource(rawCode),
      highlightSource(rawPreview),
    ]);

    return {
      status: "success",
      name,
      files: demoItem.files,
      component: createElement(Component),
      highlightedCode,
      highlightedPreview,
      codeSource: rawCode,
      previewSource: rawPreview,
      controls,
    };
  } catch (error) {
    return {
      status: "error",
      code: "load-error",
      name,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
