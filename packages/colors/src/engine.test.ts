import { describe, expect, it } from "vitest";

import { getProducer, type ModeCtx } from "./producer";
import { registerBuiltins } from "./producers";
import { toOklch, wcag2 } from "./shared/color";
import { allValues, inGamut, isMonotonic, rampLs, worstOnContrast } from "./test-utils";
import { createTheme } from "./theme";

import type { ColorScale, Theme } from "./shared/types";

registerBuiltins();

// Typed accessors (Theme/ColorScale are Record-indexed → possibly-undefined under strict TS).
const sc = (t: Theme, mode: string, palette: string): ColorScale => t[mode]!.scales[palette]!;
const oc = (t: Theme, mode: string, palette: string): ColorScale => t[mode]!.on[palette]!;
const val = (s: ColorScale, step: string): string => s[step]!;

const GENERATIVE = ["oklch", "contrast", "material", "tailwind"] as const;
const SEEDS = ["#3b82f6", "#e11d48", "#eab308", "#22c55e", "#8b5cf6"];

const lightCtx = (steps: string[]): ModeCtx => ({
	name: "light",
	isDark: false,
	steps,
	background: "oklch(0.98 0.002 260)",
});
const darkCtx = (steps: string[]): ModeCtx => ({
	name: "dark",
	isDark: true,
	steps,
	background: "oklch(0.16 0.01 260)",
});
const S11 = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

