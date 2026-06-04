/**
 * Single source of truth for scalar-param token options.
 *
 * Two consumers:
 *   1. The create-page customizer's picker UI (`components-config.tsx`).
 *      Uses `{ label, value }` to render dropdowns / sliders.
 *   2. The publish pipeline's class rewriter (`resolve-classes.ts`).
 *      Uses `{ value → suffix }` to rewrite e.g.
 *      `rounded-(--alert-radius)` → `rounded-md` when the preset binds
 *      `alert.radius = "--radius-md"`.
 *
 * Token types covered by static option pools: radius, blur, opacity, shadow, cursor.
 *
 * Not in this table:
 *   - `spacing`  — driven by a slider over `calc(var(--spacing) * N)`; the
 *                  publisher emits Tailwind arbitrary values.
 *   - `color`    — derived from `DEFAULT_SEMANTICS` (registry/theme); CSS vars are kept in the
 *                  base item rather than rewritten inline.
 *   - `font-size` — no scalar params use it yet.
 */

import type { TokenType } from "@/registry/types";

export interface TokenOption {
	/** Human-readable label for the picker. */
	label: string;
	/** Preset value. Either a CSS var reference (`--radius-md`) or a literal (`0`, `none`). */
	value: string;
	/**
	 * Tailwind utility suffix when this value is picked.
	 * Example: `--radius-md` → `md` so `rounded-(--btn-radius)` becomes `rounded-md`.
	 */
	suffix: string;
}

export const RADIUS_OPTIONS: readonly TokenOption[] = [
	{ label: "none", value: "0", suffix: "none" },
	{ label: "sm", value: "--radius-sm", suffix: "sm" },
	{ label: "md", value: "--radius-md", suffix: "md" },
	{ label: "lg", value: "--radius-lg", suffix: "lg" },
	{ label: "xl", value: "--radius-xl", suffix: "xl" },
	{ label: "2xl", value: "--radius-2xl", suffix: "2xl" },
	{ label: "full", value: "--radius-full", suffix: "full" },
];

export const BLUR_OPTIONS: readonly TokenOption[] = [
	{ label: "None", value: "0px", suffix: "none" },
	{ label: "Extra Small", value: "--blur-xs", suffix: "xs" },
	{ label: "Small", value: "--blur-sm", suffix: "sm" },
	{ label: "Medium", value: "--blur-md", suffix: "md" },
	{ label: "Large", value: "--blur-lg", suffix: "lg" },
	{ label: "Extra Large", value: "--blur-xl", suffix: "xl" },
];

export const OPACITY_OPTIONS: readonly TokenOption[] = [
	{ label: "20%", value: "20%", suffix: "20" },
	{ label: "40%", value: "40%", suffix: "40" },
	{ label: "60%", value: "60%", suffix: "60" },
	{ label: "80%", value: "80%", suffix: "80" },
];

export const SHADOW_OPTIONS: readonly TokenOption[] = [
	{ label: "None", value: "none", suffix: "none" },
	{ label: "Extra Small", value: "--shadow-xs", suffix: "xs" },
	{ label: "Small", value: "--shadow-sm", suffix: "sm" },
	{ label: "Medium", value: "--shadow-md", suffix: "md" },
	{ label: "Large", value: "--shadow-lg", suffix: "lg" },
	{ label: "Extra Large", value: "--shadow-xl", suffix: "xl" },
	{ label: "2XL", value: "--shadow-2xl", suffix: "2xl" },
	{ label: "Shine", value: "--shadow-shine", suffix: "shine" },
];

export const CURSOR_OPTIONS: readonly TokenOption[] = [
	{ label: "Interactive", value: "--cursor-interactive", suffix: "interactive" },
	{ label: "Disabled", value: "--cursor-disabled", suffix: "disabled" },
	{ label: "Default", value: "default", suffix: "default" },
	{ label: "Pointer", value: "pointer", suffix: "pointer" },
	{ label: "Grab", value: "grab", suffix: "grab" },
	{ label: "Grabbing", value: "grabbing", suffix: "grabbing" },
	{ label: "Not allowed", value: "not-allowed", suffix: "not-allowed" },
	{ label: "Wait", value: "wait", suffix: "wait" },
	{ label: "Help", value: "help", suffix: "help" },
	{ label: "Crosshair", value: "crosshair", suffix: "crosshair" },
	{ label: "Text", value: "text", suffix: "text" },
	{ label: "Move", value: "move", suffix: "move" },
	{ label: "Progress", value: "progress", suffix: "progress" },
];

const STATIC_OPTIONS_BY_TYPE = {
	radius: RADIUS_OPTIONS,
	blur: BLUR_OPTIONS,
	opacity: OPACITY_OPTIONS,
	shadow: SHADOW_OPTIONS,
	cursor: CURSOR_OPTIONS,
} satisfies Partial<Record<TokenType, readonly TokenOption[]>>;

export function getStaticTokenOptions(type: TokenType): readonly TokenOption[] | undefined {
	return (STATIC_OPTIONS_BY_TYPE as Record<string, readonly TokenOption[] | undefined>)[type];
}

/**
 * Map a preset value to its Tailwind utility suffix. Returns `undefined` for
 * values outside the static pool (custom spacing, color vars, etc.) — callers
 * decide whether to fall back to arbitrary-value syntax or to keep the var ref.
 */
export function tokenValueToSuffix(type: TokenType, value: string): string | undefined {
	const options = getStaticTokenOptions(type);
	return options?.find((opt) => opt.value === value)?.suffix;
}
