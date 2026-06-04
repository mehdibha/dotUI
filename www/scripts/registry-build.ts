/**
 * Registry Build Script
 *
 * Generates internal files for lazy loading:
 * - src/registry/__generated__/ (demos, icons, examples, per-library icon exports)
 *
 * Usage: tsx scripts/registry-build.ts
 */

import { existsSync, promises as fs } from "node:fs";
import path from "node:path";

import { format } from "oxfmt";
import { rimraf } from "rimraf";

import { buildPublishables, collectBaseFiles } from "../src/publisher/build-time/build-publishables";
import { deriveRegistryDeps } from "../src/publisher/build-time/derive-registry-deps";
import { registryBase } from "../src/registry/base/registry";
import { registryHooks } from "../src/registry/hooks/registry";
import { iconLibraries, registryIcons } from "../src/registry/icons/icon-map";
import { registryLib } from "../src/registry/lib/registry";
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
// Generated item manifest: registryUi / registryLib globbed from meta.ts
// ============================================================================

// PascalCase identifier for a scope+slug, e.g. ("ui","color-area") -> "UiColorArea".
function toItemIdent(scope: "ui" | "lib", slug: string): string {
	const pascal = slug
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join("");
	return `${scope.charAt(0).toUpperCase()}${scope.slice(1)}${pascal}`;
}

