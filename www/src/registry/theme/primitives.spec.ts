import { describe, expect, it } from "vitest";

import { toOklch } from "@dotui/colors";

import { DEFAULT_COLOR_CONFIG, type ColorConfig } from "./color-config";
import { emitPrimitivesCss, resolveColorConfig } from "./primitives";

describe("resolveColorConfig", () => {
	const resolved = resolveColorConfig(DEFAULT_COLOR_CONFIG);

	it("produces neutral/accent/status palettes (the kernel's `primary` renamed to `accent`)", () => {
		expect(Object.keys(resolved.light).sort()).toEqual(["accent", "danger", "info", "neutral", "success", "warning"]);
		expect(resolved.light).not.toHaveProperty("primary");
		expect(resolved.dark).not.toHaveProperty("primary");
	});

	it("emits 11 oklch() steps per ramp", () => {
		expect(resolved.steps).toHaveLength(11);
		for (const ramp of Object.values(resolved.light)) {
			expect(Object.keys(ramp)).toHaveLength(11);
			for (const value of Object.values(ramp)) expect(value).toMatch(/^oklch\(/);
		}
	});

	it("derives dark by reversing the lightness ladder (50 ↔ 950, midpoint fixed)", () => {
		const { steps, light, dark } = resolved;
		const first = steps.at(0);
		const last = steps.at(-1);
		const mid = steps.at(Math.floor(steps.length / 2));
		expect([first, last, mid].every(Boolean)).toBe(true);
		if (!first || !last || !mid) return;

		expect(dark.neutral?.[first]).toBe(light.neutral?.[last]);
		expect(dark.neutral?.[last]).toBe(light.neutral?.[first]);
		expect(dark.accent?.[mid]).toBe(light.accent?.[mid]);
	});

	it("keeps the neutral ramp achromatic (chroma 0)", () => {
		for (const value of Object.values(resolved.light.neutral ?? {})) {
			expect(value).toMatch(/^oklch\([\d.]+ 0 0\)$/);
		}
	});

	it("is deterministic", () => {
		expect(resolveColorConfig(DEFAULT_COLOR_CONFIG)).toEqual(resolved);
	});

	it("rejects a non-generative algorithm with a clear error (seeds are not ramps)", () => {
		const bad = { algorithm: "fixed", seeds: DEFAULT_COLOR_CONFIG.seeds } as unknown as ColorConfig;
		expect(() => resolveColorConfig(bad)).toThrow(/generative/);
	});

	it("forwards per-producer knobs to the kernel (hueTorsion shifts hue, chromaMult scales chroma)", () => {
		const seeds = DEFAULT_COLOR_CONFIG.seeds;
		const accentAt = (config: ColorConfig, step: string) => {
			const value = resolveColorConfig(config).light.accent?.[step];
			expect(value).toBeDefined();
			return toOklch(value ?? "oklch(0 0 0)");
		};
		// the blue accent's dark end drifts toward the violet anchor under torsion
		const torsionedHue = accentAt({ algorithm: "oklch", seeds, knobs: { hueTorsion: 40 } }, "950").h;
		expect(torsionedHue).not.toBeCloseTo(accentAt({ algorithm: "oklch", seeds }, "950").h, 0);
		// chromaMult 0 drops accent chroma to the minChroma floor (below the seed-driven default)
		const mutedChroma = accentAt({ algorithm: "oklch", seeds, knobs: { chromaMult: 0 } }, "500").c;
		expect(mutedChroma).toBeLessThan(accentAt({ algorithm: "oklch", seeds }, "500").c);
	});
});

describe("emitPrimitivesCss", () => {
	const css = emitPrimitivesCss(resolveColorConfig(DEFAULT_COLOR_CONFIG));

	it("emits :root + .dark blocks and preserves --radius-factor", () => {
		expect(css).toContain(":root {");
		expect(css).toContain(".dark {");
		expect(css).toContain("--radius-factor: 1;");
	});

	it("emits every palette ramp endpoint", () => {
		for (const palette of ["neutral", "accent", "success", "warning", "danger", "info"]) {
			expect(css).toContain(`--${palette}-50:`);
			expect(css).toContain(`--${palette}-950:`);
		}
	});

	it("carries the AUTO-GENERATED banner", () => {
		expect(css.startsWith("/* AUTO-GENERATED")).toBe(true);
	});
});
