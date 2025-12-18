/**
 * Tests for createTheme API
 */

import { describe, expect, it } from "vitest";

import { createTheme } from "../src";
import type { ColorScale, CreateThemeOptions, Theme } from "../src";

describe("createTheme", () => {
	describe("basic functionality", () => {
		it("should create a theme with minimal options", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
			});

			expect(theme.background).toBeDefined();
			expect(theme.scales.accent).toBeDefined();
			expect(theme.scales.neutral).toBeDefined();
			expect(theme.scales.success).toBeDefined();
			expect(theme.scales.warning).toBeDefined();
			expect(theme.scales.danger).toBeDefined();
		});

		it("should generate all 11 scale steps", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
			});

			const steps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
			for (const step of steps) {
				expect(theme.scales.accent[step as keyof ColorScale]).toBeDefined();
			}
		});

		it("should output HSL format", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
			});

			expect(theme.background).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
			expect(theme.scales.accent["500"]).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
		});
	});

	describe("auto-generation", () => {
		it("should auto-generate neutral from accent", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
			});

			// Neutral should be defined and different from accent
			expect(theme.scales.neutral).toBeDefined();
			expect(theme.scales.neutral["500"]).not.toBe(theme.scales.accent["500"]);
		});

		it("should auto-generate semantic colors", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
			});

			// All semantic scales should be defined
			expect(theme.scales.success["500"]).toBeDefined();
			expect(theme.scales.warning["500"]).toBeDefined();
			expect(theme.scales.danger["500"]).toBeDefined();
		});

		it("should use provided colors instead of auto-generating", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				neutral: "#64748b",
				success: "#22c55e",
				warning: "#f59e0b",
				danger: "#ef4444",
			});

			expect(theme.scales.neutral).toBeDefined();
			expect(theme.scales.success).toBeDefined();
			expect(theme.scales.warning).toBeDefined();
			expect(theme.scales.danger).toBeDefined();
		});
	});

	describe("algorithm selection", () => {
		it("should use contrast algorithm by default", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
			});

			expect(theme.scales.accent).toBeDefined();
		});

		it("should support material algorithm", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				algorithm: "material",
			});

			expect(theme.scales.accent).toBeDefined();
			expect(theme.scales.accent["500"]).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
		});

		it("should produce different results for different algorithms", () => {
			const contrastTheme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				algorithm: "contrast",
			});

			const materialTheme = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				algorithm: "material",
			});

			// Results should be different (though both valid)
			expect(contrastTheme.scales.accent["500"]).not.toBe(materialTheme.scales.accent["500"]);
		});
	});

	describe("options", () => {
		it("should respect saturation option", () => {
			const fullSat = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				saturation: 100,
			});

			const lowSat = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				saturation: 50,
			});

			expect(fullSat.scales.accent["500"]).not.toBe(lowSat.scales.accent["500"]);
		});

		it("should respect contrast option", () => {
			const normalContrast = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				contrast: 1,
			});

			const highContrast = createTheme({
				accent: "#6366f1",
				background: "#ffffff",
				contrast: 1.5,
			});

			expect(normalContrast.scales.accent["500"]).not.toBe(highContrast.scales.accent["500"]);
		});

		it("should respect lightness option", () => {
			const lightTheme = createTheme({
				accent: "#6366f1",
				background: "#6b7280",
				lightness: 97,
			});

			const darkTheme = createTheme({
				accent: "#6366f1",
				background: "#6b7280",
				lightness: 10,
			});

			expect(lightTheme.scales.accent["500"]).not.toBe(darkTheme.scales.accent["500"]);
		});
	});

	describe("dark theme support", () => {
		it("should work with dark background", () => {
			const theme = createTheme({
				accent: "#6366f1",
				background: "#0a0a0a",
			});

			expect(theme.background).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
			expect(theme.scales.accent).toBeDefined();
		});
	});
});

describe("Type exports", () => {
	it("should export all required types", () => {
		// These are compile-time checks - if the types don't exist, TypeScript will fail
		const options: CreateThemeOptions = {
			accent: "#6366f1",
			background: "#ffffff",
		};

		const theme: Theme = {
			background: "hsl(0, 0%, 100%)",
			scales: {
				neutral: {
					"50": "",
					"100": "",
					"200": "",
					"300": "",
					"400": "",
					"500": "",
					"600": "",
					"700": "",
					"800": "",
					"900": "",
					"950": "",
				},
				accent: {
					"50": "",
					"100": "",
					"200": "",
					"300": "",
					"400": "",
					"500": "",
					"600": "",
					"700": "",
					"800": "",
					"900": "",
					"950": "",
				},
				success: {
					"50": "",
					"100": "",
					"200": "",
					"300": "",
					"400": "",
					"500": "",
					"600": "",
					"700": "",
					"800": "",
					"900": "",
					"950": "",
				},
				warning: {
					"50": "",
					"100": "",
					"200": "",
					"300": "",
					"400": "",
					"500": "",
					"600": "",
					"700": "",
					"800": "",
					"900": "",
					"950": "",
				},
				danger: {
					"50": "",
					"100": "",
					"200": "",
					"300": "",
					"400": "",
					"500": "",
					"600": "",
					"700": "",
					"800": "",
					"900": "",
					"950": "",
				},
			},
		};

		const scale: ColorScale = {
			"50": "",
			"100": "",
			"200": "",
			"300": "",
			"400": "",
			"500": "",
			"600": "",
			"700": "",
			"800": "",
			"900": "",
			"950": "",
		};

		expect(options).toBeDefined();
		expect(theme).toBeDefined();
		expect(scale).toBeDefined();
	});
});
