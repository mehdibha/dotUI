import * as tae from "typescript-api-extractor";

import fs from "node:fs";
import path from "node:path";
import { formatProperties, getPropertiesFromType } from "./formatter";
import memberOrder from "./order.json";

const registryDir = path.resolve(process.cwd(), "../packages/registry/src");

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// Get component group names from the registry directory
const componentGroupNames = fs.existsSync(path.join(registryDir, "ui"))
  ? fs
      .readdirSync(path.join(registryDir, "ui"), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => kebabToPascal(dirent.name))
      .sort((a, b) => b.length - a.length)
  : [];

export async function formatComponentData(
  exportNode: tae.ExportNode,
  allExports: tae.ExportNode[],
) {
  const description = exportNode.documentation?.description?.replace(
    /\n\nDocumentation: .*$/ms,
    "",
  );

  // Get properties based on type
  const props = getPropertiesFromType(exportNode.type);

  const raw = {
    name: exportNode.name,
    description,
    props: sortObjectByKeys(
      await formatProperties(props, allExports),
      memberOrder.props,
    ),
  } as Record<string, unknown>;

  // Post-process type strings to align naming
  const componentGroup = extractComponentGroup(exportNode.name);
  const formatted = rewriteTypeStringsDeep(raw, componentGroup) as typeof raw;
  formatted.name = exportNode.name;

  return formatted;
}

/**
 * Check if an export is a public Props type (interface or type alias ending with Props)
 */
export function isPublicPropsType(exportNode: tae.ExportNode): boolean {
  const name = exportNode.name;

  // Must end with "Props"
  if (!name.endsWith("Props")) {
    return false;
  }

  // Skip internal types
  if (name.includes("Internal") || name.startsWith("_")) {
    return false;
  }

  // Skip if marked with @ignore or @internal
  if (
    exportNode.documentation?.hasTag("ignore") ||
    exportNode.documentation?.hasTag("internal")
  ) {
    return false;
  }

  // Must be a type that can have properties
  const type = exportNode.type;
  return (
    type instanceof tae.ObjectNode ||
    type instanceof tae.IntersectionNode ||
    type instanceof tae.ComponentNode
  );
}

function sortObjectByKeys<T>(
  obj: Record<string, T>,
  order: string[],
): Record<string, T> {
  if (order.length === 0) {
    return obj;
  }

  const sortedObj: Record<string, T> = {};
  const everythingElse: Record<string, T> = {};

  // Gather keys that are not in the order array
  Object.keys(obj).forEach((key) => {
    if (!order.includes(key)) {
      everythingElse[key] = obj[key];
    }
  });

  // Sort the keys of everythingElse
  const sortedEverythingElseKeys = Object.keys(everythingElse).sort();

  // Populate the sorted object according to the order array
  order.forEach((key) => {
    if (key === "__EVERYTHING_ELSE__") {
      // Insert all "everything else" keys at this position, sorted
      sortedEverythingElseKeys.forEach((sortedKey) => {
        sortedObj[sortedKey] = everythingElse[sortedKey];
      });
    } else if (Object.hasOwn(obj, key)) {
      sortedObj[key] = obj[key];
    }
  });

  return sortedObj;
}

function extractComponentGroup(componentExportName: string): string {
  // Remove Props suffix first
  const baseName = componentExportName.replace(/Props$/, "");

  // Try to match against known component groups
  const directMatch = componentGroupNames.find((name) =>
    baseName.startsWith(name),
  );

  if (directMatch) {
    return directMatch;
  }

  // Extract the first PascalCase word
  const match = baseName.match(/^[A-Z][a-z0-9]*/);
  return match ? match[0] : baseName;
}

function rewriteTypeValue(value: string, componentGroup: string): string {
  let next = value;

  // Clean up internal type suffixes
  next = next.replaceAll(".RootInternal", ".Root");

  // Apply component namespace shorthand (e.g., ButtonProps -> Button.Props)
  if (componentGroup) {
    const escapedGroup = escapeForRegex(componentGroup);
    next = next.replace(
      new RegExp(`\\b${escapedGroup}(Props|State)\\b`, "g"),
      `${componentGroup}.$1`,
    );
  }

  return dedupeUnionMembers(next);
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function dedupeUnionMembers(value: string): string {
  if (!value.includes("|")) {
    return value;
  }

  // Handle multi-line unions
  const unionLinePattern = /^\s*\|/m;
  if (unionLinePattern.test(value)) {
    const seen = new Set<string>();
    const lines = value.split("\n");
    const resultLines: string[] = [];
    let currentEntry: string[] | null = null;

    const flushEntry = () => {
      if (!currentEntry) {
        return;
      }

      const entryText = currentEntry.join("\n");
      const key = entryText.replace(/^\s*\|\s*/, "").trim();
      if (!seen.has(key)) {
        seen.add(key);
        resultLines.push(entryText);
      }

      currentEntry = null;
    };

    lines.forEach((line) => {
      if (line.trim().startsWith("|")) {
        flushEntry();
        currentEntry = [line];
      } else if (currentEntry) {
        currentEntry.push(line);
      } else {
        resultLines.push(line);
      }
    });

    flushEntry();

    return resultLines.join("\n");
  }

  // Handle single-line unions
  const parts = splitTopLevelUnion(value);
  const seen = new Set<string>();
  const dedupedParts = parts.filter((part) => {
    const key = part.trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return dedupedParts.join(" | ");
}

function splitTopLevelUnion(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depthAngle = 0;
  let depthParen = 0;
  let depthCurly = 0;
  let depthSquare = 0;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];

    switch (char) {
      case "<":
        depthAngle += 1;
        break;
      case ">":
        depthAngle = Math.max(0, depthAngle - 1);
        break;
      case "(":
        depthParen += 1;
        break;
      case ")":
        depthParen = Math.max(0, depthParen - 1);
        break;
      case "{":
        depthCurly += 1;
        break;
      case "}":
        depthCurly = Math.max(0, depthCurly - 1);
        break;
      case "[":
        depthSquare += 1;
        break;
      case "]":
        depthSquare = Math.max(0, depthSquare - 1);
        break;
      default:
        break;
    }

    if (
      char === "|" &&
      depthAngle === 0 &&
      depthParen === 0 &&
      depthCurly === 0 &&
      depthSquare === 0
    ) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim() !== "") {
    parts.push(current.trim());
  }

  return parts.length > 0 ? parts : [value];
}

function rewriteTypeStringsDeep(
  node: unknown,
  componentGroup: string,
): unknown {
  if (node == null) {
    return node;
  }

  if (typeof node === "string") {
    return rewriteTypeValue(node, componentGroup);
  }

  if (Array.isArray(node)) {
    return node.map((item) => rewriteTypeStringsDeep(item, componentGroup));
  }

  if (typeof node === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] = rewriteTypeStringsDeep(value, componentGroup);
    }
    return result;
  }

  return node;
}
