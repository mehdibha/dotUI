/**
 * Registry Build Script
 *
 * Generates internal files for lazy loading:
 * - src/registry/__generated__/ (demos, blocks, icons)
 * - src/registry/icons/__*.ts (icon library exports)
 *
 * Usage: tsx scripts/registry-build.ts
 */

import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { rimraf } from "rimraf";

import { registryBlocks } from "../src/registry/blocks/registry";
import { iconLibraries, registryIcons } from "../src/registry/icons/registry";

// Directories — relative to www/ (process.cwd())
const REGISTRY_DIR = path.join(process.cwd(), "src/registry");
const GENERATED_DIR = path.join(REGISTRY_DIR, "__generated__");

// ============================================================================
// Utility Functions
// ============================================================================

async function ensureDir(dir: string) {
	await rimraf(dir);
	await fs.mkdir(dir, { recursive: true });
}

// ============================================================================
// Phase 1: Internal Generated Files (registry/__generated__)
// ============================================================================

async function buildInternalBlocks() {
	const targetPath = path.join(GENERATED_DIR, "blocks.tsx");

	let content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate
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
		const blockFiles = block.files?.map((file: string | { path: string }) => (typeof file === "string" ? file : file.path)) || [];

		let componentPath = `@/registry/blocks/${block.name}`;

		if (block.files && block.files.length > 0) {
			const files = block.files.map((file: string | { type?: string; path: string }) =>
				typeof file === "string" ? { type: "registry:page", path: file } : file,
			);
			if (files[0]) {
				const firstFilePath = files[0].path.replace(/\.tsx?$/, "");
				componentPath = `@/registry/${firstFilePath}`;
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
			const importPath = `@/registry/ui/${relativePath}/${demoName}`;
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
	const sourcePath = path.join(REGISTRY_DIR, "ui");

	let content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate
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
			return "@hugeicons/core-free-icons";
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
// Run "tsx scripts/registry-build.ts" to regenerate
"use client";

import {
${lucideImports}
} from "lucide-react";
import { createIcon } from "@/registry/icons/create-icon";

${iconExports}
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log(`  ✓ __generated__/icons.tsx (${lucideIconNames.size} lucide icons)`);
}

async function buildInternalExamples() {
	const targetPath = path.join(GENERATED_DIR, "examples.tsx");
	const uiDir = path.join(REGISTRY_DIR, "ui");

	const componentFolders = await fs.readdir(uiDir);
	const entries: string[] = [];

	for (const folder of componentFolders.sort()) {
		const examplesPath = path.join(uiDir, folder, "examples.tsx");
		if (existsSync(examplesPath)) {
			entries.push(`  "${folder}": () => import("@/registry/ui/${folder}/examples"),`);
		}
	}

	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate

export const ExamplesIndex: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
${entries.join("\n")}
};
`;

	await fs.writeFile(targetPath, content, "utf8");
	console.log(`  ✓ __generated__/examples.tsx (${entries.length} components)`);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
	console.log("🔨 Building registry...\n");

	try {
		console.log("Generating internal files");
		await ensureDir(GENERATED_DIR);
		await buildIconLibraryExports();
		await buildInternalBlocks();
		await buildInternalDemos();
		await buildInternalIcons();
		await buildInternalExamples();

		console.log("\n✅ Registry built successfully!");
	} catch (error) {
		console.error("\n❌ Error building registry:", error);
		process.exit(1);
	}
}

main();
