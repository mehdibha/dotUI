/* Codemod: migrate "react-aria-components" flat imports to subpath + namespace imports.
   - Components/types → `import * as FooPrimitives from "react-aria-components/Foo"`
   - Utilities (lowercase subpaths like composeRenderProps) → named import from subpath
   Each file is solved with a greedy set-cover so related primitives share one namespace.

   Implementation: purely text-based rewrite on the import block + per-file \bWord\b
   replacement. No language-service rename (that propagates project-wide and mangled
   references when import specifiers shared names across files). */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { globby } from "globby";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.resolve(__dirname, "..");

// ---------- Enumerate subpaths and their exports ----------
const EXPORTS_DIR = path.join(WWW, "node_modules/react-aria-components/dist/exports");
const TYPES_DIR = path.join(WWW, "node_modules/react-aria-components/dist/types/exports");

const subpathFiles = readdirSync(EXPORTS_DIR).filter(
	(f) => f.endsWith(".mjs") && f !== "index.mjs" && !f.startsWith("private"),
);

const subpathValueExports = new Map<string, Set<string>>();
for (const f of subpathFiles) {
	const sub = f.replace(".mjs", "");
	try {
		const mod = await import(pathToFileURL(path.join(EXPORTS_DIR, f)).href);
		subpathValueExports.set(sub, new Set(Object.keys(mod).filter((k) => k !== "default")));
	} catch (e) {
		console.warn(`[warn] cannot load subpath ${sub}:`, (e as Error).message);
	}
}

const subpathTypeExports = new Map<string, Set<string>>();
for (const f of readdirSync(TYPES_DIR).filter(
	(f) => f.endsWith(".d.ts") && f !== "index.d.ts" && !f.startsWith("private"),
)) {
	const sub = f.replace(".d.ts", "");
	const content = readFileSync(path.join(TYPES_DIR, f), "utf-8");
	const types = new Set<string>();
	for (const m of content.matchAll(/export\s+type\s*\{([^}]+)\}/g)) {
		for (const raw of m[1].split(",")) {
			const name = raw.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
			if (name) types.add(name);
		}
	}
	for (const m of content.matchAll(/export\s*\{([^}]+)\}/g)) {
		for (const raw of m[1].split(",")) {
			const trimmed = raw.trim();
			if (trimmed.startsWith("type ")) {
				const name = trimmed.slice(5).split(/\s+as\s+/)[0].trim();
				if (name) types.add(name);
			}
		}
	}
	subpathTypeExports.set(sub, types);
}

function subpathHas(sub: string, sym: string): boolean {
	return !!subpathValueExports.get(sub)?.has(sym) || !!subpathTypeExports.get(sub)?.has(sym);
}

function allSubpathsFor(sym: string): string[] {
	const out: string[] = [];
	for (const sub of subpathValueExports.keys()) if (subpathHas(sub, sym)) out.push(sub);
	for (const sub of subpathTypeExports.keys()) if (!out.includes(sub) && subpathHas(sub, sym)) out.push(sub);
	return out;
}

// Utility subpaths → named imports, not namespace imports.
const isUtilSubpath = (sub: string) => /^[a-z]/.test(sub);

// ---------- Deterministic per-symbol home resolution ----------
// Each symbol maps to ONE canonical subpath so the choice is stable across files.
// Rules (in order):
//   1. exact: a subpath named S exists and exports S.
//   2. suffix strip (Props, Context, StateContext, RenderProps) then rule 1.
//   3. longest prefix: subpath P such that S starts with P, tie-break longest P.
//   4. fallback: any subpath that exports S, preferring shortest name.

const STRIP_SUFFIXES = ["StateContext", "RenderProps", "Context", "Props"];

function resolveHome(sym: string): string | null {
	const candidates = allSubpathsFor(sym);
	if (candidates.length === 0) return null;

	// Rule 1: exact match.
	if (candidates.includes(sym)) return sym;

	// Rule 2: strip suffix.
	for (const suf of STRIP_SUFFIXES) {
		if (sym.endsWith(suf)) {
			const base = sym.slice(0, -suf.length);
			if (base && candidates.includes(base)) return base;
		}
	}

	// Rule 3: longest prefix.
	const prefixes = candidates
		.filter((c) => sym.startsWith(c) && c !== sym)
		.sort((a, b) => b.length - a.length);
	if (prefixes.length > 0) return prefixes[0];

	// Rule 4: shortest fallback.
	return [...candidates].sort((a, b) => a.length - b.length)[0];
}

