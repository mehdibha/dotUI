/**
 * Registry Build Script
 *
 * Generates all registry data:
 * - registry/src/__generated__/ (demos, blocks, icons for lazy loading)
 * - core/src/__registry__/ (registry data with embedded content for CLI)
 *
 * Usage: pnpm build
 */

import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { rimraf } from "rimraf";

import { registryBase } from "@dotui/registry/base/registry";
import { blocksCategories, registryBlocks } from "@dotui/registry/blocks/registry";
import { registryHooks } from "@dotui/registry/hooks/registry";
import { iconLibraries, registryIcons } from "@dotui/registry/icons/registry";
import { registryLib } from "@dotui/registry/lib/registry";
import { registryUi } from "@dotui/registry/ui/registry";

// Directories
const REGISTRY_DIR = path.join(process.cwd(), "src");
const GENERATED_DIR = path.join(process.cwd(), "src/__generated__");
const CORE_REGISTRY_DIR = path.resolve(process.cwd(), "../core/src/__registry__");
const REGISTRY_UI_DIR = path.join(process.cwd(), "src/ui");

// ============================================================================
// Utility Functions
// ============================================================================

async function ensureDir(dir: string) {
	await rimraf(dir);
	await fs.mkdir(dir, { recursive: true });
}

async function readFileContent(filePath: string): Promise<string | null> {
	const fullPath = path.join(REGISTRY_DIR, filePath);
	if (!existsSync(fullPath)) {
		console.warn(`  Warning: File not found: ${filePath}`);
		return null;
	}
	return fs.readFile(fullPath, "utf-8");
}

