/**
 * Registry Build Script
 *
 * Generates internal files for lazy loading:
 * - src/registry/__generated__/ (demos, blocks, icons, examples, per-library icon exports)
 *
 * Usage: tsx scripts/registry-build.ts
 */

import { existsSync, promises as fs } from "node:fs";
import path from "node:path";

import { format } from "oxfmt";
import { rimraf } from "rimraf";

import { registryBase } from "../src/registry/base/registry";
import { registryBlocks } from "../src/registry/blocks/registry";
import { registryHooks } from "../src/registry/hooks/registry";
import { iconLibraries, registryIcons } from "../src/registry/icons/icon-map";
import { registryLib } from "../src/registry/lib/registry";
import { buildPublishables } from "../src/registry/publisher/build-time/build-publishables";
import { registryUi } from "../src/registry/ui/registry";

import type { RegistryItem } from "../src/registry/types";

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

async function writeGeneratedFile(targetPath: string, content: string) {
	const { code } = await format(targetPath, content, {
		printWidth: 120,
		useTabs: true,
	});

	await fs.writeFile(targetPath, code, "utf8");
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
		const blockFiles =
			block.files?.map((file: string | { path: string }) => (typeof file === "string" ? file : file.path)) || [];

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

	await writeGeneratedFile(targetPath, content);
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

	await writeGeneratedFile(targetPath, content);
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
	const iconsDir = GENERATED_DIR;

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
		const sortedIcons = [...icons].sort((a, b) => a.localeCompare(b));

		const exports = sortedIcons.length > 0 ? `export { ${sortedIcons.join(", ")} } from "${packageName}";` : "";

		const content = `// AUTO-GENERATED - DO NOT EDIT
// Only exports the ${sortedIcons.length} icons we actually use (not the entire library)
${exports}
`;

		const targetPath = path.join(iconsDir, `__${library}__.ts`);
		await writeGeneratedFile(targetPath, content);
		console.log(`  ✓ __generated__/__${library}__.ts (${sortedIcons.length} icons)`);
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
		.sort((a, b) => a.localeCompare(b))
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

	await writeGeneratedFile(targetPath, content);
	console.log(`  ✓ __generated__/icons.tsx (${lucideIconNames.size} lucide icons)`);
}

async function buildInternalExamples() {
	const targetPath = path.join(GENERATED_DIR, "examples.tsx");
	const uiDir = path.join(REGISTRY_DIR, "ui");
	const groupExamplesDir = path.join(process.cwd(), "src/modules/create/preview/group-examples");

	const componentFolders = await fs.readdir(uiDir);
	const entries: string[] = [];

	for (const folder of componentFolders.sort()) {
		const examplesPath = path.join(uiDir, folder, "examples.tsx");
		if (existsSync(examplesPath)) {
			entries.push(`  "${folder}": () => import("@/registry/ui/${folder}/examples"),`);
		}
	}

	const groupEntries: string[] = [];
	if (existsSync(groupExamplesDir)) {
		const groupFiles = await fs.readdir(groupExamplesDir);
		for (const file of groupFiles.sort()) {
			if (!file.endsWith(".tsx")) continue;
			const name = file.replace(/\.tsx$/, "");
			groupEntries.push(`  "${name}": () => import("@/modules/create/preview/group-examples/${name}"),`);
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

export const GroupExamplesIndex: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
${groupEntries.join("\n")}
};
`;

	await writeGeneratedFile(targetPath, content);
	console.log(`  ✓ __generated__/examples.tsx (${entries.length} components, ${groupEntries.length} groups)`);
}

// ============================================================================
// Build-time Guard: orphan + unique-name detection
// ============================================================================

/**
 * Folders that have a `meta.ts` on disk but are intentionally NOT registered
 * in their `registry.ts`. Keyed by path relative to `src/registry`.
 *
 * Phase-0 policy (SAFE cleanup — we are NOT shipping new items yet): every
 * current unregistered-with-meta folder is allowlisted so the build passes
 * WITHOUT registering anything new. Removing an entry below makes the build
 * FAIL until the item is either registered in its registry.ts or re-added here.
 *
 *   ui/context-menu      WIP — production-ready (base.tsx + 5 demos + examples),
 *                         candidate to register later (registryDeps: menu, popover).
 *   ui/sidebar           WIP — base.tsx + styles.ts but no demos/examples yet.
 *   ui/react-hook-form   WIP — name:"form"; meta points to a base.tsx that does
 *                         not exist yet. Do NOT register until base.tsx lands.
 *   ui/tanstack-form     WIP — name:"form"; stub (index.tsx + meta only).
 *   lib/context          Real runtime dep (used by avatar/tabs/sidebar/toggle-button)
 *                         but currently unregistered in lib/registry.ts.
 *
 * NOTE: react-hook-form and tanstack-form both declare name:"form". They do not
 * collide today because neither is registered. Registering both without renaming
 * one would trip the unique-name guard below.
 */
const ORPHAN_ALLOWLIST = new Set<string>([
	"ui/context-menu",
	"ui/sidebar",
	"ui/react-hook-form",
	"ui/tanstack-form",
	"lib/context",
]);

/**
 * Reads on-disk folders under `src/registry/<scope>`, dynamically imports each
 * folder's `meta.ts` default export, and asserts every on-disk meta is either
 * (a) present by object identity in `registered`, or (b) allowlisted.
 *
 * Identity (===) is reliable: registry-build.ts already imports the registered
 * arrays (which import every meta), so Node's ESM module cache returns the same
 * object instance for the dynamic import here.
 */
async function checkScopeOrphans(scope: "ui" | "lib", registered: RegistryItem[]): Promise<string[]> {
	const scopeDir = path.join(REGISTRY_DIR, scope);
	const dirEntries = await fs.readdir(scopeDir, { withFileTypes: true });
	const registeredSet = new Set<RegistryItem>(registered);
	const errors: string[] = [];

	for (const entry of dirEntries) {
		if (!entry.isDirectory()) continue;
		const metaPath = path.join(scopeDir, entry.name, "meta.ts");
		if (!existsSync(metaPath)) continue;

		const rel = `${scope}/${entry.name}`;
		// Relative specifier matches the file's existing `../src/registry/...` imports.
		const mod = (await import(`../src/registry/${scope}/${entry.name}/meta`)) as { default: RegistryItem };
		const meta = mod.default;

		if (registeredSet.has(meta)) continue; // registered — fine
		if (ORPHAN_ALLOWLIST.has(rel)) continue; // intentionally unregistered — fine

		errors.push(
			`Orphan registry item: \`${rel}/meta.ts\` (name: "${meta.name}") has a meta.ts but is not registered in ` +
				`\`${scope}/registry.ts\`. Either register it, or add "${rel}" to ORPHAN_ALLOWLIST in scripts/registry-build.ts.`,
		);
	}

	return errors;
}

