import fs from "node:fs/promises";
import path from "node:path";

import { createHighlighter, type HighlighterGeneric } from "shiki";
import { visit } from "unist-util-visit";

import type { Element, ElementContent, Root, RootContent } from "hast";
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression, MdxJsxFlowElementHast } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";

import { loadApiReference } from "../../references/loader";
import { type TransformedReference, transformReference } from "../../references/transform";
import { buildSourceOverlay, type ControlSelection } from "../codegen/source-overlay";
import {
	buildControlsFromReference,
	enrichControlsForSerialization,
	toPascalCase,
} from "../interactive-demo/process-controls";
import { transformDemo } from "./transformer";

import type { CodeTemplate } from "../codegen/code-template";
import type { ControlInput, InteractiveDemoNodeInfo, ProcessedInteractiveDemo } from "../interactive-demo/types";

// ============================================================================
// Cached Highlighter (singleton)
// ============================================================================

// oxlint-disable-next-line typescript/no-explicit-any -- shiki generic types are complex
let highlighterPromise: Promise<HighlighterGeneric<any, any>> | null = null;

async function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["github-light", "github-dark"],
			langs: ["tsx", "ts"],
		});
	}
	return highlighterPromise;
}

// ============================================================================
// Types
// ============================================================================

interface RehypeTransformOptions {
	/** Base path to registry source files (relative to cwd) */
	registryBasePath?: string;
}

interface DemoNodeInfo {
	node: MdxJsxFlowElementHast;
	name: string;
	type: "Demo" | "Example";
	title?: string;
	titleId?: string;
}

interface ProcessedDemo {
	nodeInfo: DemoNodeInfo;
	importName: string;
	importPath: string;
	sourceHast: Root;
	previewHast: Root;
}

interface ReferenceNodeInfo {
	node: MdxJsxFlowElementHast;
	name: string;
}

interface ProcessedReference {
	nodeInfo: ReferenceNodeInfo;
	data: TransformedReference;
}

interface ImportInfo {
	importName: string;
	importPath: string;
	isDefault: boolean;
	namedExport?: string;
}

// ============================================================================
// Main Plugin
// ============================================================================