function escapeForTemplate(content: string): string {
	return content.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

// ============================================================================
// Phase 1: Internal Generated Files (registry/__generated__)
// ============================================================================

async function buildInternalBlocks() {
	const targetPath = path.join(GENERATED_DIR, "blocks.tsx");

	let content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate
import * as React from "react";

export const BlocksIndex: Record<
  string,
  {
    files: string[];
    component: React.LazyExoticComponent<React.ComponentType<object>>;
  }
> = {
`;

	for (const block of registryBlocks) {
		const blockFiles = block.files?.map((file) => (typeof file === "string" ? file : file.path)) || [];

		let componentPath = `@dotui/registry/blocks/${block.name}`;

		if (block.files && block.files.length > 0) {
			const files = block.files.map((file) =>
				typeof file === "string" ? { type: "registry:page", path: file } : file,
			);
			if (files[0]) {
				const firstFilePath = files[0].path.replace(/\.tsx?$/, "");
				componentPath = `@dotui/registry/${firstFilePath}`;
			}
		}

		content += `  "${block.name}": {
    files: ${JSON.stringify(blockFiles)},
    component: React.lazy(() => import("${componentPath}")),
  },
`;
	}

	content += `};
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log("  ✓ __generated__/blocks.tsx");
}

async function processDirectory(dirPath: string, relativePath: string, entries: string[]): Promise<void> {
	const dirEntries = await fs.readdir(dirPath, { withFileTypes: true });

	for (const entry of dirEntries) {
		if (entry.isFile() && entry.name.endsWith(".tsx")) {
			if (entry.name === "playground.tsx") continue;

			const demoName = entry.name.replace(".tsx", "");
			const key = `${relativePath}/${demoName}`;
			const importPath = `@dotui/registry/ui/${relativePath}/${demoName}`;
			const filePath = `ui/${relativePath}/${entry.name}`;

			entries.push(`  "${key}": {
    files: ["${filePath}"],
    component: React.lazy(() => import("${importPath}")),
  },
`);
		} else if (entry.isDirectory()) {
			const subDirPath = path.join(dirPath, entry.name);
			const subRelativePath = `${relativePath}/${entry.name}`;
			await processDirectory(subDirPath, subRelativePath, entries);
		}
	}
}

async function buildInternalDemos() {
	const targetPath = path.join(GENERATED_DIR, "demos.tsx");
	const sourcePath = path.join(process.cwd(), "src/ui");

	let content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate
import * as React from "react";

export const DemosIndex: Record<
  string,
  {
    files: string[];
    component: React.LazyExoticComponent<React.ComponentType<object>>;
  }
> = {
`;

	const componentFolders = await fs.readdir(sourcePath);
	const entries: string[] = [];

	for (const componentFolder of componentFolders) {
		const componentPath = path.join(sourcePath, componentFolder);
		const stats = await fs.stat(componentPath);

		if (!stats.isDirectory()) continue;

		const demosPath = path.join(componentPath, "demos");
		if (!existsSync(demosPath)) continue;

		await processDirectory(demosPath, `${componentFolder}/demos`, entries);
	}

	content += entries.join("");
	content += `};
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log("  ✓ __generated__/demos.tsx");
}

// Get the package import for each library
function getLibraryPackage(library: string): string {
	switch (library) {
		case "tabler":
			return "@tabler/icons-react";
		case "hugeicons":
			return "@hugeicons/core-free-icons"; // Data only, use HugeiconsIcon wrapper
		case "remix":
			return "@remixicon/react";
		default:
			return "";
	}
}

// Generate __libraryName__.ts files with only the icons we use
async function buildIconLibraryExports() {
	const iconsDir = path.join(REGISTRY_DIR, "icons");

	// Collect unique icon names per library
	const libraryIcons: Record<string, Set<string>> = {
		tabler: new Set(),
		hugeicons: new Set(),
		remix: new Set(),
	};

	for (const iconMapping of Object.values(registryIcons)) {
		if (iconMapping.tabler) libraryIcons.tabler?.add(iconMapping.tabler);
		if (iconMapping.hugeicons) libraryIcons.hugeicons?.add(iconMapping.hugeicons);
		if (iconMapping.remix) libraryIcons.remix?.add(iconMapping.remix);
	}

	// Generate a file for each library
	for (const [library, icons] of Object.entries(libraryIcons)) {
		const packageName = getLibraryPackage(library);
		const sortedIcons = [...icons].sort();

		const exports = sortedIcons.map((icon) => `export { ${icon} } from "${packageName}";`).join("\n");

		const content = `// AUTO-GENERATED - DO NOT EDIT
// Only exports the ${sortedIcons.length} icons we actually use (not the entire library)
${exports}
`;

		const targetPath = path.join(iconsDir, `__${library}__.ts`);
		await fs.writeFile(targetPath, content, "utf8");
		console.log(`  ✓ icons/__${library}__.ts (${sortedIcons.length} icons)`);
	}
}

async function buildInternalIcons() {
	const targetPath = path.join(GENERATED_DIR, "icons.tsx");

	const iconKeys = Object.keys(registryIcons);

	// Collect all unique lucide icon names for individual imports
	const lucideIconNames = new Set<string>();
	for (const iconKey of iconKeys) {
		const iconMapping = registryIcons[iconKey];
		if (iconMapping?.lucide) {
			lucideIconNames.add(iconMapping.lucide);
		}
	}

	// Generate individual imports with aliases to avoid naming collisions (tree-shakeable)
	const lucideImports = Array.from(lucideIconNames)
		.sort()
		.map((name) => `  ${name} as Lucide${name},`)
		.join("\n");

	const iconExports = iconKeys
		.map((iconKey) => {
			const iconMapping = registryIcons[iconKey];
			if (!iconMapping) {
				throw new Error(`Icon mapping not found for: ${iconKey}`);
			}

			const names = iconLibraries
				.map((library) => {
					const iconName = iconMapping[library.name];
					if (!iconName) {
						throw new Error(`Icon "${iconKey}" not found for library "${library.name}"`);
					}
					return `  ${library.name}: "${iconName}",`;
				})
				.join("\n");

			return `export const ${iconKey} = createIcon(Lucide${iconMapping.lucide}, {
${names}
});`;
		})
		.join("\n\n");

	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate
"use client";

import {
${lucideImports}
} from "lucide-react";
import { createIcon } from "@dotui/registry/icons/create-icon";

${iconExports}
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log(`  ✓ __generated__/icons.tsx (${lucideIconNames.size} lucide icons)`);
}

// ============================================================================
// Phase 2: Core Registry Data (core/__registry__)
// ============================================================================

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
	const tsContent = itemsJson.replace(/"content": "((?:[^"\\]|\\.)*)"/g, (_, content) => {
		// Unescape JSON string and re-escape for template literal
		const unescaped = JSON.parse(`"${content}"`);
		return `"content": \`${escapeForTemplate(unescaped)}\``;
	});

	return `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

export const ${exportName} = ${tsContent} as const;
`;
}