// Emits __generated__/registry-items.ts — the single source of truth for
// registryUi/registryLib, globbed from on-disk {ui,lib}/*/meta.ts minus the
// ORPHAN_ALLOWLIST. Committed (load-bearing: ui/registry.ts + lib/registry.ts
// re-export it, and this script imports those at startup). Deleting it requires
// rerunning build:registry from a clean checkout before the next build works.
async function buildRegistryItemsManifest() {
	const targetPath = path.join(GENERATED_DIR, "registry-items.ts");
	const ui = await listRegistryFolders("ui");
	const lib = await listRegistryFolders("lib");

	const importLine = (scope: "ui" | "lib", slug: string) =>
		`import ${toItemIdent(scope, slug)} from "@/registry/${scope}/${slug}/meta";`;
	const arrayBlock = (name: string, scope: "ui" | "lib", slugs: string[]) =>
		`export const ${name}: RegistryItem[] = [\n${slugs.map((s) => `\t${toItemIdent(scope, s)},`).join("\n")}\n];`;

	// Sort value imports by module specifier (NOT identifier) to match oxfmt's
	// sortImports "value-internal" group — e.g. "ui/checkbox-group" sorts before
	// "ui/checkbox" ('-' < '/') — so the generated file passes `oxfmt --check` as-is
	// (writeGeneratedFile's inline format() does not re-sort imports). The type
	// import follows the value group with no blank line; the header comment is
	// detached by a blank line so oxfmt leaves it at the top.
	const valueImports = [
		...lib.map((s) => ({ spec: `@/registry/lib/${s}/meta`, line: importLine("lib", s) })),
		...ui.map((s) => ({ spec: `@/registry/ui/${s}/meta`, line: importLine("ui", s) })),
	]
		.sort((a, b) => (a.spec < b.spec ? -1 : a.spec > b.spec ? 1 : 0))
		.map((v) => v.line);

	const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate

${valueImports.join("\n")}

import type { RegistryItem } from "@/registry/types";

${arrayBlock("registryUi", "ui", ui)}

${arrayBlock("registryLib", "lib", lib)}
`;

	await writeGeneratedFile(targetPath, content);
	console.log(`  ✓ __generated__/registry-items.ts (${ui.length} ui, ${lib.length} lib)`);
}

// ============================================================================
// Build-time Guard: registry-items glob drift + integrity
// ============================================================================

/**
 * Folders that have a `meta.ts` on disk but are intentionally EXCLUDED from the
 * generated registry (work-in-progress, not shipped). This single Set is the
 * source of truth read by BOTH the glob that emits __generated__/registry-items.ts
 * AND the build-time guards — so emitter and guard can never disagree about the
 * registered set. Removing an entry makes that folder start shipping on the next
 * build:registry; adding a slug keeps a WIP item out.
 *
 *   ui/context-menu      WIP — production-ready (base.tsx + 5 demos + examples);
 *                         readiness check warns until it's removed from here.
 *   ui/sidebar           WIP — base.tsx + styles.ts but no demos/examples yet.
 *   ui/react-hook-form   WIP — name:"form"; meta points to a base.tsx that does
 *                         not exist yet.
 *   ui/tanstack-form     WIP — name:"form"; stub (index.tsx + meta only).
 *   lib/context          Real runtime dep (avatar/tabs/toggle-button) but not yet
 *                         a registered item.
 *
 * NOTE: react-hook-form and tanstack-form both declare name:"form"; they never
 * collide because both are excluded here (and bare ui/form has no meta.ts).
 */
const ORPHAN_ALLOWLIST = new Set<string>([
	"ui/context-menu",
	"ui/sidebar",
	"ui/react-hook-form",
	"ui/tanstack-form",
	"lib/context",
]);

/**
 * Directories under `src/registry/<scope>` that have a `meta.ts` on disk, minus
 * the ORPHAN_ALLOWLIST, sorted by slug. The ONE place the glob + exclusion lives
 * — both the manifest emitter and the drift guard call it, so they can never
 * disagree about what is registered.
 */
async function listRegistryFolders(scope: "ui" | "lib"): Promise<string[]> {
	const scopeDir = path.join(REGISTRY_DIR, scope);
	const dirEntries = await fs.readdir(scopeDir, { withFileTypes: true });
	const folders: string[] = [];
	for (const entry of dirEntries) {
		if (!entry.isDirectory()) continue;
		if (!existsSync(path.join(scopeDir, entry.name, "meta.ts"))) continue;
		if (ORPHAN_ALLOWLIST.has(`${scope}/${entry.name}`)) continue;
		folders.push(entry.name);
	}
	return folders.sort();
}

/**
 * Asserts the committed __generated__/registry-items.ts is in sync with the
 * on-disk folders: the imported runtime `registered` array must equal the freshly
 * globbed (non-allowlisted) folder set, by object identity, in both directions.
 * Catches a stale manifest (a component folder added/removed without rerunning
 * build:registry).
 *
 * Identity (===) is reliable: the dynamic `../src/registry/<scope>/<slug>/meta`
 * specifier and the manifest's `@/registry/<scope>/<slug>/meta` alias resolve to
 * the same module instance under tsx's ESM cache.
 */
async function checkScopeDrift(scope: "ui" | "lib", registered: RegistryItem[]): Promise<string[]> {
	const folders = await listRegistryFolders(scope);
	const registeredSet = new Set<RegistryItem>(registered);
	const globbed = new Set<RegistryItem>();
	const errors: string[] = [];
	const arrayName = scope === "ui" ? "registryUi" : "registryLib";

	for (const slug of folders) {
		const mod = (await import(`../src/registry/${scope}/${slug}/meta`)) as { default: RegistryItem };
		globbed.add(mod.default);
		if (!registeredSet.has(mod.default)) {
			errors.push(
				`Stale generated registry: \`${scope}/${slug}/meta.ts\` is on disk and not allowlisted, but ${arrayName} ` +
					`(from __generated__/registry-items.ts) does not contain it. Run \`pnpm build:registry\`.`,
			);
		}
	}
	for (const item of registered) {
		if (!globbed.has(item)) {
			errors.push(
				`Stale generated registry: ${arrayName} contains "${item.name}" which is no longer a non-allowlisted ` +
					`${scope}/* folder with a meta.ts. Run \`pnpm build:registry\`.`,
			);
		}
	}
	return errors;
}

/** Fails if an ORPHAN_ALLOWLIST entry no longer has a meta.ts on disk (rotted entry). */
function checkAllowlistStale(): string[] {
	const errors: string[] = [];
	for (const key of ORPHAN_ALLOWLIST) {
		if (!existsSync(path.join(REGISTRY_DIR, key, "meta.ts"))) {
			errors.push(
				`Stale ORPHAN_ALLOWLIST entry "${key}" — ${key}/meta.ts no longer exists. ` +
					`Remove it from ORPHAN_ALLOWLIST in scripts/registry-build.ts.`,
			);
		}
	}
	return errors;
}