const rehypeTransform: Plugin<[RehypeTransformOptions?], Root> = (options = {}) => {
	const { registryBasePath = "src/registry" } = options;

	return async (tree) => {
		const demoNodes: DemoNodeInfo[] = [];
		const referenceNodes: ReferenceNodeInfo[] = [];
		const interactiveDemoNodes: InteractiveDemoNodeInfo[] = [];
		// Per-file slug dedupe so ids stay deterministic and collisions get suffixed
		const usedSlugs = new Set<string>();
		const slugify = (text: string): string => {
			const base =
				text
					.toLowerCase()
					.trim()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "") || "example";
			let candidate = base;
			let i = 1;
			while (usedSlugs.has(candidate)) {
				i += 1;
				candidate = `${base}-${i}`;
			}
			usedSlugs.add(candidate);
			return candidate;
		};

		// Step 1: Collect all Demo/Example/Reference/InteractiveDemo nodes
		visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElementHast) => {
			if (node.name === "Demo" || node.name === "Example") {
				const name = extractNameAttribute(node);
				if (name) {
					const info: DemoNodeInfo = {
						node,
						name,
						type: node.name as "Demo" | "Example",
					};
					if (node.name === "Example") {
						const title = extractStringAttribute(node, "title");
						if (title) {
							info.title = title;
							info.titleId = slugify(title);
						}
					}
					demoNodes.push(info);
				}
			} else if (node.name === "Reference") {
				const name = extractNameAttribute(node);
				if (name) {
					referenceNodes.push({ node, name });
				}
			} else if (node.name === "InteractiveDemo") {
				const name = extractNameAttribute(node);
				const controls = extractControlsAttribute(node);
				const engine = (extractStringAttribute(node, "engine") as "source" | null) ?? "legacy";
				const file = extractStringAttribute(node, "file") ?? undefined;
				if (name && controls) {
					interactiveDemoNodes.push({ node, name, controls, engine, file });
				}
			}
		});

		const hasDemos = demoNodes.length > 0;
		const hasReferences = referenceNodes.length > 0;
		const hasInteractiveDemos = interactiveDemoNodes.length > 0;

		if (!hasDemos && !hasReferences && !hasInteractiveDemos) return;

		// Get the shared highlighter
		const highlighter = await getHighlighter();

		// Step 2: Process all nodes in parallel
		const [processedDemos, processedReferences, processedInteractiveDemos] = await Promise.all([
			hasDemos
				? Promise.all(demoNodes.map((info) => processDemoNode(info, registryBasePath, highlighter)))
				: Promise.resolve([]),
			hasReferences
				? Promise.all(referenceNodes.map((info) => processReferenceNode(info, highlighter)))
				: Promise.resolve([]),
			hasInteractiveDemos
				? Promise.all(
						interactiveDemoNodes.map((info) => processInteractiveDemoNode(info, highlighter, registryBasePath)),
					)
				: Promise.resolve([]),
		]);

		// Filter out any failed ones
		const successfulDemos = processedDemos.filter((d): d is ProcessedDemo => d !== null);
		const successfulReferences = processedReferences.filter((r): r is ProcessedReference => r !== null);
		const successfulInteractiveDemos = processedInteractiveDemos.filter(
			(d): d is ProcessedInteractiveDemo => d !== null,
		);

		// Step 3: Generate and inject imports (deduplicated)
		const allImports: ImportInfo[] = [];

		// Demo imports
		for (const demo of successfulDemos) {
			allImports.push({
				importName: demo.importName,
				importPath: demo.importPath,
				isDefault: true,
			});
		}

		// InteractiveDemo imports. SourceFirst demos are default-exported `Demo`
		// bound to the playground import name; legacy demos are named exports.
		for (const interactiveDemo of successfulInteractiveDemos) {
			allImports.push({
				importName: interactiveDemo.importName,
				importPath: interactiveDemo.importPath,
				isDefault: interactiveDemo.isSourceDefault ?? false,
				namedExport: interactiveDemo.isSourceDefault ? undefined : interactiveDemo.importName,
			});
		}

		if (allImports.length > 0) {
			const importNode = generateImportsNode(allImports);
			tree.children.unshift(importNode as RootContent);
		}

		// Step 4: Transform each node
		for (const processed of successfulDemos) {
			transformDemoNode(processed);
		}

		for (const processed of successfulReferences) {
			transformReferenceNode(processed);
		}

		for (const processed of successfulInteractiveDemos) {
			transformInteractiveDemoNode(processed);
		}
	};
};

export default rehypeTransform;

// ============================================================================
// Node Processing
// ============================================================================

async function processDemoNode(
	info: DemoNodeInfo,
	registryBasePath: string,
	// oxlint-disable-next-line typescript/no-explicit-any -- shiki generic types are complex
	highlighter: HighlighterGeneric<any, any>,
): Promise<ProcessedDemo | null> {
	try {
		// Resolve file path
		const filePath = resolveDemoPath(info.name, registryBasePath);
		const importPath = `@/registry/ui/${info.name}`;

		// Read source file
		const rawSource = await fs.readFile(filePath, "utf-8");

		// Transform using the transformer
		const { source, preview } = transformDemo(rawSource);

		// Highlight with shiki → HAST
		// defaultColor: false makes both light/dark use CSS variables instead of inline color
		const sourceHast = highlighter.codeToHast(source, {
			lang: "tsx",
			themes: { light: "github-light", dark: "github-dark" },
			defaultColor: false,
		});
		const previewHast = highlighter.codeToHast(preview, {
			lang: "tsx",
			themes: { light: "github-light", dark: "github-dark" },
			defaultColor: false,
		});

		// Mark pre elements with data-raw so mdx-components won't wrap them
		markPreAsRaw(sourceHast);
		markPreAsRaw(previewHast);

		// Generate unique import name
		const importName = generateImportName(info.name);

		return {
			nodeInfo: info,
			importName,
			importPath,
			sourceHast,
			previewHast,
		};
	} catch (error) {
		console.error(`[rehype-transform] Failed to process demo "${info.name}":`, error);
		return null;
	}
}

// ============================================================================
// HAST Helpers
// ============================================================================