describe("createTheme — parameterized sweep", () => {
	for (const algorithm of GENERATIVE) {
		for (const seed of SEEDS) {
			it(`${algorithm} / ${seed}: in-gamut oklch, monotonic L, on-* ≥ 4.5`, () => {
				const theme = createTheme({ algorithm, palettes: { primary: seed, neutral: "#64748b", success: true } });
				expect(Object.keys(theme)).toEqual(["light", "dark"]);
				for (const value of allValues(theme)) {
					expect(value).toMatch(/^oklch\(/);
					expect(value).not.toMatch(/hsl|#/i);
					expect(inGamut(value)).toBe(true);
				}
				for (const mode of Object.values(theme)) {
					for (const scale of Object.values(mode.scales)) expect(isMonotonic(rampLs(scale))).toBe(true);
				}
				expect(worstOnContrast(theme)).toBeGreaterThanOrEqual(4.5);
			});
		}
	}

	it("is deterministic (scale + on) for every generative algorithm", () => {
		for (const algorithm of GENERATIVE) {
			const a = createTheme({ algorithm, palettes: { primary: "#3b82f6" } });
			const b = createTheme({ algorithm, palettes: { primary: "#3b82f6" } });
			expect(a).toEqual(b);
		}
	});

	it("oklch is the recommended default and produces valid scale + on", () => {
		const theme = createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6" } });
		expect(val(sc(theme, "light", "primary"), "500")).toMatch(/^oklch\(/);
		expect(val(oc(theme, "light", "primary"), "500")).toMatch(/^oklch\(/);
	});
});

describe("oklch producer (default) specifics", () => {
	it("cross-hue lightness alignment: same step ≈ same L across seeds (background-independent)", () => {
		const at500 = SEEDS.map(
			(seed) =>
				toOklch(val(sc(createTheme({ algorithm: "oklch", palettes: { primary: seed } }), "light", "primary"), "500")).l,
		);
		// Near-identical (gamut clipping nudges L a touch for high-chroma hues) — vs
		// contrast-target which would spread these by 0.1+. This is the whole point.
		expect(Math.max(...at500) - Math.min(...at500)).toBeLessThan(0.02);
	});

	it("light and dark ramps are identical (mode-agnostic, §4.7a)", () => {
		const theme = createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6" } });
		expect(rampLs(sc(theme, "light", "primary"))).toEqual(rampLs(sc(theme, "dark", "primary")));
	});

	it("chroma rises mid-ramp then tapers", () => {
		const cs = Object.values(
			sc(createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6" } }), "light", "primary"),
		).map((v) => toOklch(v).c);
		expect(cs[5]!).toBeGreaterThan(cs[0]!);
		expect(cs[5]!).toBeGreaterThan(cs[cs.length - 1]!);
	});

	it("neutral palette is near-grey; minChroma floors a muted seed's accent", () => {
		const theme = createTheme({ algorithm: "oklch", palettes: { primary: "#777777" } });
		expect(toOklch(val(sc(theme, "light", "neutral"), "500")).c).toBeLessThan(0.02);
		expect(toOklch(val(sc(theme, "light", "primary"), "500")).c).toBeGreaterThan(0.04);
	});

	it("configurable scale shape: arbitrary step count + naming", () => {
		const steps = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
		const theme = createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6" }, steps });
		expect(Object.keys(sc(theme, "light", "primary"))).toEqual(steps);
	});
});

describe("contrast producer (option) hits targets", () => {
	it("each step hits its target contrast vs the mode background (light + dark)", () => {
		const producer = getProducer("contrast");
		const ratios = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15];
		for (const ctx of [lightCtx(S11), darkCtx(S11)]) {
			const { scale } = producer.produce({ seed: "#3b82f6", ratios }, ctx);
			ratios.forEach((target, i) => expect(wcag2(scale[S11[i]!]!, ctx.background)).toBeCloseTo(target, 1));
		}
	});
});

describe("material producer (registered) emits oklch + on-*", () => {
	it("oklch output, arbitrary N, carries on-*", () => {
		const steps = ["a", "b", "c", "d", "e", "f", "g"];
		const { scale, on } = getProducer("material").produce({ seed: "#6366f1" }, lightCtx(steps));
		expect(Object.keys(scale)).toEqual(steps);
		expect(Object.keys(on)).toEqual(steps);
		for (const v of Object.values(scale)) expect(v).toMatch(/^oklch\(/);
	});
});

describe("fixed producer (identity)", () => {
	it("returns the supplied ramp normalized to in-gamut oklch + on-*", () => {
		const theme = createTheme({
			algorithm: "fixed",
			palettes: { primary: { "50": "#fafafa", "500": "#737373", "950": "#0a0a0a" } },
		});
		const scale = sc(theme, "light", "primary");
		expect(Object.keys(scale)).toEqual(["50", "500", "950"]);
		expect(wcag2(val(scale, "500"), "#737373")).toBeCloseTo(1, 1); // identity
		expect(inGamut(val(scale, "500"))).toBe(true);
		expect(val(oc(theme, "light", "primary"), "500")).toMatch(/^oklch\(/);
	});

	it("gamut-maps an out-of-sRGB input (reduces chroma)", () => {
		const theme = createTheme({ algorithm: "fixed", palettes: { primary: { "500": "oklch(0.7 0.37 140)" } } });
		expect(toOklch(val(sc(theme, "light", "primary"), "500")).c).toBeLessThan(0.3);
	});
});

describe("registry / options menu", () => {
	it("registers every advertised producer; unknown ids fail loudly", () => {
		for (const id of ["oklch", "contrast", "material", "fixed", "tailwind"]) expect(getProducer(id).id).toBe(id);
		expect(() => getProducer("nope")).toThrow(/Unknown color algorithm/);
	});
});

describe("edge seeds", () => {
	for (const seed of ["#ffffff", "#000000", "#808080", "oklch(0.7 0.37 140)"]) {
		it(`${seed}: valid in-gamut, monotonic, no NaN, readable on-*`, () => {
			const theme = createTheme({ algorithm: "oklch", palettes: { primary: seed } });
			for (const v of allValues(theme)) {
				expect(v).not.toMatch(/NaN/);
				expect(inGamut(v)).toBe(true);
			}
			expect(isMonotonic(rampLs(sc(theme, "light", "primary")))).toBe(true);
			expect(worstOnContrast(theme)).toBeGreaterThanOrEqual(4.5);
		});
	}
});

describe("snapshots", () => {
	it("oklch theme value snapshot", () => {
		expect(createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6", neutral: "#64748b" } })).toMatchSnapshot();
	});
	it("material theme value snapshot", () => {
		expect(
			createTheme({ algorithm: "material", palettes: { primary: "#6366f1", neutral: "#64748b" } }),
		).toMatchSnapshot();
	});
});
