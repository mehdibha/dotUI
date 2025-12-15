import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { rimraf } from "rimraf";

import { registryBase } from "../src/base/registry.js";
import { registryBlocks, blocksCategories } from "../src/blocks/registry.js";
import { registryHooks } from "../src/hooks/registry.js";
import { iconLibraries, registryIcons } from "../src/icons/registry.js";
import { registryLib } from "../src/lib/registry.js";
import { registryUi } from "../src/ui/registry.js";

const REGISTRY_SRC = path.join(process.cwd(), "src");
const CORE_GENERATED_DIR = path.resolve(process.cwd(), "../core/src/__generated__");

async function ensureGeneratedDir() {
	await rimraf(CORE_GENERATED_DIR);
	await fs.mkdir(CORE_GENERATED_DIR, { recursive: true });
}

async function readFileContent(filePath: string): Promise<string | null> {
	const fullPath = path.join(REGISTRY_SRC, filePath);
	if (!existsSync(fullPath)) {
		console.warn(`  Warning: File not found: ${filePath}`);
		return null;
	}
	return fs.readFile(fullPath, "utf-8");
}

function escapeForTemplate(content: string): string {
	return content
		.replace(/\\/g, "\\\\")
		.replace(/`/g, "\\`")
		.replace(/\$\{/g, "\\${");
}

interface FileEntry {
	type?: string;
	path?: string;
	target?: string;
	content?: string;
}

interface RegistryItemWithVariants {
	name: string;
	type?: string;
	defaultVariant?: string;
	variants?: Record<string, { files?: FileEntry[]; registryDependencies?: string[]; dependencies?: string[] }>;
	files?: FileEntry[];
	registryDependencies?: string[];
	dependencies?: string[];
	[key: string]: unknown;
}

async function processFiles(files: FileEntry[] | undefined): Promise<FileEntry[]> {
	if (!files) return [];

	const processed: FileEntry[] = [];
	for (const file of files) {
		if (!file.path) continue;

		const content = await readFileContent(file.path);
		if (content) {
			processed.push({
				type: file.type,
				path: file.path,
				target: file.target || file.path,
				content,
			});
		}
	}
	return processed;
}

async function processRegistryItem(item: RegistryItemWithVariants): Promise<object> {
	const result: Record<string, unknown> = {
		name: item.name,
		type: item.type,
	};

	// Copy other simple fields
	if (item.dependencies) result.dependencies = item.dependencies;
	if (item.registryDependencies) result.registryDependencies = item.registryDependencies;
	if (item.defaultVariant) result.defaultVariant = item.defaultVariant;
	if (item.description) result.description = item.description;
	if (item.categories) result.categories = item.categories;
	if (item.meta) result.meta = item.meta;
	if (item.extends) result.extends = item.extends;
	if (item.css) result.css = item.css;

	// Process variants with files
	if (item.variants) {
		const processedVariants: Record<string, object> = {};
		for (const [variantName, variant] of Object.entries(item.variants)) {
			const processedVariant: Record<string, unknown> = {};
			if (variant.files) {
				processedVariant.files = await processFiles(variant.files);
			}
			if (variant.registryDependencies) {
				processedVariant.registryDependencies = variant.registryDependencies;
			}
			if (variant.dependencies) {
				processedVariant.dependencies = variant.dependencies;
			}
			processedVariants[variantName] = processedVariant;
		}
		result.variants = processedVariants;
	}

	// Process top-level files (for items without variants)
	if (item.files && !item.variants) {
		result.files = await processFiles(item.files);
	}

	return result;
}

function generateFileContent(items: object[], exportName: string): string {
	const itemsJson = JSON.stringify(items, null, 2);

	// Convert JSON to TypeScript with template literals for content
	let tsContent = itemsJson.replace(
		/"content": "((?:[^"\\]|\\.)*)"/g,
		(_, content) => {
			// Unescape JSON string and re-escape for template literal
			const unescaped = JSON.parse(`"${content}"`);
			return `"content": \`${escapeForTemplate(unescaped)}\``;
		}
	);

	return `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build:core" to regenerate

export const ${exportName} = ${tsContent} as const;
`;
}

