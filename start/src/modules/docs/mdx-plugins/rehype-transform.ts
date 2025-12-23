import fs from "node:fs/promises";
import path from "node:path";
import { createHighlighter, type HighlighterGeneric } from "shiki";
import { visit } from "unist-util-visit";
import type { Element, ElementContent, Root, RootContent } from "hast";
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression, MdxJsxFlowElementHast } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";

import { transformDemo } from "./transformer";

// ============================================================================
// Cached Highlighter (singleton)
// ============================================================================

// biome-ignore lint/suspicious/noExplicitAny: shiki generic types are complex
let highlighterPromise: Promise<HighlighterGeneric<any, any>> | null = null;

async function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["github-light", "github-dark"],
			langs: ["tsx"],
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

// ============================================================================
// Main Plugin
// ============================================================================

const rehypeTransform: Plugin<[RehypeTransformOptions?], Root> = (options = {}) => {
	const { registryBasePath = "../packages/registry/src" } = options;

	return async (tree) => {
		const demoNodes: DemoNodeInfo[] = [];

		// Step 1: Collect all Demo/Example nodes
		visit(tree, "mdxJsxFlowElement", (node: MdxJsxFlowElementHast) => {
			if (node.name === "Demo" || node.name === "Example") {
				const name = extractDemoName(node);
				if (name) {
					demoNodes.push({
						node,
						name,
						type: node.name as "Demo" | "Example",
					});
				}
			}
		});

		if (demoNodes.length === 0) return;

		// Get the shared highlighter
		const highlighter = await getHighlighter();

		// Step 2: Process all demos in parallel
		const processedDemos = await Promise.all(
			demoNodes.map((info) => processDemoNode(info, registryBasePath, highlighter)),
		);

		// Filter out any failed ones
		const successfulDemos = processedDemos.filter((d): d is ProcessedDemo => d !== null);

		if (successfulDemos.length === 0) return;

		// Step 3: Generate and inject imports (deduplicated)
		const importNode = generateImportNode(successfulDemos);
		tree.children.unshift(importNode as RootContent);

		// Step 4: Transform each node
		for (const processed of successfulDemos) {
			transformDemoNode(processed);
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

function extractDemoName(node: MdxJsxFlowElementHast): string | null {
	// Look for name="..." attribute
	const nameAttr = node.attributes.find(
		(attr): attr is MdxJsxAttribute => attr.type === "mdxJsxAttribute" && attr.name === "name",
	);

	if (nameAttr && typeof nameAttr.value === "string") {
		return nameAttr.value;
	}

	return null;
}

// ============================================================================
// Import Generation
// ============================================================================

function generateImportNode(processedDemos: ProcessedDemo[]): object {
	// Deduplicate imports (same demo might be used multiple times)
	const uniqueImports = new Map<string, ProcessedDemo>();
	for (const demo of processedDemos) {
		if (!uniqueImports.has(demo.importPath)) {
			uniqueImports.set(demo.importPath, demo);
		}
	}

	const importDeclarations = Array.from(uniqueImports.values()).map((demo) => ({
		type: "ImportDeclaration",
		specifiers: [
			{
				type: "ImportDefaultSpecifier",
				local: { type: "Identifier", name: demo.importName },
			},
		],
		source: { type: "Literal", value: demo.importPath },
	}));

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
