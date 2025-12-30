
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
	Button: "@/components/ui/button",
	LinkButton: "@/components/ui/button",
	ButtonProvider: "@/components/ui/button",

	// TextField
	TextField: "@/components/ui/text-field",

	// Field components
	Label: "@/components/ui/field",
	Description: "@/components/ui/field",
	FieldError: "@/components/ui/field",
	FieldGroup: "@/components/ui/field",
	Fieldset: "@/components/ui/field",
	Legend: "@/components/ui/field",

	// Input
	Input: "@/components/ui/input",
	InputGroup: "@/components/ui/input",
	InputAddon: "@/components/ui/input",
	TextArea: "@/components/ui/input",

	// Select
	Select: "@/components/ui/select",
	SelectTrigger: "@/components/ui/select",
	SelectContent: "@/components/ui/select",
	SelectItem: "@/components/ui/select",
	SelectSection: "@/components/ui/select",

	// Checkbox
	Checkbox: "@/components/ui/checkbox",
	CheckboxIndicator: "@/components/ui/checkbox",

	// Switch
	Switch: "@/components/ui/switch",
	SwitchIndicator: "@/components/ui/switch",
	SwitchThumb: "@/components/ui/switch",

	// Radio
	Radio: "@/components/ui/radio-group",
	RadioGroup: "@/components/ui/radio-group",
	RadioIndicator: "@/components/ui/radio-group",

	// Dialog
	Dialog: "@/components/ui/dialog",
	DialogContent: "@/components/ui/dialog",
	DialogHeader: "@/components/ui/dialog",
	DialogBody: "@/components/ui/dialog",
	DialogFooter: "@/components/ui/dialog",
	DialogHeading: "@/components/ui/dialog",
	DialogDescription: "@/components/ui/dialog",

	// Card
	Card: "@/components/ui/card",
	CardHeader: "@/components/ui/card",
	CardContent: "@/components/ui/card",
	CardFooter: "@/components/ui/card",
	CardTitle: "@/components/ui/card",
	CardDescription: "@/components/ui/card",
	CardAction: "@/components/ui/card",

	// Tabs
	Tabs: "@/components/ui/tabs",
	TabList: "@/components/ui/tabs",
	Tab: "@/components/ui/tabs",
	TabPanel: "@/components/ui/tabs",

	// Menu
	Menu: "@/components/ui/menu",
	MenuContent: "@/components/ui/menu",
	MenuItem: "@/components/ui/menu",
	MenuSection: "@/components/ui/menu",
	MenuSeparator: "@/components/ui/menu",

	// Popover
	Popover: "@/components/ui/popover",

	// Modal
	Modal: "@/components/ui/modal",

	// Drawer
	Drawer: "@/components/ui/drawer",

	// Overlay
	Overlay: "@/components/ui/overlay",

	// Tooltip
	Tooltip: "@/components/ui/tooltip",
	TooltipContent: "@/components/ui/tooltip",

	// Alert
	Alert: "@/components/ui/alert",
	AlertTitle: "@/components/ui/alert",
	AlertDescription: "@/components/ui/alert",

	// Badge
	Badge: "@/components/ui/badge",

	// Avatar
	Avatar: "@/components/ui/avatar",
	AvatarGroup: "@/components/ui/avatar",
	AvatarRoot: "@/components/ui/avatar",
	AvatarImage: "@/components/ui/avatar",
	AvatarFallback: "@/components/ui/avatar",

	// Accordion
	Accordion: "@/components/ui/accordion",
	AccordionItem: "@/components/ui/accordion",
	AccordionHeading: "@/components/ui/accordion",
	AccordionPanel: "@/components/ui/accordion",

	// Loader
	Loader: "@/components/ui/loader",

	// Link
	Link: "@/components/ui/link",

	// Separator
	Separator: "@/components/ui/separator",

	// Breadcrumbs
	Breadcrumbs: "@/components/ui/breadcrumbs",
	Breadcrumb: "@/components/ui/breadcrumbs",

	// Kbd
	Kbd: "@/components/ui/kbd",
	KbdGroup: "@/components/ui/kbd",

	// Skeleton
	Skeleton: "@/components/ui/skeleton",
	SkeletonProvider: "@/components/ui/skeleton",

	// Calendar
	Calendar: "@/components/ui/calendar",
	CalendarHeader: "@/components/ui/calendar",
	CalendarGrid: "@/components/ui/calendar",
	CalendarGridHeader: "@/components/ui/calendar",
	CalendarGridBody: "@/components/ui/calendar",
	CalendarHeaderCell: "@/components/ui/calendar",
	CalendarCell: "@/components/ui/calendar",

	// DatePicker
	DatePicker: "@/components/ui/date-picker",
	DatePickerInput: "@/components/ui/date-picker",
	DatePickerContent: "@/components/ui/date-picker",

	// DateField
	DateField: "@/components/ui/date-field",
	DateInput: "@/components/ui/input",

	// TimeField
	TimeField: "@/components/ui/time-field",

	// ColorPicker
	ColorPicker: "@/components/ui/color-picker",
	ColorPickerTrigger: "@/components/ui/color-picker",
	ColorPickerContent: "@/components/ui/color-picker",
	ColorEditor: "@/components/ui/color-editor",

	// Slider
	Slider: "@/components/ui/slider",
	SliderControl: "@/components/ui/slider",
	SliderTrack: "@/components/ui/slider",
	SliderThumb: "@/components/ui/slider",

	// ProgressBar
	ProgressBar: "@/components/ui/progress-bar",
	ProgressBarControl: "@/components/ui/progress-bar",

	// Toggle
	ToggleButton: "@/components/ui/toggle-button",
	ToggleButtonGroup: "@/components/ui/toggle-button-group",

	// Table
	Table: "@/components/ui/table",
	TableHeader: "@/components/ui/table",
	TableBody: "@/components/ui/table",
	TableRow: "@/components/ui/table",
	TableColumn: "@/components/ui/table",
	TableCell: "@/components/ui/table",

	// ListBox
	ListBox: "@/components/ui/list-box",
	ListBoxItem: "@/components/ui/list-box",
	ListBoxSection: "@/components/ui/list-box",

	// Combobox
	Combobox: "@/components/ui/combobox",
	ComboboxInput: "@/components/ui/combobox",
	ComboboxContent: "@/components/ui/combobox",
	ComboboxItem: "@/components/ui/combobox",

	// NumberField
	NumberField: "@/components/ui/number-field",

	// SearchField
	SearchField: "@/components/ui/search-field",

	// FileTrigger
	FileTrigger: "@/components/ui/file-trigger",

	// DropZone
	DropZone: "@/components/ui/drop-zone",
	DropZoneLabel: "@/components/ui/drop-zone",

	// TagGroup
	TagGroup: "@/components/ui/tag-group",
	TagList: "@/components/ui/tag-group",
	Tag: "@/components/ui/tag-group",

	// Command
	Command: "@/components/ui/command",
	CommandInput: "@/components/ui/command",
	CommandContent: "@/components/ui/command",
	CommandItem: "@/components/ui/command",

	// Toast
	Toaster: "@/components/ui/toast",

	// Form
	Form: "@/components/ui/form",

	// CheckboxGroup
	CheckboxGroup: "@/components/ui/checkbox-group",

	// Group
	Group: "@/components/ui/group",

	// Text
	Text: "@/components/ui/text",

	// ColorField
	ColorField: "@/components/ui/color-field",
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

