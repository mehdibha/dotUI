/**
 * Resolve a {@link ColorConfig} into per-mode primitive ramps and emit them as
 * `base/colors.css`.
 *
 * The `@dotui/colors` kernel generates one perceptual, background-independent
 * ramp per palette (mode-agnostic). dotUI keeps today's structure — per-mode
 * primitives in `:root` / `.dark`, mode-agnostic semantic tokens — so dark mode
 * is derived by **reversing the lightness ladder** of each ramp (`50` ↔ `950`).
 * This keeps direct primitive utilities (`bg-neutral-300`) mode-correct, which a
 * single shared ramp would not. The `--on-*` foregrounds are still produced by
 * the `tailwindcss-autocontrast` plugin at Tailwind-compile.
 */

import { createTheme, type CreateThemeOptions } from "@dotui/colors";

import type { ColorConfig } from "./color-config";

export type Ramp = Record<string, string>;

export interface ResolvedPalettes {
	steps: string[];
	light: Record<string, Ramp>;
	dark: Record<string, Ramp>;
}

/** Emission order (mirrors the legacy colors.css); unknown palettes follow, sorted. */
const KNOWN_ORDER = ["neutral", "accent", "success", "warning", "danger", "info"];

/** Reverse a ramp's value ladder: step `50` takes `950`'s value, etc. (dark mode). */
function reverseRamp(scale: Ramp): Ramp {
	const steps = Object.keys(scale);
	const reversed = Object.values(scale).reverse();
	const out: Ramp = {};
	steps.forEach((step, index) => {
		const value = reversed[index];
		if (value !== undefined) out[step] = value;
	});
	return out;
}

export function resolveColorConfig(config: ColorConfig): ResolvedPalettes {
	const { seeds, algorithm, steps } = config;

	// The kernel requires a `primary` palette (the brand); dotUI names it `accent`.
	const palettes: Record<string, string> = { primary: seeds.accent, neutral: seeds.neutral };
	for (const name of ["success", "warning", "danger", "info"] as const) {
		const seed = seeds[name];
		if (seed) palettes[name] = seed;
	}

	// algorithm is a runtime-validated discriminant the kernel's zod schema checks.
	const theme = createTheme({ algorithm, palettes, steps, modes: { light: true } } as unknown as CreateThemeOptions);

	const lightMode = theme.light;
	if (!lightMode) throw new Error("resolveColorConfig: kernel produced no `light` mode");

	// Rename the kernel's `primary` ramp back to dotUI's `accent`.
	const light: Record<string, Ramp> = {};
	for (const [name, scale] of Object.entries(lightMode.scales)) {
		light[name === "primary" ? "accent" : name] = scale;
	}

	const dark: Record<string, Ramp> = {};
	for (const [name, scale] of Object.entries(light)) dark[name] = reverseRamp(scale);

	return { steps: Object.keys(light.neutral ?? {}), light, dark };
}

function orderedNames(palettes: Record<string, Ramp>): string[] {
	const known = KNOWN_ORDER.filter((name) => name in palettes);
	const extra = Object.keys(palettes)
		.filter((name) => !KNOWN_ORDER.includes(name))
		.sort();
	return [...known, ...extra];
}

function emitBlock(out: string[], palettes: Record<string, Ramp>, names: string[]): void {
	names.forEach((name, index) => {
		const ramp = palettes[name];
		if (!ramp) return;
		for (const [step, value] of Object.entries(ramp)) {
			out.push(`\t--${name}-${step}: ${value};`);
		}
		if (index < names.length - 1) out.push("");
	});
}

/** Render resolved ramps as the `base/colors.css` content (`:root` light + `.dark` reversed). */
export function emitPrimitivesCss(resolved: ResolvedPalettes): string {
	const names = orderedNames(resolved.light);
	const out: string[] = [
		"/* AUTO-GENERATED — do not edit. Run `pnpm build:registry`. */",
		"/* Primitive ramps generated from DEFAULT_COLOR_CONFIG (see @/registry/theme). */",
		"",
		":root {",
		"\t--radius-factor: 1;",
		"",
	];
	emitBlock(out, resolved.light, names);
	out.push("}", "", ".dark {");
	emitBlock(out, resolved.dark, names);
	out.push("}");
	return `${out.join("\n")}\n`;
}