function solveCover(symbols: string[]): Map<string, string> {
	const chosen = new Map<string, string>();
	for (const s of symbols) {
		const home = resolveHome(s);
		if (home) chosen.set(s, home);
	}
	return chosen;
}

// ---------- Parse flat rac imports in a file ----------

type ImportEntry = {
	name: string;        // the exported identifier, e.g. "Menu"
	alias: string;       // local binding, e.g. "AriaMenu" (equals name if unaliased)
	isType: boolean;     // true if declared via `import type` or `type Name`
};

type ParsedImport = {
	start: number;
	end: number;
	entries: ImportEntry[];
};

function findRacImports(src: string): ParsedImport[] {
	const results: ParsedImport[] = [];
	// Match: import [type] { ... } from "react-aria-components" ;
	const re = /import\s+(type\s+)?\{([^}]*)\}\s*from\s*["']react-aria-components["']\s*;?/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(src)) !== null) {
		const declType = !!m[1];
		const body = m[2];
		const entries: ImportEntry[] = [];
		for (const rawSpec of body.split(",")) {
			const t = rawSpec.trim();
			if (!t) continue;
			let specifier = t;
			let isType = declType;
			if (specifier.startsWith("type ")) {
				isType = true;
				specifier = specifier.slice(5).trim();
			}
			const asMatch = specifier.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
			if (asMatch) {
				entries.push({ name: asMatch[1], alias: asMatch[2], isType });
			} else if (/^[A-Za-z_$][\w$]*$/.test(specifier)) {
				entries.push({ name: specifier, alias: specifier, isType });
			}
		}
		results.push({ start: m.index, end: m.index + m[0].length, entries });
	}
	return results;
}

// ---------- Process one file ----------