function serializeNode(node: ReactNode, ctx: SerializeContext, indent: number): string {
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

function serializeElement(element: ReactElement, ctx: SerializeContext, indent: number): string {
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
	const childStrings = children.map((child) => serializeNode(child, ctx, indent + 1)).filter(Boolean);

	// Format output
	if (childStrings.length === 0) {
		return `${pad}<${name}${propsStr} />`;
	}

	// Check if children are simple (inline) or complex (multiline)
	const totalChildLength = childStrings.reduce((a, b) => a + b.length, 0);
	const hasNestedElements = childStrings.some((s) => s.includes("<") || s.includes("\n"));
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
		// Filter out TanStack Start dev debugging attributes
		.filter(([key]) => !key.startsWith("data-tsd-"))
		.filter(([_, value]) => value !== undefined && value !== null && value !== false)
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
	ctx.imports.get(importPath)?.add(name);
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

	return `@/components/ui/${kebab}`;
}

function buildImports(ctx: SerializeContext): string {
	if (ctx.imports.size === 0) return "";

	// Sort imports: @dotui first, then lucide, then others
	const sorted = Array.from(ctx.imports.entries()).sort(([a], [b]) => {
		const aScore = a.startsWith("@dotui") ? 0 : a.includes("lucide") ? 1 : 2;
		const bScore = b.startsWith("@dotui") ? 0 : b.includes("lucide") ? 1 : 2;
		return aScore - bScore || a.localeCompare(b);
	});

	return sorted.map(([path, names]) => `import { ${[...names].sort().join(", ")} } from "${path}";`).join("\n");
}
