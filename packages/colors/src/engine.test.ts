import { describe, expect, it } from "vitest";

import "./producers"; // register built-in producers
import { defaultRatios } from "./contrast/solver";
import { createContrastTheme } from "./contrast/theme";
import { getProducer, type ModeCtx } from "./producer";
import { apca, toOklch, wcag2 } from "./shared/color";
import { createTheme } from "./theme";

const STEPS_11 = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const STEPS_12 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const DEFAULT_RATIOS = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15];
const SEEDS = ["#3b82f6", "#e11d48", "#eab308", "#22c55e", "#8b5cf6"];

const lightCtx = (steps: string[] = STEPS_11): ModeCtx => ({
	name: "light",
	isDark: false,
	steps,
	background: "oklch(0.98 0.002 260)",
});
const darkCtx = (steps: string[] = STEPS_11): ModeCtx => ({
	name: "dark",
	isDark: true,
	steps,
	background: "oklch(0.16 0.01 260)",
});

describe("contrast producer (OKLCH contrast-target)", () => {
	const producer = getProducer("contrast");

	it("hits each step's target contrast vs the mode background (light + dark)", () => {
		for (const ctx of [lightCtx(), darkCtx()]) {
			const { scale } = producer.produce({ seed: "#3b82f6", ratios: DEFAULT_RATIOS }, ctx);
			DEFAULT_RATIOS.forEach((target, i) => {
				expect(wcag2(scale[STEPS_11[i]!]!, ctx.background)).toBeCloseTo(target, 1);
			});
		}
	});

	it("emits oklch() and never hsl()", () => {
		const { scale } = producer.produce({ seed: "#e11d48" }, lightCtx());
		for (const value of Object.values(scale)) {
			expect(value).toMatch(/^oklch\(/);
			expect(value).not.toMatch(/hsl/i);
		}
	});

	it("supports an arbitrary step count + naming (12-step)", () => {
		const { scale, on } = producer.produce({ seed: "#22c55e" }, lightCtx(STEPS_12));
		expect(Object.keys(scale)).toEqual(STEPS_12);
		expect(Object.keys(on)).toEqual(STEPS_12);
	});

	it("every on-* clears WCAG2 AA (4.5) against its own step, across seeds + modes", () => {
		for (const ctx of [lightCtx(), darkCtx()]) {
			for (const seed of SEEDS) {
				const { scale, on } = producer.produce({ seed, ratios: DEFAULT_RATIOS }, ctx);
				for (const step of ctx.steps) {
					expect(wcag2(on[step]!, scale[step]!)).toBeGreaterThanOrEqual(4.5);
				}
			}
		}
	});

	it("is deterministic (same seed → same ramp)", () => {
		const a = producer.produce({ seed: "#3b82f6" }, lightCtx());
		const b = producer.produce({ seed: "#3b82f6" }, lightCtx());
		expect(a.scale).toEqual(b.scale);
	});
});

describe("fixed producer (identity)", () => {
	const producer = getProducer("fixed");

	it("returns the supplied ramp (normalized to oklch) with on-*", () => {
		const input: Record<string, string> = { "50": "#fafafa", "500": "#737373", "950": "#0a0a0a" };
		const ctx: ModeCtx = { name: "light", isDark: false, steps: ["50", "500", "950"], background: "oklch(0.98 0 0)" };
		const { scale, on } = producer.produce({ scale: input }, ctx);
		for (const step of ["50", "500", "950"]) {
			expect(scale[step]).toMatch(/^oklch\(/);
			// identity: output is the same color as the input (contrast vs input ≈ 1)
			expect(wcag2(scale[step]!, input[step]!)).toBeCloseTo(1, 1);
			expect(on[step]).toMatch(/^oklch\(/);
		}
	});
});

describe("createTheme", () => {
	it("material output is stable (snapshot regression guard)", () => {
		expect(
			createTheme({
				algorithm: "material",
				palettes: { primary: "#6366f1", neutral: "#64748b", success: true, danger: true, warning: true, info: true },
			}),
		).toMatchSnapshot();
	});

	it("contrast theme carries on-* per palette", () => {
		const theme = createTheme({ algorithm: "contrast", palettes: { primary: "#3b82f6", success: true } });
		expect(theme.light!.on?.primary).toBeDefined();
		expect(theme.light!.on?.success).toBeDefined();
		expect(Object.keys(theme.light!.on!.primary!)).toHaveLength(11);
	});
});

describe("configurable scale shape", () => {
	const producer = getProducer("contrast");

	it("resamples default targets across arbitrary N (5 and 12 steps)", () => {
		for (const n of [5, 12]) {
			const steps = Array.from({ length: n }, (_, i) => String(i + 1));
			const targets = defaultRatios(n);
			const { scale } = producer.produce({ seed: "#3b82f6" }, lightCtx(steps));
			steps.forEach((step, i) => {
				expect(wcag2(scale[step]!, "oklch(0.98 0.002 260)")).toBeCloseTo(targets[i]!, 1);
			});
		}
	});

	it("createContrastTheme step count follows the global ratios length (not silently dropped)", () => {
		const theme = createContrastTheme({ palettes: { primary: "#3b82f6" }, ratios: [1.2, 2, 4.5, 8, 14] });
		expect(Object.keys(theme.light!.scales.primary!)).toEqual(["1", "2", "3", "4", "5"]);
		expect(Object.keys(theme.light!.on!.primary!)).toHaveLength(5);
	});
});

describe("APCA (wcag3) formula", () => {
	const producer = getProducer("contrast");

	it("produces a healthy, non-collapsed ramp in light + dark", () => {
		for (const ctx of [lightCtx(), darkCtx()]) {
			const { scale } = producer.produce({ seed: "#3b82f6", formula: "apca" }, ctx);
			const ls = STEPS_11.map((s) => toOklch(scale[s]!).l);
			const span = Math.max(...ls) - Math.min(...ls);
			const distinct = new Set(ls.map((l) => l.toFixed(3))).size;
			expect(span).toBeGreaterThan(0.5);
			expect(distinct).toBeGreaterThanOrEqual(10);
			expect(apca(scale["950"]!, ctx.background)).toBeGreaterThan(apca(scale["50"]!, ctx.background));
		}
	});
});

describe("fixed producer gamut + on-*", () => {
	const producer = getProducer("fixed");

	it("gamut-maps a wide-gamut input (reduces chroma) and keeps on-* readable", () => {
		const ctx: ModeCtx = { name: "light", isDark: false, steps: ["500"], background: "oklch(0.98 0 0)" };
		const { scale, on } = producer.produce({ scale: { "500": "oklch(0.7 0.37 140)" } }, ctx);
		expect(toOklch(scale["500"]!).c).toBeLessThan(0.3); // reduced from 0.37 toward sRGB
		expect(wcag2(on["500"]!, scale["500"]!)).toBeGreaterThanOrEqual(4.5);
	});

	it("on-* clears WCAG2 AA across both modes", () => {
		const input: Record<string, string> = { "50": "#fafafa", "500": "#737373", "900": "#171717" };
		for (const ctx of [
			{ name: "light", isDark: false, steps: ["50", "500", "900"], background: "oklch(0.98 0 0)" } as ModeCtx,
			{ name: "dark", isDark: true, steps: ["50", "500", "900"], background: "oklch(0.16 0 0)" } as ModeCtx,
		]) {
			const { scale, on } = producer.produce({ scale: input }, ctx);
			for (const step of ctx.steps) expect(wcag2(on[step]!, scale[step]!)).toBeGreaterThanOrEqual(4.5);
		}
	});
});

describe("contrast theme value snapshot", () => {
	it("pins oklch ramps + on-* for a small theme", () => {
		expect(
			createTheme({ algorithm: "contrast", palettes: { primary: "#3b82f6", neutral: "#64748b" } }),
		).toMatchSnapshot();
	});
});
