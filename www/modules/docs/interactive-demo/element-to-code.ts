"use client";

import React, { type ReactElement, type ReactNode } from "react";

/**
 * Serializes React elements to formatted JSX code strings.
 * Handles automatic import collection and proper indentation.
 */

interface SerializeContext {
  imports: Map<string, Set<string>>;
}

/**
 * Convert a React element tree to formatted JSX code with imports.
 */
export function elementToCode(element: ReactNode): string {
  const ctx: SerializeContext = { imports: new Map() };
  const code = serializeNode(element, ctx, 0);
  const imports = buildImports(ctx);

  return imports + (imports ? "\n\n" : "") + code;
}

/**
 * Get just the code without imports (for inline display).
 */
export function elementToCodeOnly(element: ReactNode): string {
  const ctx: SerializeContext = { imports: new Map() };
  return serializeNode(element, ctx, 0);
}

/**
 * Get just the imports (useful if you need them separately).
 */
export function getImports(element: ReactNode): string {
  const ctx: SerializeContext = { imports: new Map() };
  serializeNode(element, ctx, 0);
  return buildImports(ctx);
}

function serializeNode(
  node: ReactNode,
  ctx: SerializeContext,
  indent: number
): string {
  // Handle nullish values - they disappear (exactly what we want!)
  if (node === null || node === undefined || node === false) {
    return "";
  }

  // Handle strings/numbers
  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  // Handle arrays (multiple children)
  if (Array.isArray(node)) {
    return node
      .map((child) => serializeNode(child, ctx, indent))
      .filter(Boolean)
      .join("");
  }

  // Handle React elements
  if (React.isValidElement(node)) {
    return serializeElement(node, ctx, indent);
  }

  return "";
}

function serializeElement(
  element: ReactElement,
  ctx: SerializeContext,
  indent: number
): string {
  const pad = "  ".repeat(indent);
  const { type, props } = element;

  // Get component name
  const name = getComponentName(type);

  // Track import
  trackImport(type, name, ctx);

  // Build props
  const propsStr = serializeProps(props);

  // Build children
  const children = React.Children.toArray(props.children);
  const childStrings = children
    .map((child) => serializeNode(child, ctx, indent + 1))
    .filter(Boolean);

  // Format output
  if (childStrings.length === 0) {
    return `${pad}<${name}${propsStr} />`;
  }

  // Check if children are simple (inline) or complex (multiline)
  const totalChildLength = childStrings.reduce((a, b) => a + b.length, 0);
  const hasNestedElements = childStrings.some(
    (s) => s.includes("<") || s.includes("\n")
  );
  const isSimple = !hasNestedElements && totalChildLength < 50;

  if (isSimple) {
    return `${pad}<${name}${propsStr}>${childStrings.join("")}</${name}>`;
  }

  // Multiline format
  const childPad = "  ".repeat(indent + 1);
  const formattedChildren = childStrings
    .map((s) => {
      // If already indented (nested element), use as-is
      if (s.startsWith("  ".repeat(indent + 1))) return s;
      // Otherwise add indentation (for text nodes)
      return childPad + s;
    })
    .join("\n");

  return `${pad}<${name}${propsStr}>\n${formattedChildren}\n${pad}</${name}>`;
}

function getComponentName(type: unknown): string {
  if (typeof type === "string") return type; // DOM element

  if (typeof type === "function") {
    // Try displayName first (lucide-react icons have this)
    const fn = type as { displayName?: string; name?: string };
    return fn.displayName || fn.name || "Unknown";
  }

  if (typeof type === "object" && type !== null) {
    const obj = type as { displayName?: string; name?: string };
    return obj.displayName || obj.name || "Unknown";
  }

  return "Unknown";
}

function serializeProps(props: Record<string, unknown>): string {
  const entries = Object.entries(props)
    .filter(([key]) => key !== "children")
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== false
    )
    .map(([key, value]) => {
      // Boolean true: just the prop name
      if (value === true) return key;

      // String: quoted
      if (typeof value === "string") return `${key}="${value}"`;

      // Number: in braces
      if (typeof value === "number") return `${key}={${value}}`;

      // Function: skip (event handlers)
      if (typeof value === "function") return null;

      // React elements: skip (they're handled as children, not props)
      if (React.isValidElement(value)) return null;

      // Arrays and objects: try to serialize, skip if circular
      if (typeof value === "object") {
        try {
          return `${key}={${JSON.stringify(value)}}`;
        } catch {
          // Circular reference or other serialization error - skip
          return null;
        }
      }

      return null;
    })
    .filter(Boolean);

  if (entries.length === 0) return "";

  // If props string is long, put on multiple lines
  const propsStr = entries.join(" ");
  if (propsStr.length > 60) {
    return "\n  " + entries.join("\n  ") + "\n";
  }

  return " " + propsStr;
}

function trackImport(type: unknown, name: string, ctx: SerializeContext) {
  // Skip DOM elements
  if (typeof type === "string") return;

  // Skip Unknown components
  if (name === "Unknown") return;

  // Determine import path
  const importPath = getImportPath(type, name);

  if (!ctx.imports.has(importPath)) {
    ctx.imports.set(importPath, new Set());
  }
  ctx.imports.get(importPath)!.add(name);
}

function getImportPath(type: unknown, name: string): string {
  // Check if component has __importPath metadata
  if (typeof type === "function" || typeof type === "object") {
    const component = type as { __importPath?: string };
    if (component.__importPath) {
      return component.__importPath;
    }
  }

  // Lucide icons
  if (name.endsWith("Icon") || name.match(/^[A-Z][a-z]+[A-Z]/)) {
    // Icons typically have names like MailIcon, UploadIcon, ArrowRight
    return "lucide-react";
  }

  // DotUI components - convert name to kebab-case path
  const kebab = name
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .slice(1);

  return `@dotui/registry/ui/${kebab}`;
}

function buildImports(ctx: SerializeContext): string {
  if (ctx.imports.size === 0) return "";

  // Sort imports: @dotui first, then lucide, then others
  const sorted = Array.from(ctx.imports.entries()).sort(([a], [b]) => {
    const aScore = a.startsWith("@dotui") ? 0 : a.includes("lucide") ? 1 : 2;
    const bScore = b.startsWith("@dotui") ? 0 : b.includes("lucide") ? 1 : 2;
    return aScore - bScore || a.localeCompare(b);
  });

  return sorted
    .map(
      ([path, names]) =>
        `import { ${[...names].sort().join(", ")} } from "${path}";`
    )
    .join("\n");
}