async function buildCoreBase() {
	const processed = await Promise.all(
		registryBase.map((item) => processRegistryItem(item as RegistryItemWithVariants)),
	);
	const content = generateFileContent(processed, "base");
	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "base.ts"), content, "utf-8");
	console.log("  ✓ core/__registry__/base.ts");
}

async function buildCoreHooks() {
	const processed = await Promise.all(
		registryHooks.map((item) => processRegistryItem(item as RegistryItemWithVariants)),
	);
	const content = generateFileContent(processed, "hooks");
	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "hooks.ts"), content, "utf-8");
	console.log("  ✓ core/__registry__/hooks.ts");
}

async function buildCoreLib() {
	const processed = await Promise.all(registryLib.map((item) => processRegistryItem(item as RegistryItemWithVariants)));
	const content = generateFileContent(processed, "lib");
	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "lib.ts"), content, "utf-8");
	console.log("  ✓ core/__registry__/lib.ts");
}

async function buildCoreUi() {
	const processed = await Promise.all(registryUi.map((item) => processRegistryItem(item as RegistryItemWithVariants)));
	const content = generateFileContent(processed, "ui");
	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "ui.ts"), content, "utf-8");
	console.log("  ✓ core/__registry__/ui.ts");
}

async function buildCoreIcons() {
	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

export const iconLibraries = ${JSON.stringify(iconLibraries, null, 2)} as const;

export type IconLibraryName = (typeof iconLibraries)[number]["name"];

export const icons = ${JSON.stringify(registryIcons, null, 2)} as const;
`;
	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "icons.ts"), content, "utf-8");
	console.log("  ✓ core/__registry__/icons.ts");
}

async function buildCoreBlocks() {
	const processed = await Promise.all(
		registryBlocks.map((item) => processRegistryItem(item as RegistryItemWithVariants)),
	);

	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

export const blocksCategories = ${JSON.stringify(blocksCategories, null, 2)} as const;

export const blocks = ${JSON.stringify(processed, null, 2).replace(/"content": "((?:[^"\\]|\\.)*)"/g, (_, content) => {
		const unescaped = JSON.parse(`"${content}"`);
		return `"content": \`${escapeForTemplate(unescaped)}\``;
	})} as const;
