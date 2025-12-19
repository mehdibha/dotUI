import { describe, expect, it } from "vitest";

import { createContrastTheme } from "./theme";

describe("createContrastTheme", () => {
	it("creates theme with minimal config", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
			},
		});

		expect(theme.light).toBeDefined();
		expect(theme.dark).toBeDefined();
		expect(theme.light!.scales.primary).toBeDefined();
		expect(theme.light!.scales.neutral).toBeDefined();
		expect(Object.keys(theme.light!.scales.primary!)).toHaveLength(11);
	});

	it("creates theme with semantic colors", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
				success: true,
				danger: "#ef4444",
			},
		});

		expect(theme.light!.scales.success).toBeDefined();
		expect(theme.light!.scales.danger).toBeDefined();
	});

	it("creates theme with custom neutral", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
				neutral: "#64748b",
			},
		});

		expect(theme.light!.scales.neutral).toBeDefined();
	});

	it("creates theme with custom lightness", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
			},
			modes: {
				light: { lightness: 95 },
				dark: { lightness: 8 },
			},
		});

		expect(theme.light).toBeDefined();
		expect(theme.dark).toBeDefined();
	});

	it("creates theme with per-mode palette override", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
			},
			modes: {
				light: true,
				dark: {
					lightness: 5,
					palettes: {
						primary: { color: "#4f46e5" },
					},
				},
			},
		});

		expect(theme.light!.scales.primary).toBeDefined();
		expect(theme.dark!.scales.primary).toBeDefined();
	});

	it("creates theme with custom ratios", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
			},
			ratios: [1.1, 1.2, 1.4, 1.6, 2.2, 3.2, 4.8, 6.5, 8.5, 12.5, 16],
		});

		expect(theme.light!.scales.primary).toBeDefined();
	});

	it("creates theme with wcag3 formula", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
			},
			formula: "wcag3",
		});

		expect(theme.light!.scales.primary).toBeDefined();
	});

	it("generates 11-step scale (50-950)", () => {
		const theme = createContrastTheme({
			palettes: {
				primary: "#6366f1",
			},
		});

		const scale = theme.light!.scales.primary!;
		expect(scale["50"]).toBeDefined();
		expect(scale["100"]).toBeDefined();
		expect(scale["200"]).toBeDefined();
		expect(scale["300"]).toBeDefined();
		expect(scale["400"]).toBeDefined();
		expect(scale["500"]).toBeDefined();
		expect(scale["600"]).toBeDefined();
		expect(scale["700"]).toBeDefined();
		expect(scale["800"]).toBeDefined();
		expect(scale["900"]).toBeDefined();
		expect(scale["950"]).toBeDefined();
	});
});
