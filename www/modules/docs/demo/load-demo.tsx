import fs from "node:fs/promises";
import path from "node:path";
import { highlight } from "fumadocs-core/highlight";

import { Index } from "@dotui/registry/ui/demos";

import { Pre } from "@/modules/docs/code-block";

export const loadDemo = async (name: string) => {
  const demo = Index[name];
  if (!demo) throw new Error(`Demo ${name} not found`);

  const filePath = demo.files[0];
  if (!filePath) throw new Error(`File path not found for demo ${name}`);

  const rawContent = await getFileSource(filePath);

  const source = rawContent
    .replaceAll("@dotui/registry/ui/", "@/components/ui/")
    .replaceAll("@dotui/registry/", "@/")
    .replace("export default function", "export function")
    .trim();

  const previewRaw = rawContent
    .replaceAll("@dotui/registry/ui/", "@/components/ui/")
    .replaceAll("@dotui/registry/", "@/")
    .replace(DIRECTIVE_REGEX, "")
    .replace(IMPORT_REGEX, "")
    .replace(EXPORT_FN_REGEX, "")
    .replace(FUNCTION_END_REGEX, "")
    .replace(/^\n+/, "") // Remove leading empty lines
    .replace(/\n+$/, ""); // Remove trailing empty lines

  const preview = dedent(previewRaw);

  const [highlightedSource, highlightedPreview] = await Promise.all([
    highlightSource(source),
    highlightSource(preview),
  ]);

  return {
    component: demo.component,
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

const DIRECTIVE_REGEX = /^\s*["']use client["'];\s*\n?/gm;
const IMPORT_REGEX = /^\s*import[\s\S]*?;\s*$/gm;
const EXPORT_FN_REGEX =
  /export\s+(default\s+)?function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?return\s*\(?\n?/m;
const FUNCTION_END_REGEX = /\s*\)?\s*;?\s*\}\s*$/m;

/**
 * Remove common leading whitespace from all lines.
 */
function dedent(code: string): string {
  const lines = code.split("\n");

  // Find minimum indentation (ignoring empty lines)
  const minIndent = lines.reduce((min, line) => {
    if (line.trim() === "") return min;
    const match = line.match(/^(\s*)/);
    const indent = match?.[1]?.length ?? 0;
    return Math.min(min, indent);
  }, Number.POSITIVE_INFINITY);

  if (minIndent === 0 || minIndent === Number.POSITIVE_INFINITY) {
    return code;
  }

  // Remove the common indentation from all lines
  return lines.map((line) => line.slice(minIndent)).join("\n");
}
