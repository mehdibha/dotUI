/**
 * Render the semantic color vocabulary to CSS.
 *
 * Produces the Tailwind v4 `@theme` block that today lives, hand-authored, in
 * `base/theme.css`. Parsing the output through the publisher's
 * `cssToRegistryFields` must yield the same `cssVars.theme` entries — see
 * `emit-css.spec.ts`.
 */

import type { ModeName, SemanticTarget, SemanticToken, SemanticVocabulary } from "./types";

/** Resolve a single {@link SemanticTarget} to its CSS value string. */
export function resolveTarget(target: SemanticTarget): string {
	if ("ref" in target) return `var(--${target.ref})`;
	if ("onOf" in target) return `var(--on-${target.onOf})`;
	if ("value" in target) return target.value;
	const { space, stops } = target.mix;
	const [a, weight, b] = stops;
	return `color-mix(in ${space}, ${resolveTarget(a)} ${weight}%, ${resolveTarget(b)})`;
}

function isPerMode(target: SemanticToken["target"]): target is Record<ModeName, SemanticTarget> {
	return !("ref" in target || "onOf" in target || "value" in target || "mix" in target);
}

/** Pick the mode-agnostic target, or the `light` (else first) target of a per-mode map. */
function baseTarget(target: SemanticToken["target"]): SemanticTarget {
	if (!isPerMode(target)) return target;
	return target.light ?? (Object.values(target)[0] as SemanticTarget);
}

export interface EmitCssOptions {
	/** Indentation unit (default one tab, matching the repo). */
	indent?: string;
	/**
	 * Wrapping selector for the block (default Tailwind's `@theme`). Pass a concrete selector
	 * (e.g. `[data-dotui-scope="x"]`) to re-declare the semantic layer on a subtree — the
	 * authoritative way to scope `--color-*` (its `color-mix` foregrounds can't be reliably
	 * read back from CSSOM). See `DesignSystemProvider`'s `scoped` mode.
	 */
	selector?: string;
}

/**
 * Emit `vocab` as a single mode-agnostic declaration block (Tailwind's `@theme` by default).
 *
 * Per-mode targets emit their base (`light`) value here; routing per-mode values
 * into `:root` / `.dark` blocks lands with the resolver (a later phase).
 */
export function emitCss(vocab: SemanticVocabulary, options: EmitCssOptions = {}): string {
	const indent = options.indent ?? "\t";
	const selector = options.selector ?? "@theme";
	const lines: string[] = [`${selector} {`];
	for (const [name, token] of Object.entries(vocab)) {
		lines.push(`${indent}--${name}: ${resolveTarget(baseTarget(token.target))};`);
	}
	lines.push("}");
	return `${lines.join("\n")}\n`;
}