`;
	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "blocks.ts"), content, "utf-8");
	console.log("  ✓ core/__registry__/blocks.ts");
}

// ============================================================================
// Phase 3: Variants (from meta files)
// ============================================================================

interface VariantInfo {
	options: string[];
	default: string;
	group: string | null;
}

interface MetaFile {
	name: string;
	group?: string | null;
	defaultVariant?: string;
	variants?: Record<string, unknown>;
}

async function loadMetaFile(componentDir: string): Promise<MetaFile | null> {
	const metaPath = path.join(componentDir, "meta.ts");

	if (!existsSync(metaPath)) {
		return null;
	}

	try {
		const module = await import(metaPath);
		return module.default as MetaFile;
	} catch (error) {
		console.error(`Failed to load ${metaPath}:`, error);
		return null;
	}
}

async function collectVariants(): Promise<Map<string, VariantInfo>> {
	const variants = new Map<string, VariantInfo>();

	const allEntries = await fs.readdir(REGISTRY_UI_DIR, { withFileTypes: true });
	const components = allEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

	for (const component of components) {
		const meta = await loadMetaFile(path.join(REGISTRY_UI_DIR, component));

		if (!meta?.variants || !meta.defaultVariant) {
			continue;
		}

		const variantKeys = Object.keys(meta.variants);

		variants.set(meta.name, {
			options: variantKeys,
			default: meta.defaultVariant,
			group: meta.group ?? null,
		});
	}

	return variants;
}

function collectGroups(variants: Map<string, VariantInfo>): Map<string, string[]> {
	const groups = new Map<string, string[]>();

	for (const [name, info] of variants) {
		if (info.group) {
			const existing = groups.get(info.group) ?? [];
			existing.push(name);
			groups.set(info.group, existing);
		}
	}

	// Sort component names within each group
	for (const [group, components] of groups) {
		groups.set(group, components.sort());
	}

	return groups;
}

async function buildCoreVariants() {
	const variants = await collectVariants();
	const groups = collectGroups(variants);

	const lines: string[] = [
		"/**",
		" * Auto-generated by packages/registry/scripts/build.ts",
		" * DO NOT EDIT MANUALLY",
		" */",
		"",
	];

	// Generate VARIANTS constant
	lines.push("export const VARIANTS = {");

	const sortedVariants = [...variants.entries()].sort(([a], [b]) => a.localeCompare(b));

	for (const [name, info] of sortedVariants) {
		const optionsStr = info.options.map((o) => `"${o}"`).join(", ");
		lines.push(`\t"${name}": {`);
		lines.push(`\t\toptions: [${optionsStr}] as const,`);
		lines.push(`\t\tdefault: "${info.default}",`);
		lines.push(`\t\tgroup: ${info.group ? `"${info.group}"` : "null"},`);
		lines.push("\t},");
	}

	lines.push("} as const;");
	lines.push("");

	// Generate VARIANT_GROUPS constant
	lines.push("/** Component groups for style editor UI */");
	lines.push("export const VARIANT_GROUPS = {");

	const sortedGroups = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));

	for (const [group, components] of sortedGroups) {
		const componentsStr = components.map((c) => `"${c}"`).join(", ");
		lines.push(`\t"${group}": [${componentsStr}],`);
	}

	lines.push("} as const;");
	lines.push("");

	// Generate types
	lines.push("export type VariantKey = keyof typeof VARIANTS;");
	lines.push("export type VariantGroupKey = keyof typeof VARIANT_GROUPS;");
	lines.push("");

	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "variants.ts"), lines.join("\n"), "utf-8");
	console.log("  ✓ core/__registry__/variants.ts");
}

// ============================================================================
// Phase 4: Index file
// ============================================================================

async function buildCoreIndex() {
	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

import { base } from "./base";
import { hooks } from "./hooks";
import { lib } from "./lib";
import { ui } from "./ui";

/**
 * Combined registry of all items (UI, base, lib, hooks)
 */
export const registry = [...base, ...ui, ...lib, ...hooks];

export { base } from "./base";
export { hooks } from "./hooks";
export { lib } from "./lib";
export { ui } from "./ui";
export { icons, iconLibraries } from "./icons";
`;
	await fs.writeFile(path.join(CORE_REGISTRY_DIR, "index.ts"), content, "utf-8");
	console.log("  ✓ core/__registry__/index.ts");
}

// ============================================================================
// Main
// ============================================================================

async function main() {
	console.log("🔨 Building registry...\n");

	try {
		// Phase 1: Internal (registry/__generated__ and icons/)
		console.log("Phase 1: Internal generated files");
		await ensureDir(GENERATED_DIR);
		await buildIconLibraryExports();
		await buildInternalBlocks();
		await buildInternalDemos();
		await buildInternalIcons();

		// Phase 2: Core registry data (core/__registry__)
		console.log("\nPhase 2: Core registry data");
		await ensureDir(CORE_REGISTRY_DIR);
		await buildCoreBase();
		await buildCoreHooks();
		await buildCoreLib();
		await buildCoreUi();
		await buildCoreIcons();
		await buildCoreBlocks();
		await buildCoreVariants();
		await buildCoreIndex();

		console.log("\n✅ Registry built successfully!");
	} catch (error) {
		console.error("\n❌ Error building registry:", error);
		process.exit(1);
	}
}

main();
