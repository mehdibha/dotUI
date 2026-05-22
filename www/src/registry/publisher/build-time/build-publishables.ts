/**
 * Build-time orchestrator. Iterates the dotui registry and emits a
 * `__generated__/publishables/<name>.ts` for every component whose
 * `styles.ts` can be statically extracted and whose `base.tsx` can be
 * transformed. Skipped components log a warning but don't abort the build.
 *
 * Called from `scripts/registry-build.ts`. Imports `ts-morph` (via the
 * extract / transform modules) — never imported from a route bundle.
 */

import { existsSync, promises as fs } from "node:fs";
import path from "node:path";

import { format } from "oxfmt";

import { extractStylesConfig } from "./extract-config";
import { transformBase, TV_CONFIG_PLACEHOLDER } from "./transform-base";

import type { StylesConfig } from "../types";

import type { RegistryItem, RegistryItemFile } from "@/registry/types";

interface BuildPublishablesOptions {
	/** Absolute path to `www/src/registry`. */
	registryDir: string;
	/** Registry items to process. */
	items: RegistryItem[];
}

export interface BuildPublishablesResult {
	written: string[];
	skipped: Array<{ name: string; reason: string }>;
}

export async function buildPublishables({
	registryDir,
	items,
}: BuildPublishablesOptions): Promise<BuildPublishablesResult> {
	const outDir = path.join(registryDir, "__generated__/publishables");
	await fs.mkdir(outDir, { recursive: true });

	const written: string[] = [];
	const skipped: Array<{ name: string; reason: string }> = [];

	for (const meta of items) {
		try {
			const result = await buildOne({ meta, registryDir, outDir });
			if (result === "skipped") {
				skipped.push({ name: meta.name, reason: "no base.tsx in meta.files" });
			} else if (typeof result === "string") {
				written.push(result);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			skipped.push({ name: meta.name, reason: message });
		}
	}

	// Emit the runtime lookup index so the route handler can resolve a
	// component name without dynamically constructing import paths.
	const indexPath = path.join(outDir, "index.ts");
	await fs.writeFile(indexPath, renderIndex(written, outDir), "utf8");
	written.push(indexPath);

	// Concatenate the base CSS sources so the init endpoint can ship them.
	const bundlePath = path.join(registryDir, "__generated__", "base-css.ts");
	await fs.mkdir(path.dirname(bundlePath), { recursive: true });
	await fs.writeFile(bundlePath, await renderBaseCssBundle(registryDir), "utf8");
	written.push(bundlePath);

	return { written, skipped };
}

function renderIndex(writtenPaths: string[], outDir: string): string {
	const names = writtenPaths
		.filter((p) => p.endsWith(".ts") && !p.endsWith("/index.ts"))
		.map((p) => path.basename(p, ".ts"))
		.sort();

	const lines: string[] = [];
	lines.push(`// AUTO-GENERATED — do not edit. Run \`pnpm build:registry\`.`);
	lines.push(`import type { Publishable } from "@/registry/publisher/types";`);
	lines.push(``);
	lines.push(`type Loader = () => Promise<{ publishable: Publishable; publishableByPath?: Record<string, Publishable> }>;`);
	lines.push(``);
	lines.push(`export const publishables: Record<string, Loader> = {`);
	for (const name of names) {
		// JSON.stringify guards against weird characters even though component names are slug-shaped.
		lines.push(`\t${JSON.stringify(name)}: () => import(${JSON.stringify(`./${name}`)}),`);
	}
	lines.push(`};`);
	lines.push(``);
	lines.push(`export const PUBLISHABLE_NAMES: readonly string[] = ${JSON.stringify(names)};`);
	lines.push(``);
	// Silence the unused warning for callers that only use `publishables`.
	void outDir;
	return lines.join("\n");
}

async function renderBaseCssBundle(registryDir: string): Promise<string> {
	// Order matches `www/src/registry/styles.css`.
	const candidates = [
		path.join(registryDir, "base", "base.css"),
		path.join(registryDir, "base", "colors.css"),
		path.join(registryDir, "base", "theme.css"),
		path.join(registryDir, "base", "fonts.css"),
	];
	const parts: string[] = [];
	for (const file of candidates) {
		try {
			const css = await fs.readFile(file, "utf8");
			parts.push(`/* ===== ${path.basename(file)} ===== */`);
			parts.push(css.trimEnd());
		} catch {
			// Missing source file — skip silently.
		}
	}
	const bundle = parts.join("\n\n");

	const lines: string[] = [];
	lines.push(`// AUTO-GENERATED — do not edit. Run \`pnpm build:registry\`.`);
	lines.push(`// Concatenation of www/src/registry/base/*.css for the registry:base init item.`);
	lines.push(``);
	lines.push(`export const baseCss = ${JSON.stringify(bundle)};`);
	lines.push(``);
	return lines.join("\n");
}

interface BuildOneInput {
	meta: RegistryItem;
	registryDir: string;
	outDir: string;
}

/**
 * Build one publishable. Returns the file path written, "skipped" when the
 * component has no base.tsx (non-ui registry entries), or throws.
 */
async function buildOne({ meta, registryDir, outDir }: BuildOneInput): Promise<string | "skipped"> {
	const baseFiles = collectBaseFiles(meta);
	if (baseFiles.length === 0) return "skipped";

	// Extract the styles config once per component (it's shared across enum-file variants).
	const componentDir = path.join(registryDir, "ui", meta.name);
	const stylesTsPath = path.join(componentDir, "styles.ts");
	const hasStyles = existsSync(stylesTsPath);
	const stylesConfig: StylesConfig = hasStyles
		? extractStylesConfig(stylesTsPath)
		: emptyStylesConfig();

	// Transform each base file to a template.
	const templates = baseFiles.map((file) => {
		const absPath = path.join(registryDir, file.path);
		const { template } = transformBase({
			baseTsxPath: absPath,
			componentName: meta.name,
			hasStylesConfig: hasStyles,
		});
		return { file, template };
	});

	const outPath = path.join(outDir, `${meta.name}.ts`);
	const source = await renderPublishableSource({ meta, stylesConfig, templates });
	await fs.writeFile(outPath, source, "utf8");
	return outPath;
}

/**
 * Determine which base file(s) get transformed for a component.
 *
 * - Default: the file in `meta.files` whose target ends in `<name>.tsx`.
 * - Enum-with-files: every distinct base path across `params[...].files[...]`.
 */
function collectBaseFiles(meta: RegistryItem): RegistryItemFile[] {
	const byKey = new Map<string, RegistryItemFile>();

	for (const file of meta.files ?? []) {
		if (isBaseFile(file, meta.name)) byKey.set(file.path, file);
	}
	for (const def of Object.values(meta.params ?? {})) {
		if (def.kind !== "enum" || !def.files) continue;
		for (const fileList of Object.values(def.files)) {
			for (const file of fileList) {
				if (isBaseFile(file, meta.name)) byKey.set(file.path, file);
			}
		}
	}
	return [...byKey.values()];
}

function isBaseFile(file: RegistryItemFile, componentName: string): boolean {
	// We treat any tsx whose source path lives under `ui/<name>/` and starts with
	// `base` as a base file.
	const segments = file.path.split("/");
	const last = segments.at(-1) ?? "";
	return (
		segments[0] === "ui" &&
		segments[1] === componentName &&
		last.startsWith("base") &&
		last.endsWith(".tsx")
	);
}

function emptyStylesConfig(): StylesConfig {
	return { base: {} };
}

/* -------------------------- source generation -------------------------- */

interface RenderInput {
	meta: RegistryItem;
	stylesConfig: StylesConfig;
	templates: Array<{ file: RegistryItemFile; template: string }>;
}

async function renderPublishableSource({ meta, stylesConfig, templates }: RenderInput): Promise<string> {
	// We emit two top-level exports:
	//   - `publishable`: the default (single-template) Publishable
	//   - `publishableByPath`: a map keyed by source file path, for enum-with-files components
	//
	// The runtime route picks the right entry based on the preset's selection of
	// the enum param that drives file swapping (handled by resolve-files.ts).

	const defaultFile =
		(meta.files ?? []).find((f) => isBaseFile(f, meta.name)) ?? templates[0]?.file;
	const defaultTemplate = templates.find((t) => t.file.path === defaultFile?.path) ?? templates[0];

	if (!defaultTemplate || !defaultFile) {
		throw new Error(`[publisher] no default base file resolved for "${meta.name}"`);
	}

	const stylesConfigLiteral = JSON.stringify(stylesConfig, null, 2);
	const metaLiteral = JSON.stringify(metaForRuntime(meta), null, 2);

	const lines: string[] = [];
	lines.push(`// AUTO-GENERATED — do not edit. Source: ui/${meta.name}/`);
	lines.push(`// Run \`pnpm build:registry\` to regenerate.`);
	lines.push(``);
	lines.push(`import type { Publishable } from "@/registry/publisher/types";`);
	lines.push(``);
	lines.push(`const stylesConfig = ${stylesConfigLiteral} as const;`);
	lines.push(``);
	lines.push(`const meta = ${metaLiteral} as const;`);
	lines.push(``);
	lines.push(`export const publishable: Publishable = {`);
	lines.push(`\ttemplate: ${templateLiteral(defaultTemplate.template)},`);
	lines.push(`\tstylesConfig: stylesConfig as unknown as Publishable["stylesConfig"],`);
	lines.push(`\tmeta: meta as unknown as Publishable["meta"],`);
	lines.push(`};`);

	if (templates.length > 1) {
		lines.push(``);
		lines.push(`export const publishableByPath: Record<string, Publishable> = {`);
		for (const { file, template } of templates) {
			lines.push(`\t${JSON.stringify(file.path)}: {`);
			lines.push(`\t\ttemplate: ${templateLiteral(template)},`);
			lines.push(`\t\tstylesConfig: stylesConfig as unknown as Publishable["stylesConfig"],`);
			lines.push(`\t\tmeta: meta as unknown as Publishable["meta"],`);
			lines.push(`\t},`);
		}
		lines.push(`};`);
	}

	lines.push(``);

	const raw = lines.join("\n");
	try {
		const { code } = await format("publishable.ts", raw, {
			printWidth: 120,
			useTabs: true,
		});
		return code;
	} catch {
		// Formatting is cosmetic — never block the build over a formatter hiccup.
		return raw;
	}
}

/**
 * Strip dev-only fields from meta. We keep `params` because the request-time
 * publisher reads scalar param definitions for the class rewriter; everything
 * downstream of `publish()` drops `params` from the emitted shadcn JSON.
 * Drops fields that don't survive JSON round-trip (e.g. `as const` literals
 * are already arrays/objects after extraction).
 */
function metaForRuntime(meta: RegistryItem): RegistryItem {
	const { ...rest } = meta;
	return rest;
}

function templateLiteral(template: string): string {
	// Use backtick template literal but escape backslashes, backticks, and ${.
	const escaped = template.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
	return `\`${escaped}\``;
}

/**
 * Sanity check used by `assertPlaceholderInTemplate` callers when wiring up
 * the request-time route — exposed so the build script can fail fast when a
 * `useStyles()`-using component's transform somehow produces a template
 * without a placeholder.
 */
export function assertPlaceholderInTemplate(name: string, template: string): void {
	if (!template.includes(TV_CONFIG_PLACEHOLDER)) {
		throw new Error(`[publisher] template for "${name}" has no ${TV_CONFIG_PLACEHOLDER} placeholder`);
	}
}