/**
 * Asserts `meta.name` is globally unique across all REGISTERED items
 * (base + ui + lib + hooks + blocks). Unregistered/allowlisted items are not
 * checked here, so the two unregistered name:"form" folders don't collide.
 */
function checkUniqueRegisteredNames(): string[] {
	const seen = new Map<string, string>(); // name -> scope it was first seen in
	const errors: string[] = [];
	const groups: Array<[string, RegistryItem[]]> = [
		["base", registryBase as unknown as RegistryItem[]],
		["ui", registryUi],
		["lib", registryLib],
		["hooks", registryHooks],
		["blocks", registryBlocks as RegistryItem[]],
	];

	for (const [scope, items] of groups) {
		for (const item of items) {
			const prev = seen.get(item.name);
			if (prev) {
				errors.push(`Duplicate registered item name "${item.name}" (in ${prev} and ${scope}).`);
			} else {
				seen.set(item.name, scope);
			}
		}
	}

	return errors;
}

/** Runs all build-time integrity checks; throws (aborting the build) on any failure. */
async function checkRegistryIntegrity() {
	const errors = [
		...(await checkScopeOrphans("ui", registryUi)),
		...(await checkScopeOrphans("lib", registryLib)),
		...checkUniqueRegisteredNames(),
	];

	if (errors.length > 0) {
		throw new Error(`Registry integrity check failed:\n  - ${errors.join("\n  - ")}`);
	}
	console.log("  ✓ registry integrity (no un-allowlisted orphans, names unique)");
}

// ============================================================================
// Main
// ============================================================================

async function buildShadcnPublishables() {
	const { written, skipped } = await buildPublishables({
		registryDir: REGISTRY_DIR,
		items: registryUi,
	});
	for (const filePath of written) {
		console.log(`  ✓ ${path.relative(REGISTRY_DIR, filePath)}`);
	}
	if (skipped.length > 0) {
		console.log(`\n  ${skipped.length} component(s) skipped:`);
		for (const { name, reason } of skipped) {
			console.log(`    - ${name}: ${reason}`);
		}
	}
}

async function main() {
	console.log("🔨 Building registry...\n");

	try {
		console.log("Checking registry integrity");
		await checkRegistryIntegrity();

		console.log("\nGenerating internal files");
		await ensureDir(GENERATED_DIR);
		await buildIconLibraryExports();
		await buildInternalBlocks();
		await buildInternalDemos();
		await buildInternalIcons();
		await buildInternalExamples();

		console.log("\nGenerating shadcn publishables");
		await buildShadcnPublishables();

		console.log("\n✅ Registry built successfully!");
	} catch (error) {
		console.error("\n❌ Error building registry:", error);
		process.exit(1);
	}
}

main();
