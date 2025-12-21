import { describe, expect, it } from "vitest";

import { createTheme } from "./theme";

describe("createTheme", () => {
	describe("material algorithm", () => {
		it("creates theme with minimal config", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
				},
			});

			expect(theme.light).toBeDefined();
			expect(theme.dark).toBeDefined();
			expect(theme.light!.scales.primary).toBeDefined();
			expect(theme.light!.scales.neutral).toBeDefined();
		});

		it("creates theme with all semantic colors", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
					neutral: "#64748b",
					success: true,
					danger: true,
					warning: true,
					info: true,
				},
			});

			expect(theme.light!.scales.primary).toBeDefined();
			expect(theme.light!.scales.neutral).toBeDefined();
			expect(theme.light!.scales.success).toBeDefined();
			expect(theme.light!.scales.danger).toBeDefined();
			expect(theme.light!.scales.warning).toBeDefined();
			expect(theme.light!.scales.info).toBeDefined();
		});

		it("creates theme with custom semantic colors", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
					success: "#10b981",
					danger: "#f43f5e",
				},
			});

			expect(theme.light!.scales.success).toBeDefined();
			expect(theme.light!.scales.danger).toBeDefined();
		});

		it("creates theme with custom modes", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
				},
				modes: {
					light: { isDark: false },
					dark: { isDark: true },
					dim: { isDark: true },
				},
			});

			expect(theme.light).toBeDefined();
			expect(theme.dark).toBeDefined();
			expect(theme.dim).toBeDefined();
		});

		it("creates theme with mode shorthand", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
				},
				modes: {
					light: true,
					dark: true,
				},
			});

			expect(theme.light).toBeDefined();
			expect(theme.dark).toBeDefined();
		});

		it("creates theme with custom palettes", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
					brand: "#f97316",
					accent: "#8b5cf6",
				},
			});

			expect(theme.light!.scales.brand).toBeDefined();
			expect(theme.light!.scales.accent).toBeDefined();
		});

		it("generates correct scale steps", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
				},
			});

			const scale = theme.light!.scales.primary!;
			expect(scale["50"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["100"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["200"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["300"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["400"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["500"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["600"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["700"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["800"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["900"]).toMatch(/^#[0-9a-f]{6}$/i);
			expect(scale["950"]).toMatch(/^#[0-9a-f]{6}$/i);
		});
	});

	describe("contrast algorithm", () => {
		it("creates theme with minimal config", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
				},
			});

			expect(theme.light).toBeDefined();
			expect(theme.dark).toBeDefined();
			expect(theme.light!.scales.primary).toBeDefined();
			expect(theme.light!.scales.neutral).toBeDefined();
		});

		it("creates theme with all semantic colors", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
					neutral: "#64748b",
					success: true,
					danger: true,
					warning: true,
					info: true,
				},
			});

			expect(theme.light!.scales.primary).toBeDefined();
			expect(theme.light!.scales.neutral).toBeDefined();
			expect(theme.light!.scales.success).toBeDefined();
			expect(theme.light!.scales.danger).toBeDefined();
			expect(theme.light!.scales.warning).toBeDefined();
			expect(theme.light!.scales.info).toBeDefined();
		});

		it("creates theme with custom ratios", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
				},
				ratios: [1.1, 1.2, 1.4, 1.6, 2.2, 3.2, 4.8, 6.5, 8.5, 12.5, 16],
			});

			expect(theme.light!.scales.primary).toBeDefined();
		});

		it("creates theme with wcag3 formula", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
				},
				formula: "wcag3",
			});

			expect(theme.light!.scales.primary).toBeDefined();
		});

		it("creates theme with custom saturation", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
				},
				saturation: 80,
			});

			expect(theme.light!.scales.primary).toBeDefined();
		});

		it("creates theme with custom lightness per mode", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
				},
				modes: {
					light: { lightness: 95 },
					dark: { lightness: 8 },
					dim: { lightness: 20 },
				},
			});

			expect(theme.light).toBeDefined();
			expect(theme.dark).toBeDefined();
			expect(theme.dim).toBeDefined();
		});

		it("creates theme with per-mode palette overrides", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
				},
				modes: {
					light: true,
					dark: {
						lightness: 5,
						palettes: {
							primary: { color: "#818cf8" },
						},
					},
				},
			});

			expect(theme.light!.scales.primary).toBeDefined();
			expect(theme.dark!.scales.primary).toBeDefined();
		});

		it("generates correct scale steps", () => {
			const theme = createTheme({
				algorithm: "contrast",
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

	describe("both algorithms produce same structure", () => {
		it("both have same scale keys", () => {
			const materialTheme = createTheme({
				algorithm: "material",
				palettes: { primary: "#6366f1" },
			});

			const contrastTheme = createTheme({
				algorithm: "contrast",
				palettes: { primary: "#6366f1" },
			});

			const materialKeys = Object.keys(materialTheme.light!.scales.primary!).sort();
			const contrastKeys = Object.keys(contrastTheme.light!.scales.primary!).sort();

			expect(materialKeys).toEqual(contrastKeys);
			expect(materialKeys).toEqual(["100", "200", "300", "400", "50", "500", "600", "700", "800", "900", "950"]);
		});

		it("both create same palette names", () => {
			const materialTheme = createTheme({
				algorithm: "material",
				palettes: { primary: "#6366f1", success: true, danger: "#ef4444" },
			});

			const contrastTheme = createTheme({
				algorithm: "contrast",
				palettes: { primary: "#6366f1", success: true, danger: "#ef4444" },
			});

			const materialPalettes = Object.keys(materialTheme.light!.scales).sort();
			const contrastPalettes = Object.keys(contrastTheme.light!.scales).sort();

			expect(materialPalettes).toEqual(contrastPalettes);
		});

		it("both create same mode names", () => {
			const materialTheme = createTheme({
				algorithm: "material",
				palettes: { primary: "#6366f1" },
				modes: { light: true, dark: true },
			});

			const contrastTheme = createTheme({
				algorithm: "contrast",
				palettes: { primary: "#6366f1" },
				modes: { light: true, dark: true },
			});

			const materialModes = Object.keys(materialTheme).sort();
			const contrastModes = Object.keys(contrastTheme).sort();

			expect(materialModes).toEqual(contrastModes);
			expect(materialModes).toEqual(["dark", "light"]);
		});
	});

	describe("real-world configurations", () => {
		it("creates a complete design system theme with material", () => {
			const theme = createTheme({
				algorithm: "material",
				palettes: {
					primary: "#6366f1",
					neutral: "#64748b",
					success: "#22c55e",
					danger: "#ef4444",
					warning: "#f59e0b",
					info: "#3b82f6",
				},
				modes: {
					light: { isDark: false },
					dark: { isDark: true },
				},
			});

			// Verify all palettes exist in both modes
			for (const mode of ["light", "dark"]) {
				expect(theme[mode]).toBeDefined();
				for (const palette of ["primary", "neutral", "success", "danger", "warning", "info"]) {
					expect(theme[mode]!.scales[palette]).toBeDefined();
					expect(Object.keys(theme[mode]!.scales[palette]!)).toHaveLength(11);
				}
			}
		});

		it("creates a complete design system theme with contrast", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
					neutral: "#64748b",
					success: "#22c55e",
					danger: "#ef4444",
					warning: "#f59e0b",
					info: "#3b82f6",
				},
				modes: {
					light: { lightness: 97 },
					dark: { lightness: 5 },
				},
				formula: "wcag2",
			});

			// Verify all palettes exist in both modes
			for (const mode of ["light", "dark"]) {
				expect(theme[mode]).toBeDefined();
				for (const palette of ["primary", "neutral", "success", "danger", "warning", "info"]) {
					expect(theme[mode]!.scales[palette]).toBeDefined();
					expect(Object.keys(theme[mode]!.scales[palette]!)).toHaveLength(11);
				}
			}
		});

		it("creates multi-mode theme for different contexts", () => {
			const theme = createTheme({
				algorithm: "contrast",
				palettes: {
					primary: "#6366f1",
					success: true,
				},
				modes: {
					light: { lightness: 97 },
					dark: { lightness: 5 },
					dim: { lightness: 15 },
					highContrast: { lightness: 100 },
				},
			});

			expect(Object.keys(theme)).toHaveLength(4);
			expect(theme.light).toBeDefined();
			expect(theme.dark).toBeDefined();
			expect(theme.dim).toBeDefined();
			expect(theme.highContrast).toBeDefined();
		});
	});
});
