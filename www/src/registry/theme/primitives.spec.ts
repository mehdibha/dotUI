import { describe, expect, it } from "vitest";

import { DEFAULT_COLOR_CONFIG } from "./color-config";
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
