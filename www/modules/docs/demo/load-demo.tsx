import { highlight } from "fumadocs-core/highlight";

import { Index } from "@dotui/registry/ui/demos";

import { Pre } from "@/modules/docs/code-block";
import fs from "node:fs/promises";
import path from "node:path";

export const loadDemo = async (name: string) => {
  const demo = Index[name];
  if (!demo) throw new Error(`Demo ${name} not found`);

  const filePath = demo.files[0];
  if (!filePath) throw new Error(`File path not found for demo ${name}`);

  const rawContent = await getFileSource(filePath);

  const source = rawContent.replaceAll("@dotui/registry/", "@/").trim();

  const preview = rawContent
    .replaceAll("@dotui/registry/", "@/")
    .replace(IMPORT_REGEX, "")
    .replace(EXPORT_FN_REGEX, "")
    .replace(FUNCTION_END_REGEX, "")
    .trim();

  const [highlightedSource, highlightedPreview] = await Promise.all([
    highlightSource(source),
    highlightSource(preview),
  ]);

  return {
    component: demo.component,
    source,
    preview,
    highlightedSource,
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
  return fs.readFile(fullPath, "utf-8");
};

const IMPORT_REGEX = /^\s*import[\s\S]*?;\s*$/gm;
const EXPORT_FN_REGEX =
  /export\s+(default\s+)?function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\(?\s*/m;
const FUNCTION_END_REGEX = /\s*\)?\s*;?\s*\}\s*$/m;