function markPreAsRaw(hast: Root): void {
	// Find the <pre> element in the HAST and add data-raw attribute
	visit(hast, "element", (node: Element) => {
		if (node.tagName === "pre") {
			node.properties = node.properties || {};
			node.properties["data-raw"] = true;
		}
	});
}

// ============================================================================
// Path Resolution
// ============================================================================

function resolveDemoPath(demoName: string, registryBasePath: string): string {
	// demoName is like "button/demos/default"
	// File path is like "../packages/registry/src/ui/button/demos/default.tsx"
	return path.join(process.cwd(), registryBasePath, "ui", `${demoName}.tsx`);
}

function generateImportName(demoName: string): string {
	// "button/demos/default" -> "ButtonDemosDefault"
	return demoName
		.split(/[/-]/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

// ============================================================================
// Attribute Extraction
// ============================================================================

function extractNameAttribute(node: MdxJsxFlowElementHast): string | null {
	return extractStringAttribute(node, "name");
}

function extractStringAttribute(node: MdxJsxFlowElementHast, attrName: string): string | null {
	const attr = node.attributes.find((a): a is MdxJsxAttribute => a.type === "mdxJsxAttribute" && a.name === attrName);

	if (attr && typeof attr.value === "string") {
		return attr.value;
	}

	return null;
}

function extractControlsAttribute(node: MdxJsxFlowElementHast): ControlInput[] | null {
	const controlsAttr = node.attributes.find(
		(attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "controls",
	);

	if (!controlsAttr || typeof controlsAttr.value === "string") {
		return null;
	}

	// The value is an expression like {["variant", { name: "children", defaultValue: "Button" }]}.
	// The MDX compiler populates `.value` with the raw expression SOURCE string; evaluate it
	// directly at build time (trusted authored content). This handles negatives, nested objects,
	// and arrays that the old hand-rolled ESTree walker silently dropped; bad input fails loud.
	const exprValue = controlsAttr.value as MdxJsxAttributeValueExpression | undefined;
	const source = exprValue?.value;
	if (!source || typeof source !== "string") {
		throw new Error("[rehype-transform] <InteractiveDemo> controls={…} has no source expression");
	}

	let value: unknown;
	try {
		// oxlint-disable-next-line no-new-func -- build-time eval of a trusted authored MDX expression
		value = new Function(`"use strict"; return (${source});`)();
	} catch (error) {
		throw new Error(
			`[rehype-transform] Failed to evaluate controls={…} (${(error as Error).message}). Source: ${source}`,
		);
	}
	if (!Array.isArray(value)) {
		throw new Error(`[rehype-transform] controls must be an array; got ${typeof value}`);
	}
	return value as ControlInput[];
}

// ============================================================================
// Import Generation
// ============================================================================

function generateImportsNode(imports: ImportInfo[]): object {
	// Deduplicate imports by path, then by import name within each path
	const byPath = new Map<string, Map<string, ImportInfo>>();
	for (const info of imports) {
		if (!byPath.has(info.importPath)) {
			byPath.set(info.importPath, new Map());
		}
		const pathImports = byPath.get(info.importPath);
		if (!pathImports) continue;
		// Only add if this import name hasn't been seen for this path
		if (!pathImports.has(info.importName)) {
			pathImports.set(info.importName, info);
		}
	}

	const importDeclarations = Array.from(byPath.entries()).map(([importPath, infosMap]) => {
		const specifiers: object[] = [];

		for (const info of infosMap.values()) {
			if (info.isDefault) {
				specifiers.push({
					type: "ImportDefaultSpecifier",
					local: { type: "Identifier", name: info.importName },
				});
			} else if (info.namedExport) {
				specifiers.push({
					type: "ImportSpecifier",
					imported: { type: "Identifier", name: info.namedExport },
					local: { type: "Identifier", name: info.importName },
				});
			}
		}

		return {
			type: "ImportDeclaration",
			specifiers,
			source: { type: "Literal", value: importPath },
		};
	});

	return {
		type: "mdxjsEsm",
		value: "",
		data: {
			estree: {
				type: "Program",
				sourceType: "module",
				body: importDeclarations,
			},
		},
	};
}

// ============================================================================
// Node Transformation
// ============================================================================

function transformDemoNode(processed: ProcessedDemo): void {
	const { node } = processed.nodeInfo;

	// Remove the name attribute
	node.attributes = node.attributes.filter((attr) => !(attr.type === "mdxJsxAttribute" && attr.name === "name"));

	// Add component attribute: component={ImportedComponent}
	const componentAttr: MdxJsxAttribute = {
		type: "mdxJsxAttribute",
		name: "component",
		value: {
			type: "mdxJsxAttributeValueExpression",
			value: processed.importName,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExpressionStatement",
							expression: { type: "Identifier", name: processed.importName },
						},
					],
				},
			},
		} as MdxJsxAttributeValueExpression,
	};
	node.attributes.push(componentAttr);

	// Example doesn't consume the code slots — only Demo does. Inject a real
	// <h3 id="{slug}">{title}</h3> from the `title` prop so it shows up in the
	// TOC, then strip the prop from the JSX.
	if (processed.nodeInfo.type === "Example") {
		const { title, titleId } = processed.nodeInfo;
		const existing = (node.children ?? []) as ElementContent[];

		if (title && titleId) {
			node.attributes = node.attributes.filter((attr) => !(attr.type === "mdxJsxAttribute" && attr.name === "title"));
			const heading: Element = {
				type: "element",
				tagName: "h3",
				properties: { id: titleId },
				children: [{ type: "text", value: title }],
			};
			node.children = [heading, ...existing];
		} else {
			node.children = existing;
		}
		return;
	}

	// Create DemoCode wrapper with highlighted code HAST
	// sourceHast.children contains the <pre><code>...</code></pre> structure
	const demoCodeElement: MdxJsxFlowElementHast = {
		type: "mdxJsxFlowElement",
		name: "DemoCode",
		attributes: [],
		children: processed.sourceHast.children as ElementContent[],
	};

	// Create DemoCodePreview wrapper with highlighted preview HAST
	const demoCodePreviewElement: MdxJsxFlowElementHast = {
		type: "mdxJsxFlowElement",
		name: "DemoCodePreview",
		attributes: [],
		children: processed.previewHast.children as ElementContent[],
	};

	// Preserve existing children (e.g. MDX-authored headings) and append the code elements
	node.children = [...(node.children ?? []), demoCodeElement, demoCodePreviewElement] as ElementContent[];
}

