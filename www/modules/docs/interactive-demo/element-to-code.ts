"use client";

import React, { type ReactElement, type ReactNode } from "react";

/**
 * Serializes React elements to formatted JSX code strings.
 * Handles automatic import collection and proper indentation.
 */

interface SerializeContext {
  imports: Map<string, Set<string>>;
}

interface CodeOutput {
  /** Full code with imports and Demo function wrapper */
  full: string;
  /** Just the imports */
  imports: string;
  /** Just the JSX (without wrapper) */
  jsx: string;
}

/**
 * Mapping of component names to their import paths.
 * This is used to generate correct import statements.
 */
const COMPONENT_IMPORT_MAP: Record<string, string> = {
  // Button
  Button: "@dotui/registry/ui/button",
  LinkButton: "@dotui/registry/ui/button",
  ButtonProvider: "@dotui/registry/ui/button",

  // TextField
  TextField: "@dotui/registry/ui/text-field",

  // Field components
  Label: "@dotui/registry/ui/field",
  Description: "@dotui/registry/ui/field",
  FieldError: "@dotui/registry/ui/field",
  FieldGroup: "@dotui/registry/ui/field",
  Fieldset: "@dotui/registry/ui/field",
  Legend: "@dotui/registry/ui/field",

  // Input
  Input: "@dotui/registry/ui/input",
  InputGroup: "@dotui/registry/ui/input",
  InputAddon: "@dotui/registry/ui/input",
  TextArea: "@dotui/registry/ui/input",

  // Select
  Select: "@dotui/registry/ui/select",
  SelectTrigger: "@dotui/registry/ui/select",
  SelectContent: "@dotui/registry/ui/select",
  SelectItem: "@dotui/registry/ui/select",
  SelectSection: "@dotui/registry/ui/select",

  // Checkbox
  Checkbox: "@dotui/registry/ui/checkbox",
  CheckboxIndicator: "@dotui/registry/ui/checkbox",

  // Switch
  Switch: "@dotui/registry/ui/switch",
  SwitchIndicator: "@dotui/registry/ui/switch",
  SwitchThumb: "@dotui/registry/ui/switch",

  // Radio
  Radio: "@dotui/registry/ui/radio-group",
  RadioGroup: "@dotui/registry/ui/radio-group",
  RadioIndicator: "@dotui/registry/ui/radio-group",

  // Dialog
  Dialog: "@dotui/registry/ui/dialog",
  DialogContent: "@dotui/registry/ui/dialog",
  DialogHeader: "@dotui/registry/ui/dialog",
  DialogBody: "@dotui/registry/ui/dialog",
  DialogFooter: "@dotui/registry/ui/dialog",
  DialogHeading: "@dotui/registry/ui/dialog",
  DialogDescription: "@dotui/registry/ui/dialog",

  // Card
  Card: "@dotui/registry/ui/card",
  CardHeader: "@dotui/registry/ui/card",
  CardContent: "@dotui/registry/ui/card",
  CardFooter: "@dotui/registry/ui/card",
  CardTitle: "@dotui/registry/ui/card",
  CardDescription: "@dotui/registry/ui/card",
  CardAction: "@dotui/registry/ui/card",

  // Tabs
  Tabs: "@dotui/registry/ui/tabs",
  TabList: "@dotui/registry/ui/tabs",
  Tab: "@dotui/registry/ui/tabs",
  TabPanel: "@dotui/registry/ui/tabs",

  // Menu
  Menu: "@dotui/registry/ui/menu",
  MenuContent: "@dotui/registry/ui/menu",
  MenuItem: "@dotui/registry/ui/menu",
  MenuSection: "@dotui/registry/ui/menu",
  MenuSeparator: "@dotui/registry/ui/menu",

  // Popover
  Popover: "@dotui/registry/ui/popover",

  // Modal
  Modal: "@dotui/registry/ui/modal",

  // Drawer
  Drawer: "@dotui/registry/ui/drawer",

  // Overlay
  Overlay: "@dotui/registry/ui/overlay",

  // Tooltip
  Tooltip: "@dotui/registry/ui/tooltip",
  TooltipContent: "@dotui/registry/ui/tooltip",

  // Alert
  Alert: "@dotui/registry/ui/alert",
  AlertTitle: "@dotui/registry/ui/alert",
  AlertDescription: "@dotui/registry/ui/alert",

  // Badge
  Badge: "@dotui/registry/ui/badge",

  // Avatar
  Avatar: "@dotui/registry/ui/avatar",
  AvatarGroup: "@dotui/registry/ui/avatar",
  AvatarRoot: "@dotui/registry/ui/avatar",
  AvatarImage: "@dotui/registry/ui/avatar",
  AvatarFallback: "@dotui/registry/ui/avatar",

  // Accordion
  Accordion: "@dotui/registry/ui/accordion",
  AccordionItem: "@dotui/registry/ui/accordion",
  AccordionHeading: "@dotui/registry/ui/accordion",
  AccordionPanel: "@dotui/registry/ui/accordion",

  // Loader
  Loader: "@dotui/registry/ui/loader",

  // Link
  Link: "@dotui/registry/ui/link",

  // Separator
  Separator: "@dotui/registry/ui/separator",

  // Breadcrumbs
  Breadcrumbs: "@dotui/registry/ui/breadcrumbs",
  Breadcrumb: "@dotui/registry/ui/breadcrumbs",

  // Kbd
  Kbd: "@dotui/registry/ui/kbd",
  KbdGroup: "@dotui/registry/ui/kbd",

  // Skeleton
  Skeleton: "@dotui/registry/ui/skeleton",
  SkeletonProvider: "@dotui/registry/ui/skeleton",

  // Calendar
  Calendar: "@dotui/registry/ui/calendar",
  CalendarHeader: "@dotui/registry/ui/calendar",
  CalendarGrid: "@dotui/registry/ui/calendar",
  CalendarGridHeader: "@dotui/registry/ui/calendar",
  CalendarGridBody: "@dotui/registry/ui/calendar",
  CalendarHeaderCell: "@dotui/registry/ui/calendar",
  CalendarCell: "@dotui/registry/ui/calendar",

  // DatePicker
  DatePicker: "@dotui/registry/ui/date-picker",
  DatePickerInput: "@dotui/registry/ui/date-picker",
  DatePickerContent: "@dotui/registry/ui/date-picker",

  // DateField
  DateField: "@dotui/registry/ui/date-field",
  DateInput: "@dotui/registry/ui/input",

  // TimeField
  TimeField: "@dotui/registry/ui/time-field",

  // ColorPicker
  ColorPicker: "@dotui/registry/ui/color-picker",
  ColorPickerTrigger: "@dotui/registry/ui/color-picker",
  ColorPickerContent: "@dotui/registry/ui/color-picker",
  ColorEditor: "@dotui/registry/ui/color-editor",

  // Slider
  Slider: "@dotui/registry/ui/slider",
  SliderControl: "@dotui/registry/ui/slider",
  SliderTrack: "@dotui/registry/ui/slider",
  SliderThumb: "@dotui/registry/ui/slider",

  // ProgressBar
  ProgressBar: "@dotui/registry/ui/progress-bar",
  ProgressBarControl: "@dotui/registry/ui/progress-bar",

  // Toggle
  ToggleButton: "@dotui/registry/ui/toggle-button",
  ToggleButtonGroup: "@dotui/registry/ui/toggle-button-group",

  // Table
  Table: "@dotui/registry/ui/table",
  TableHeader: "@dotui/registry/ui/table",
  TableBody: "@dotui/registry/ui/table",
  TableRow: "@dotui/registry/ui/table",
  TableColumn: "@dotui/registry/ui/table",
  TableCell: "@dotui/registry/ui/table",

  // ListBox
  ListBox: "@dotui/registry/ui/list-box",
  ListBoxItem: "@dotui/registry/ui/list-box",
  ListBoxSection: "@dotui/registry/ui/list-box",

  // Combobox
  Combobox: "@dotui/registry/ui/combobox",
  ComboboxInput: "@dotui/registry/ui/combobox",
  ComboboxContent: "@dotui/registry/ui/combobox",
  ComboboxItem: "@dotui/registry/ui/combobox",

  // NumberField
  NumberField: "@dotui/registry/ui/number-field",

  // SearchField
  SearchField: "@dotui/registry/ui/search-field",

  // FileTrigger
  FileTrigger: "@dotui/registry/ui/file-trigger",

  // DropZone
  DropZone: "@dotui/registry/ui/drop-zone",
  DropZoneLabel: "@dotui/registry/ui/drop-zone",

  // TagGroup
  TagGroup: "@dotui/registry/ui/tag-group",
  TagList: "@dotui/registry/ui/tag-group",
  Tag: "@dotui/registry/ui/tag-group",

  // Command
  Command: "@dotui/registry/ui/command",
  CommandInput: "@dotui/registry/ui/command",
  CommandContent: "@dotui/registry/ui/command",
  CommandItem: "@dotui/registry/ui/command",

  // Toast
  Toaster: "@dotui/registry/ui/toast",

  // Form
  Form: "@dotui/registry/ui/form",

  // CheckboxGroup
  CheckboxGroup: "@dotui/registry/ui/checkbox-group",

  // Group
  Group: "@dotui/registry/ui/group",

  // Text
  Text: "@dotui/registry/ui/text",

  // ColorField
  ColorField: "@dotui/registry/ui/color-field",
};

