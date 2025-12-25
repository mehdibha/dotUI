import fs from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type HighlighterGeneric } from "shiki";
import { visit } from "unist-util-visit";
import type { Element, ElementContent, Root, RootContent } from "hast";
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression, MdxJsxFlowElementHast } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";

import { transformDemo } from "./transformer";
import { loadApiReference } from "../../references/loader";
import { transformReference, type TransformedReference } from "../../references/transform";
import {
	buildControlsFromReference,
	enrichControlsForSerialization,
	toPascalCase,
} from "../../interactive-demo/process-controls";
import type {
	ControlInput,
	InteractiveDemoNodeInfo,
	ProcessedInteractiveDemo,
} from "../../interactive-demo/types";

// ============================================================================
// Cached Highlighter (singleton)
// ============================================================================

// biome-ignore lint/suspicious/noExplicitAny: shiki generic types are complex
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
	const { registryBasePath = "../packages/registry/src" } = options;

	return async (tree) => {
		const demoNodes: DemoNodeInfo[] = [];
		const referenceNodes: ReferenceNodeInfo[] = [];
		const interactiveDemoNodes: InteractiveDemoNodeInfo[] = [];

		// Step 1: Collect all Demo/Example/Reference/InteractiveDemo nodes
		visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElementHast) => {
			if (node.name === "Demo" || node.name === "Example") {
				const name = extractNameAttribute(node);
				if (name) {
					demoNodes.push({
						node,
						name,
						type: node.name as "Demo" | "Example",
					});
				}
			} else if (node.name === "Reference") {
				const name = extractNameAttribute(node);
				if (name) {
					referenceNodes.push({ node, name });
				}
			} else if (node.name === "InteractiveDemo") {
				const name = extractNameAttribute(node);
				const controls = extractControlsAttribute(node);
				const fallback = extractFallbackAttribute(node);
				if (name && controls) {
					interactiveDemoNodes.push({ node, name, controls, fallback });
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
				? Promise.all(interactiveDemoNodes.map((info) => processInteractiveDemoNode(info, highlighter)))
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

		// InteractiveDemo imports
		for (const interactiveDemo of successfulInteractiveDemos) {
			allImports.push({
				importName: interactiveDemo.importName,
				importPath: interactiveDemo.importPath,
				isDefault: false,
				namedExport: interactiveDemo.importName,
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
	// biome-ignore lint/suspicious/noExplicitAny: shiki generic types are complex
	highlighter: HighlighterGeneric<any, any>,
): Promise<ProcessedDemo | null> {
	try {
		// Resolve file path
		const filePath = resolveDemoPath(info.name, registryBasePath);
		const importPath = `@dotui/registry/ui/${info.name}`;

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
	const nameAttr = node.attributes.find(
		(attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "name",
	);

	if (nameAttr && typeof nameAttr.value === "string") {
		return nameAttr.value;
	}

	return null;
}

function extractFallbackAttribute(node: MdxJsxFlowElementHast): string | undefined {
	const fallbackAttr = node.attributes.find(
		(attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "fallback",
	);

	if (!fallbackAttr) return undefined;

	// Simple string value: fallback="<Button>Button</Button>"
	if (typeof fallbackAttr.value === "string") {
		return fallbackAttr.value;
	}

	// Expression value: fallback={`<Button>Button</Button>`}
	const exprValue = fallbackAttr.value as MdxJsxAttributeValueExpression | undefined;
	if (exprValue?.data?.estree) {
		try {
			const estree = exprValue.data.estree as {
				type: string;
				body: Array<{
					type: string;
					expression?: {
						type: string;
						value?: string;
						quasis?: Array<{ value: { raw: string; cooked: string } }>;
					};
				}>;
			};

			const body = estree.body[0];
			if (body?.type !== "ExpressionStatement") return undefined;

			const expr = body.expression;
			// Template literal: `<Button>Button</Button>`
			if (expr?.type === "TemplateLiteral" && expr.quasis?.length === 1) {
				return expr.quasis[0]?.value.cooked;
			}
			// String literal: "<Button>Button</Button>"
			if (expr?.type === "Literal" && typeof expr.value === "string") {
				return expr.value;
			}
		} catch {
			return undefined;
		}
	}

	return undefined;
}

function extractControlsAttribute(node: MdxJsxFlowElementHast): ControlInput[] | null {
	const controlsAttr = node.attributes.find(
		(attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "controls",
	);

	if (!controlsAttr || typeof controlsAttr.value === "string") {
		return null;
	}

	// The value is an expression like {["variant", "size", { name: "children", defaultValue: "Button" }]}
	const exprValue = controlsAttr.value as MdxJsxAttributeValueExpression | undefined;
	if (!exprValue?.data?.estree) {
		return null;
	}

	try {
		const estree = exprValue.data.estree as {
			type: string;
			body: Array<{
				type: string;
				expression?: {
					type: string;
					elements?: Array<unknown>;
				};
			}>;
		};

		// Program > ExpressionStatement > ArrayExpression
		const body = estree.body[0];
		if (body?.type !== "ExpressionStatement") {
			return null;
		}

		const expr = body.expression;
		if (expr?.type !== "ArrayExpression" || !expr.elements) {
			return null;
		}

		const controls: ControlInput[] = [];

		for (const element of expr.elements) {
			const parsed = parseControlElement(element);
			if (parsed) {
				controls.push(parsed);
			}
		}

		return controls;
	} catch (error) {
		console.error("[rehype-transform] Failed to parse controls attribute:", error);
		return null;
	}
}

function parseControlElement(element: unknown): ControlInput | null {
	if (!element || typeof element !== "object") {
		return null;
	}

	const node = element as { type: string; value?: unknown; properties?: unknown[] };

	// String literal: "variant"
	if (node.type === "Literal" && typeof node.value === "string") {
		return node.value;
	}

	// Object expression: { name: "children", defaultValue: "Button" }
	if (node.type === "ObjectExpression" && Array.isArray(node.properties)) {
		const obj: Record<string, unknown> = {};

		for (const prop of node.properties) {
			const propNode = prop as {
				type: string;
				key?: { type: string; name?: string; value?: string };
				value?: { type: string; value?: unknown; elements?: unknown[] };
			};

			if (propNode.type !== "Property" || !propNode.key || !propNode.value) {
				continue;
			}

			// Get property key
			let key: string | undefined;
			if (propNode.key.type === "Identifier") {
				key = propNode.key.name;
			} else if (propNode.key.type === "Literal") {
				key = String(propNode.key.value);
			}

			if (!key) continue;

			// Get property value
			const valueNode = propNode.value;
			if (valueNode.type === "Literal") {
				obj[key] = valueNode.value;
			} else if (valueNode.type === "ArrayExpression" && valueNode.elements) {
				// Array of literals (e.g., options: ["a", "b", "c"])
				obj[key] = valueNode.elements
					.map((el) => {
						const elNode = el as { type: string; value?: unknown };
						return elNode.type === "Literal" ? elNode.value : null;
					})
					.filter((v): v is string | number | boolean => v !== null);
			}
		}

		if (obj.name && typeof obj.name === "string") {
			return obj as ControlInput;
		}
	}

	return null;
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
		const pathImports = byPath.get(info.importPath)!;
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

	// Set children to the code elements
	node.children = [demoCodeElement, demoCodePreviewElement] as ElementContent[];
}

// ============================================================================
// Reference Processing
// ============================================================================

async function processReferenceNode(
	info: ReferenceNodeInfo,
	// biome-ignore lint/suspicious/noExplicitAny: shiki generic types are complex
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
	// biome-ignore lint/suspicious/noExplicitAny: shiki generic types are complex
	highlighter: HighlighterGeneric<any, any>,
): Promise<ProcessedInteractiveDemo | null> {
	try {
		// 1. Build controls from API reference
		const controls = await buildControlsFromReference(info.name, info.controls);

		// 2. Enrich with highlighted types (HTML strings)
		const enrichedControls = await enrichControlsForSerialization(info.name, controls, highlighter);

		// 3. Generate import info
		const importName = `${toPascalCase(info.name)}Playground`;
		const importPath = `@dotui/registry/ui/${info.name}/demos/playground`;

		// 4. Highlight fallback code if provided
		let fallbackHast: import("hast").Root | undefined;
		if (info.fallback) {
			fallbackHast = highlighter.codeToHast(info.fallback, {
				lang: "tsx",
				themes: { light: "github-light", dark: "github-dark" },
				defaultColor: false,
			});
			markPreAsRaw(fallbackHast);
		}

		return {
			nodeInfo: info,
			importName,
			importPath,
			controls: enrichedControls,
			fallbackHast,
		};
	} catch (error) {
		console.error(`[rehype-transform] Failed to process interactive demo "${info.name}":`, error);
		return null;
	}
}

function transformInteractiveDemoNode(processed: ProcessedInteractiveDemo): void {
	const { node } = processed.nodeInfo;

	// Remove name, controls, and fallback attributes
	node.attributes = node.attributes.filter(
		(attr) =>
			!(attr.type === "mdxJsxAttribute" && (attr.name === "name" || attr.name === "controls" || attr.name === "fallback")),
	);

	// Add component attribute: component={ButtonPlayground}
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

	// Add controls attribute with enriched controls data as JSON
	const jsonString = JSON.stringify(processed.controls);
	const controlsAttr: MdxJsxAttribute = {
		type: "mdxJsxAttribute",
		name: "controls",
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
	node.attributes.push(controlsAttr);

	// Add fallback HAST as children if provided
	if (processed.fallbackHast) {
		node.children = processed.fallbackHast.children as ElementContent[];
	}
}