// ============================================================================
// Reference Processing
// ============================================================================

async function processReferenceNode(
	info: ReferenceNodeInfo,
	// oxlint-disable-next-line typescript/no-explicit-any -- shiki generic types are complex
	highlighter: HighlighterGeneric<any, any>,
): Promise<ProcessedReference | null> {
	try {
		// Load the reference data
		const rawData = await loadApiReference(info.name);
		if (!rawData) {
			console.error(`[rehype-transform] API reference not found for "${info.name}"`);
			return null;
		}

		// Transform with highlighting
		const data = transformReference(rawData, highlighter);

		return {
			nodeInfo: info,
			data,
		};
	} catch (error) {
		console.error(`[rehype-transform] Failed to process reference "${info.name}":`, error);
		return null;
	}
}

function transformReferenceNode(processed: ProcessedReference): void {
	const { node } = processed.nodeInfo;

	// Remove the name attribute
	node.attributes = node.attributes.filter((attr) => !(attr.type === "mdxJsxAttribute" && attr.name === "name"));

	// Add data attribute with the transformed reference data as JSON
	// We use JSON.parse() in the JSX expression to convert the string back to an object
	const jsonString = JSON.stringify(processed.data);
	const dataAttr: MdxJsxAttribute = {
		type: "mdxJsxAttribute",
		name: "data",
		value: {
			type: "mdxJsxAttributeValueExpression",
			value: `JSON.parse(${JSON.stringify(jsonString)})`,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExpressionStatement",
							expression: {
								type: "CallExpression",
								callee: {
									type: "MemberExpression",
									object: { type: "Identifier", name: "JSON" },
									property: { type: "Identifier", name: "parse" },
									computed: false,
									optional: false,
								},
								arguments: [
									{
										type: "Literal",
										value: jsonString,
										raw: JSON.stringify(jsonString),
									},
								],
								optional: false,
							},
						},
					],
				},
			},
		} as MdxJsxAttributeValueExpression,
	};
	node.attributes.push(dataAttr);
}

// ============================================================================
// InteractiveDemo Processing
// ============================================================================