function processFile(filePath: string): boolean {
	const src = readFileSync(filePath, "utf-8");
	const racImports = findRacImports(src);
	if (racImports.length === 0) {
		// Still run the reexport fixup — it's idempotent and cleans up files from a
		// previous codemod pass that left broken `export { FooPrimitives.Bar }`.
		const fixed = fixBrokenReexports(src);
		if (fixed !== src) {
			writeFileSync(filePath, fixed);
			return true;
		}
		return false;
	}

	// Collect unique entries (dedupe by alias since alias is the local binding).
	const allEntries: ImportEntry[] = [];
	const aliasSeen = new Set<string>();
	for (const imp of racImports) {
		for (const e of imp.entries) {
			if (aliasSeen.has(e.alias)) continue;
			aliasSeen.add(e.alias);
			allEntries.push(e);
		}
	}
	if (allEntries.length === 0) return false;

	// Solve cover over unique symbol names.
	const uniqueNames = [...new Set(allEntries.map((e) => e.name))];
	const cover = solveCover(uniqueNames);

	const unresolved: ImportEntry[] = [];

	// Group: key = subpath. For namespace imports, we only need subpath. For util (named),
	// we need a list of (name, isType, asAlias).
	type NsGroup = { kind: "ns"; subpath: string };
	type NamedGroup = { kind: "named"; subpath: string; items: { name: string; isType: boolean }[] };
	const groups = new Map<string, NsGroup | NamedGroup>();

	for (const e of allEntries) {
		const sub = cover.get(e.name);
		if (!sub) {
			unresolved.push(e);
			continue;
		}
		if (isUtilSubpath(sub)) {
			const key = `named:${sub}`;
			const g = (groups.get(key) as NamedGroup | undefined) ?? {
				kind: "named" as const,
				subpath: sub,
				items: [],
			};
			if (!g.items.some((i) => i.name === e.name)) g.items.push({ name: e.name, isType: e.isType });
			groups.set(key, g);
		} else {
			const key = `ns:${sub}`;
			if (!groups.has(key)) groups.set(key, { kind: "ns", subpath: sub });
		}
	}

	// Build the new import text.
	const sorted = [...groups.values()].sort((a, b) => a.subpath.localeCompare(b.subpath));
	const importLines: string[] = [];
	for (const g of sorted) {
		if (g.kind === "ns") {
			importLines.push(`import * as ${g.subpath}Primitives from "react-aria-components/${g.subpath}";`);
		} else {
			const allType = g.items.every((i) => i.isType);
			const specifiers = g.items.map((i) => (!allType && i.isType ? `type ${i.name}` : i.name)).join(", ");
			importLines.push(
				`import ${allType ? "type " : ""}{ ${specifiers} } from "react-aria-components/${g.subpath}";`,
			);
		}
	}
	if (unresolved.length > 0) {
		const specifiers = unresolved.map((e) => (e.isType ? `type ${e.name}` : e.name)).join(", ");
		importLines.push(`import { ${specifiers} } from "react-aria-components";`);
	}

	// Replace original import ranges. Keep first position, blank the others.
	const sortedImports = [...racImports].sort((a, b) => a.start - b.start);
	let newSrc = "";
	let cursor = 0;
	for (let i = 0; i < sortedImports.length; i++) {
		const imp = sortedImports[i];
		newSrc += src.slice(cursor, imp.start);
		if (i === 0) newSrc += importLines.join("\n");
		cursor = imp.end;
	}
	newSrc += src.slice(cursor);

	// Now rewrite identifier references (alias → `SubPrimitives.Name` or just `Name`).
	// We must avoid replacing inside strings/comments, so we do a \b-anchored regex pass
	// but skip regions that look like string literals or comments.
	const replacements = new Map<string, string>();
	for (const e of allEntries) {
		const sub = cover.get(e.name);
		if (!sub) {
			// Unresolved: if alias differs from name, we still need to rename alias→name in unresolved imports.
			if (e.alias !== e.name) replacements.set(e.alias, e.name);
			continue;
		}
		if (isUtilSubpath(sub)) {
			if (e.alias !== e.name) replacements.set(e.alias, e.name);
		} else {
			replacements.set(e.alias, `${sub}Primitives.${e.name}`);
		}
	}

	if (replacements.size > 0) {
		newSrc = rewriteIdentifiers(newSrc, replacements);
	}

	// Post-process: fix `export { FooPrimitives.Bar }` / `export type { ... }` produced
	// when a rac-imported name was being re-exported. For each such occurrence, hoist to
	// a local alias above the export and strip the namespace prefix from the export clause.
	newSrc = fixBrokenReexports(newSrc);

	if (newSrc !== src) {
		writeFileSync(filePath, newSrc);
		return true;
	}
	return false;
}

/** Rewrite `export (type)? { ..., NsPrimitives.Name, ... }` to strip the namespace prefix
 *  from the export clause and insert `type Name = NsPrimitives.Name` (or `const` variant)
 *  aliases immediately before the export. */
function fixBrokenReexports(src: string): string {
	const re = /export(\s+type)?\s*\{([^}]*)\}/g;
	let out = "";
	let cursor = 0;
	let m: RegExpExecArray | null;
	while ((m = re.exec(src)) !== null) {
		const isType = !!m[1];
		const body = m[2];
		const specifiers = body.split(",").map((s) => s.trim()).filter(Boolean);

		const aliases: string[] = [];
		const newSpecifiers: string[] = [];
		let changed = false;
		for (const spec of specifiers) {
			const nsMatch = spec.match(/^([A-Za-z_$][\w$]*)Primitives\.([A-Za-z_$][\w$]*)$/);
			if (nsMatch) {
				changed = true;
				const [, ns, name] = nsMatch;
				const kw = isType ? "type" : "const";
				const op = isType ? "=" : "=";
				aliases.push(`${kw} ${name} ${op} ${ns}Primitives.${name};`);
				newSpecifiers.push(name);
			} else {
				newSpecifiers.push(spec);
			}
		}

		if (!changed) continue;

		out += src.slice(cursor, m.index);
		out += aliases.join("\n") + "\n";
		out += `export${isType ? " type" : ""} { ${newSpecifiers.join(", ")} }`;
		// Preserve an optional trailing semicolon if present (re.exec match doesn't capture it).
		cursor = m.index + m[0].length;
	}
	out += src.slice(cursor);
	return out;
}