/** Non-fatal: warns when an excluded ui/* folder looks production-ready (has demos/examples). */
function checkAllowlistReadiness(): void {
	for (const key of ORPHAN_ALLOWLIST) {
		if (!key.startsWith("ui/")) continue;
		const dir = path.join(REGISTRY_DIR, key);
		if (existsSync(path.join(dir, "demos")) || existsSync(path.join(dir, "examples.tsx"))) {
			console.warn(
				`  ⚠ ${key} is allowlisted (excluded from the registry) but has demos/examples — ` +
					`looks production-ready. Consider removing it from ORPHAN_ALLOWLIST so it ships.`,
			);
		}
	}
}

/**
 * Deps that ship in the init bundle (base.css / theme.css / lib/utils), dropped at
 * publish by publish.ts BUNDLED_INTO_INIT — a base file importing them is not drift.
 */
const BUNDLED_INTO_INIT = new Set(["utils", "focus-styles", "theme"]);

/**
 * Derived dep names whose target is NOT a registered item yet — a known packaging gap
 * (lib/context + the use-image-loading-status hook are unregistered). Skipped so the
 * drift check doesn't demand a dep `shadcn add` couldn't resolve. Keyed by DEP-NAME and
 * covers the hooks scope, so it is deliberately DISTINCT from ORPHAN_ALLOWLIST (folder-
 * path keyed, ui|lib only) — do not unify them. Drop an entry once its target is a
 * registered item, and the guard will then require consumers to declare it.
 */
const UNREGISTERED_DEP_ALLOWLIST = new Set(["context", "use-image-loading-status"]);

/**
 * Asserts each registered ui item DECLARES every registry dependency its shipped base
 * file(s) import. The shipped import graph is a SUBSET of the intended dependency
 * closure (composition/CSS-only deps are legitimately hand-added and not flagged), so
 * this catches only UNDER-declaration: a base file imports @/registry/X but meta omits "X".
 */
async function checkRegistryDepsDrift(): Promise<string[]> {
	const registeredNames = new Set<string>(
		[...registryBase, ...registryUi, ...registryLib, ...registryHooks].map((item) => item.name),
	);
	const errors: string[] = [];

	for (const meta of registryUi) {
		const derived = deriveRegistryDeps({ registryDir: REGISTRY_DIR, baseFiles: collectBaseFiles(meta) });
		const declared = new Set(meta.registryDependencies ?? []);

		for (const dep of derived) {
			if (declared.has(dep)) continue;
			if (BUNDLED_INTO_INIT.has(dep)) continue;
			if (UNREGISTERED_DEP_ALLOWLIST.has(dep)) continue;
			if (registeredNames.has(dep)) {
				errors.push(
					`registryDependencies drift: "${meta.name}" base file imports "${dep}" but meta omits it. ` +
						`Add "${dep}" to registryDependencies in ui/${meta.name}/meta.ts.`,
				);
			} else {
				errors.push(
					`Unresolved @/registry import in "${meta.name}": derived dep "${dep}" is not a registered item, ` +
						`not bundled, and not in UNREGISTERED_DEP_ALLOWLIST. Register it or add it to the allowlist.`,
				);
			}
		}
	}
	return errors;
}

/**
 * Asserts `meta.name` is globally unique across all REGISTERED items
 * (base + ui + lib + hooks). Unregistered/allowlisted items are not
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
	checkAllowlistReadiness();
	const errors = [
		...(await checkScopeDrift("ui", registryUi)),
		...(await checkScopeDrift("lib", registryLib)),
		...checkAllowlistStale(),
		...(await checkRegistryDepsDrift()),
		...checkUniqueRegisteredNames(),
	];

	if (errors.length > 0) {
		throw new Error(`Registry integrity check failed:\n  - ${errors.join("\n  - ")}`);
	}
	console.log("  ✓ registry integrity (generated set in sync, allowlist fresh, names unique)");
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
		await buildRegistryItemsManifest();
		await buildIconLibraryExports();
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
