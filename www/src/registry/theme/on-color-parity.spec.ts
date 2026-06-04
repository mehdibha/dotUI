import autoContrastPlugin from "tailwindcss-autocontrast";
import { describe, expect, it } from "vitest";

import { onBlackWhite, wcag2 } from "@dotui/colors";

import { DEFAULT_COLOR_CONFIG } from "./color-config";
import { emitPrimitivesCss, resolveColorConfig } from "./primitives";

// The plugin exposes its compile-time foreground pick for parity testing (absent from its plugin type).
type PluginWithPick = { getContrastColor: (value: string) => "black" | "white" };
const { getContrastColor } = autoContrastPlugin as unknown as PluginWithPick;

const resolved = resolveColorConfig(DEFAULT_COLOR_CONFIG);
const allRampValues = [...Object.values(resolved.light), ...Object.values(resolved.dark)].flatMap((ramp) =>
	Object.values(ramp),
);

describe("onBlackWhite (preview --on-* foreground pick)", () => {
	it("picks black on light backgrounds and white on dark", () => {
		expect(onBlackWhite("#ffffff")).toBe("black");
		expect(onBlackWhite("#000000")).toBe("white");
		expect(onBlackWhite("oklch(0.985 0 0)")).toBe("black");
		expect(onBlackWhite("oklch(0.13 0 0)")).toBe("white");
	});

	it("every step's on-* clears WCAG AA against its own background (the pure-pole minimum is ~4.58)", () => {
		for (const value of allRampValues) {
			expect(wcag2(onBlackWhite(value), value)).toBeGreaterThanOrEqual(4.5);
		}
	});

	it("matches tailwindcss-autocontrast's getContrastColor for every generated step (preview == shipped)", () => {
		expect(allRampValues.length).toBeGreaterThan(60);
		for (const value of allRampValues) {
			expect(onBlackWhite(value)).toBe(getContrastColor(value));
		}
	});
});

describe("emitPrimitivesCss — on-* emission", () => {
	it("omits --on-* by default (base/colors.css stays ramps-only; the plugin derives them)", () => {
		expect(emitPrimitivesCss(resolved)).not.toContain("--on-accent-500");
	});

	it("emits black/white --on-<palette>-<step> for :root and .dark when onColors is set", () => {
		const css = emitPrimitivesCss(resolved, { onColors: true });
		expect(css).toMatch(/--on-accent-500:\s*(black|white);/);
		expect(css).toMatch(/--on-neutral-950:\s*(black|white);/);
		// one --on-* per ramp step, per mode (light + dark)
		const count = (css.match(/--on-[a-z]+-\d+:/g) ?? []).length;
		expect(count).toBe(allRampValues.length);
	});
});
