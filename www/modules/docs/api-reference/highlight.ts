import { codeToHtml } from "shiki";

import type { PropDisplayDoc, PropDoc } from "./types";

/**
 * Decorates raw prop docs with syntax-highlighted HTML and type summaries.
 */
export async function decorateProps(
  props: PropDoc[],
): Promise<PropDisplayDoc[]> {
  return Promise.all(
    props.map(async (prop) => {
      const typeSummary = formatTypeSummary(prop.type);

      const [
        highlightedName,
        highlightedType,
        highlightedTypeSummary,
        highlightedDefault,
      ] = await Promise.all([
        highlightInline(prop.name),
        highlightInline(prop.type),
        highlightInline(typeSummary),
        prop.defaultValue
          ? highlightInline(prop.defaultValue)
          : Promise.resolve(undefined),
      ]);

      return {
        ...prop,
        typeSummary,
        highlightedName,
        highlightedType,
        highlightedTypeSummary,
        highlightedDefault,
      };
    }),
  );
}

/**
 * Creates a shortened display version of a type string.
 * - Replaces function signatures with "function"
 * - Removes undefined/null/void/never from unions
 * - Truncates long types with ellipsis
 */
export function formatTypeSummary(type: string): string {
  if (!type) {
    return "-";
  }

  if (type.includes("=>")) {
    return "function";
  }

  const parts = type
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  const filtered = parts.filter(
    (part) =>
      part !== "undefined" &&
      part !== "null" &&
      part !== "void" &&
      part !== "never",
  );

  const summary = filtered.join(" | ") || "-";

  if (summary.length > 48) {
    return `${summary.slice(0, 45)}…`;
  }

  return summary;
}

/**
 * Highlights a code snippet using Shiki and extracts the inner HTML.
 * Returns undefined if the code is empty.
 */
export async function highlightInline(
  code: string | undefined,
  lang = "tsx",
): Promise<string | undefined> {
  if (!code?.trim()) {
    return undefined;
  }

  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
  return match ? match[1] : undefined;
}