/**
 * Convert a React element tree to formatted JSX code with imports and Demo wrapper.
 * Returns both full code and preview (collapsed) versions.
 */
export function elementToCode(element: ReactNode): CodeOutput {
  const ctx: SerializeContext = { imports: new Map() };
  const jsx = serializeNode(element, ctx, 2); // Start at indent 2 for inside function
  const imports = buildImports(ctx);

  // Build the full code with Demo wrapper
  const fullLines: string[] = [];

  if (imports) {
    fullLines.push(imports);
    fullLines.push("");
  }

  fullLines.push("export function Demo() {");
  fullLines.push("  return (");
  fullLines.push(jsx);
  fullLines.push("  );");
  fullLines.push("}");

  const full = fullLines.join("\n");

  return { full, imports, jsx };
}

/**
 * Get just the preview code (collapsed view - only JSX).
 */
export function elementToPreviewCode(element: ReactNode): string {
  const ctx: SerializeContext = { imports: new Map() };
  return serializeNode(element, ctx, 0);
}

function serializeNode(
  node: ReactNode,
  ctx: SerializeContext,
  indent: number,
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
  indent: number,
): string {
  const pad = "  ".repeat(indent);
  const { type, props } = element;
  const elementProps = props as Record<string, unknown>;

  // Get component name
  const name = getComponentName(type);

  // Track import
  trackImport(name, ctx);

  // Build props
  const propsStr = serializeProps(elementProps);

  // Build children
  const children = React.Children.toArray(elementProps.children as ReactNode);
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
    (s) => s.includes("<") || s.includes("\n"),
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
      ([_, value]) => value !== undefined && value !== null && value !== false,
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
    return `\n  ${entries.join("\n  ")}\n`;
  }

  return ` ${propsStr}`;
}

function trackImport(name: string, ctx: SerializeContext) {
  // Skip Unknown components
  if (name === "Unknown") return;

  // Determine import path
  const importPath = getImportPath(name);

  // Skip DOM elements (no import needed)
  if (!importPath) return;

  if (!ctx.imports.has(importPath)) {
    ctx.imports.set(importPath, new Set());
  }
  ctx.imports.get(importPath)!.add(name);
}

function getImportPath(name: string): string | null {
  // Check the mapping first
  if (COMPONENT_IMPORT_MAP[name]) {
    return COMPONENT_IMPORT_MAP[name];
  }

  // Lucide icons - check for Icon suffix or PascalCase pattern typical of icons
  if (name.endsWith("Icon") || name.match(/^[A-Z][a-z]+[A-Z]/)) {
    return "lucide-react";
  }

  // DOM elements (lowercase) - no import needed
  const firstChar = name[0];
  if (!name || !firstChar || firstChar === firstChar.toLowerCase()) {
    return null;
  }

  // Fallback: convert PascalCase to kebab-case for @dotui path
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
        `import { ${[...names].sort().join(", ")} } from "${path}";`,
    )
    .join("\n");
}