/** Replace whole-word occurrences of each key, but only outside string literals and comments. */
function rewriteIdentifiers(src: string, map: Map<string, string>): string {
	// Build one big alternation regex for all keys (whole-word).
	const keys = [...map.keys()].sort((a, b) => b.length - a.length); // longest first
	if (keys.length === 0) return src;
	const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const wordRe = new RegExp(`\\b(?:${escaped.join("|")})\\b`, "g");

	// We walk the source and skip strings/template-literals/comments.
	let out = "";
	let i = 0;
	const n = src.length;
	while (i < n) {
		const c = src[i];
		const c2 = src[i + 1];
		// Line comment
		if (c === "/" && c2 === "/") {
			const end = src.indexOf("\n", i);
			const stop = end === -1 ? n : end;
			out += src.slice(i, stop);
			i = stop;
			continue;
		}
		// Block comment
		if (c === "/" && c2 === "*") {
			const end = src.indexOf("*/", i + 2);
			const stop = end === -1 ? n : end + 2;
			out += src.slice(i, stop);
			i = stop;
			continue;
		}
		// String literal (", ', `)
		if (c === '"' || c === "'") {
			const end = scanStringLiteral(src, i, c);
			out += src.slice(i, end);
			i = end;
			continue;
		}
		if (c === "`") {
			const end = scanTemplateLiteral(src, i);
			out += src.slice(i, end);
			i = end;
			continue;
		}
		// JSX text: could contain identifiers, but those aren't references. Skip? Actually
		// JSX tag names like <AriaMenu> ARE references, so we need to handle them. Simplest:
		// run the regex on the code region. We'll include JSX text; false positives are unlikely
		// because JSX text rarely contains bare identifier words that match an import.
		// Find next safe region end.
		const nextSafe = nextSyntaxDelimiter(src, i);
		const chunk = src.slice(i, nextSafe);
		out += chunk.replace(wordRe, (match) => map.get(match) ?? match);
		i = nextSafe;
	}
	return out;
}

function scanStringLiteral(src: string, start: number, quote: string): number {
	let i = start + 1;
	while (i < src.length) {
		const c = src[i];
		if (c === "\\") {
			i += 2;
			continue;
		}
		if (c === quote) return i + 1;
		if (c === "\n") return i; // unterminated, best-effort
		i++;
	}
	return src.length;
}

function scanTemplateLiteral(src: string, start: number): number {
	let i = start + 1;
	let depth = 0;
	while (i < src.length) {
		const c = src[i];
		if (c === "\\") {
			i += 2;
			continue;
		}
		if (depth === 0 && c === "`") return i + 1;
		if (c === "$" && src[i + 1] === "{") {
			depth++;
			i += 2;
			continue;
		}
		if (depth > 0 && c === "}") {
			depth--;
			i++;
			continue;
		}
		i++;
	}
	return src.length;
}

function nextSyntaxDelimiter(src: string, from: number): number {
	// Find the next occurrence of //, /*, ", ', ` — stop before it.
	let i = from;
	while (i < src.length) {
		const c = src[i];
		const c2 = src[i + 1];
		if (c === "/" && (c2 === "/" || c2 === "*")) return i;
		if (c === '"' || c === "'" || c === "`") return i;
		i++;
	}
	return src.length;
}

// ---------- Main ----------
const files = await globby(["src/**/*.ts", "src/**/*.tsx"], { cwd: WWW, absolute: true });
let modified = 0;
const changed: string[] = [];
for (const f of files) {
	try {
		if (processFile(f)) {
			modified++;
			changed.push(path.relative(WWW, f));
		}
	} catch (e) {
		console.error(`[error] ${path.relative(WWW, f)}:`, (e as Error).message);
	}
}
console.log(`\nModified ${modified} files.`);
for (const c of changed) console.log(`  ${c}`);