async function buildBase() {
	const processed = await Promise.all(
		registryBase.map((item) => processRegistryItem(item as RegistryItemWithVariants))
	);
	const content = generateFileContent(processed, "base");
	await fs.writeFile(path.join(CORE_GENERATED_DIR, "base.ts"), content, "utf-8");
	console.log("  ✓ base.ts");
}

async function buildHooks() {
	const processed = await Promise.all(
		registryHooks.map((item) => processRegistryItem(item as RegistryItemWithVariants))
	);
	const content = generateFileContent(processed, "hooks");
	await fs.writeFile(path.join(CORE_GENERATED_DIR, "hooks.ts"), content, "utf-8");
	console.log("  ✓ hooks.ts");
}

async function buildLib() {
	const processed = await Promise.all(
		registryLib.map((item) => processRegistryItem(item as RegistryItemWithVariants))
	);
	const content = generateFileContent(processed, "lib");
	await fs.writeFile(path.join(CORE_GENERATED_DIR, "lib.ts"), content, "utf-8");
	console.log("  ✓ lib.ts");
}

async function buildUi() {
	const processed = await Promise.all(
		registryUi.map((item) => processRegistryItem(item as RegistryItemWithVariants))
	);
	const content = generateFileContent(processed, "ui");
	await fs.writeFile(path.join(CORE_GENERATED_DIR, "ui.ts"), content, "utf-8");
	console.log("  ✓ ui.ts");
}

async function buildIcons() {
	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build:core" to regenerate

export const iconLibraries = ${JSON.stringify(iconLibraries, null, 2)} as const;

export type IconLibraryName = (typeof iconLibraries)[number]["name"];

export const icons = ${JSON.stringify(registryIcons, null, 2)} as const;
`;
	await fs.writeFile(path.join(CORE_GENERATED_DIR, "icons.ts"), content, "utf-8");
	console.log("  ✓ icons.ts");
}

async function buildBlocks() {
	const processed = await Promise.all(
		registryBlocks.map((item) => processRegistryItem(item as RegistryItemWithVariants))
	);

	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build:core" to regenerate

export const blocksCategories = ${JSON.stringify(blocksCategories, null, 2)} as const;

export const blocks = ${JSON.stringify(processed, null, 2).replace(
		/"content": "((?:[^"\\]|\\.)*)"/g,
		(_, content) => {
			const unescaped = JSON.parse(`"${content}"`);
			return `"content": \`${escapeForTemplate(unescaped)}\``;
		}
	)} as const;
`;
	await fs.writeFile(path.join(CORE_GENERATED_DIR, "blocks.ts"), content, "utf-8");
	console.log("  ✓ blocks.ts");
}

async function buildTypes() {
	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build:core" to regenerate

export interface FileEntry {
	type?: string;
	path: string;
	target: string;
	content: string;
}

export interface VariantData {
	files: FileEntry[];
	registryDependencies?: string[];
	dependencies?: string[];
}

export interface RegistryItemData {
	name: string;
	type?: string;
	defaultVariant?: string;
	variants?: Record<string, VariantData>;
	files?: FileEntry[];
	registryDependencies?: string[];
	dependencies?: string[];
	description?: string;
	categories?: string[];
	meta?: Record<string, unknown>;
	extends?: string;
	css?: Record<string, unknown>;
}

export interface IconLibrary {
	name: string;
	label: string;
	package: string;
	import: string;
}

export interface BlockCategory {
	name: string;
	slug: string;
}
`;
	await fs.writeFile(path.join(CORE_GENERATED_DIR, "types.ts"), content, "utf-8");
	console.log("  ✓ types.ts");
}

async function main() {
	console.log("🔨 Building core registry data...\n");

	try {
		await ensureGeneratedDir();

		await buildBase();
		await buildHooks();
		await buildLib();
		await buildUi();
		await buildIcons();
		await buildBlocks();
		await buildTypes();

		console.log("\n✅ Core registry data built successfully!");
	} catch (error) {
		console.error("\n❌ Error building core registry data:", error);
		process.exit(1);
	}
}

main();
