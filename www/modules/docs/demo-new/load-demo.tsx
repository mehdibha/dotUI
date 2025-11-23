import { highlight } from "fumadocs-core/highlight";

import { Index } from "@dotui/registry/ui/demos";

import { Pre } from "@/modules/docs/code-block";
import fs from "node:fs/promises";
import path from "node:path";

import {
  extractPreviewSource,
  normalizeRegistrySource,
} from "./utils";

export const loadDemo = async (name: string) => {
  const demo = Index[name];
  if (!demo) throw new Error(`Demo ${name} not found`);

  const filePath = demo.files[0];
  if (!filePath) throw new Error(`File path not found for demo ${name}`);

  const rawSource = await getFileSource(filePath);
  const source = normalizeRegistrySource(rawSource);
  const preview = extractPreviewSource(source);

  const highlightedSource = await highlightSource(source);
  const highlightedPreview = await highlightSource(preview);

  return {
    component: demo.component,
    source,
    highlightedSource,
    preview,
    highlightedPreview,
  };
};

const highlightSource = (source: string) =>
  highlight(source, {
    lang: "tsx",
    components: {
      pre: (props) => <Pre {...props} />,
    },
  });

const getFileSource = async (filePath: string) => {
  const fullPath = path.join(
    process.cwd(),
    "..",
    "packages",
    "registry",
    "src",
    filePath,
  );
  const fileContent = await fs.readFile(fullPath, "utf-8");
  return fileContent;
};