async function processInteractiveDemoNode(
	info: InteractiveDemoNodeInfo,
	// oxlint-disable-next-line typescript/no-explicit-any -- shiki generic types are complex
	highlighter: HighlighterGeneric<any, any>,
	registryBasePath: string,
): Promise<ProcessedInteractiveDemo | null> {
	try {
		const isSource = info.engine === "source";
		const fileSlug = info.file ?? "playground";

		// SourceFirst reads the real demo source: defaults come from its param signature
		// and the displayed code is generated by overlaying control values onto it.
		let rawSource: string | undefined;
		if (isSource) {
			const demoPath = path.join(process.cwd(), registryBasePath, "ui", info.name, "demos", `${fileSlug}.tsx`);
			rawSource = await fs.readFile(demoPath, "utf-8");
		}

		// 1. Build controls from API reference (+ param defaults for SourceFirst)
		const controls = await buildControlsFromReference(info.name, info.controls, rawSource);

		// 2. Enrich with highlighted types (HTML strings)
		const enrichedControls = await enrichControlsForSerialization(info.name, controls, highlighter);

		// 3. Import info — SourceFirst imports the default `Demo`; legacy a named export.
		const importName = `${toPascalCase(info.name)}Playground`;
		const importPath = `@/registry/ui/${info.name}/demos/${fileSlug}`;

		// 4. SourceFirst: build the code template by overlaying control values onto the source.
		let codeTemplate: CodeTemplate | undefined;
		if (isSource && rawSource) {
			const selections: ControlSelection[] = controls.map((c) => ({
				name: c.name,
				kind: c.type,
				default: c.type === "icon" ? null : (((c as { defaultValue?: unknown }).defaultValue as never) ?? null),
			}));
			codeTemplate = await buildSourceOverlay({ source: rawSource, controls: selections, componentName: info.name });
		}

		return {
			nodeInfo: info,
			importName,
			importPath,
			controls: enrichedControls,
			codeTemplate,
			isSourceDefault: isSource,
		};
	} catch (error) {
		console.error(`[rehype-transform] Failed to process interactive demo "${info.name}":`, error);
		return null;
	}
}

function transformInteractiveDemoNode(processed: ProcessedInteractiveDemo): void {
	const { node } = processed.nodeInfo;

	// Strip now-inert authoring attributes (replaced with runtime props below).
	node.attributes = node.attributes.filter(
		(attr) =>
			!(attr.type === "mdxJsxAttribute" && ["name", "controls", "engine", "file", "fallback"].includes(attr.name)),
	);

	// component={ButtonPlayground}
	const componentAttr: MdxJsxAttribute = {
		type: "mdxJsxAttribute",
		name: "component",
		value: {
			type: "mdxJsxAttributeValueExpression",
			value: processed.importName,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExpressionStatement",
							expression: { type: "Identifier", name: processed.importName },
						},
					],
				},
			},
		} as MdxJsxAttributeValueExpression,
	};
	node.attributes.push(componentAttr);

	// controls={JSON.parse("…")}
	node.attributes.push(makeJsonParseAttr("controls", JSON.stringify(processed.controls)));

	// codeTemplate={JSON.parse("…")} — SourceFirst only
	if (processed.codeTemplate) {
		node.attributes.push(makeJsonParseAttr("codeTemplate", JSON.stringify(processed.codeTemplate)));
	}
}

/** Build a `name={JSON.parse("…")}` MDX attribute that revives JSON at render time. */
function makeJsonParseAttr(name: string, jsonString: string): MdxJsxAttribute {
	return {
		type: "mdxJsxAttribute",
		name,
		value: {
			type: "mdxJsxAttributeValueExpression",
			value: `JSON.parse(${JSON.stringify(jsonString)})`,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExpressionStatement",
							expression: {
								type: "CallExpression",
								callee: {
									type: "MemberExpression",
									object: { type: "Identifier", name: "JSON" },
									property: { type: "Identifier", name: "parse" },
									computed: false,
									optional: false,
								},
								arguments: [{ type: "Literal", value: jsonString, raw: JSON.stringify(jsonString) }],
								optional: false,
							},
						},
					],
				},
			},
		} as MdxJsxAttributeValueExpression,
	};
}
