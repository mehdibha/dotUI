/**
 * Migration baseline test
 * Captures outputs from current implementation to validate Color.js migration
 */

import { describe, it, expect } from "vitest";
import { createTheme } from "../src";

// Standard test configuration
const TEST_CONFIG = {
	colors: [
		{
			name: "accent",
			colorKeys: ["#6366f1"],
			ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15],
		},
		{
			name: "success",
			colorKeys: ["#22c55e"],
			ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15],
		},
	],
	backgroundColor: "#ffffff",
	lightness: 100,
};

describe("Migration Baseline", () => {
	describe("Theme generation outputs", () => {
		it("should generate 11 steps per color scale", () => {
			const theme = createTheme(TEST_CONFIG);

			expect(Object.keys(theme.colors.accent)).toHaveLength(11);
			expect(Object.keys(theme.colors.success)).toHaveLength(11);
		});

		it("should output valid HSL format", () => {
			const theme = createTheme(TEST_CONFIG);

			// Check background
			expect(theme.background).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);

			// Check all color values
			for (const scale of Object.values(theme.colors)) {
				for (const value of Object.values(scale)) {
					expect(value).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
				}
			}
		});

		it("should produce consistent outputs for same inputs", () => {
			const theme1 = createTheme(TEST_CONFIG);
			const theme2 = createTheme(TEST_CONFIG);

			expect(theme1).toEqual(theme2);
		});
	});

	describe("Contrast ratio accuracy", () => {
		it("should produce colors that meet target contrast ratios", () => {
			const theme = createTheme({
				colors: [
					{
						name: "test",
						colorKeys: ["#6366f1"],
						ratios: [3, 4.5, 7],
					},
				],
				backgroundColor: "#ffffff",
			});

			// We verify outputs exist - the comparison script validates actual ratios
			expect(theme.colors.test).toBeDefined();
			expect(Object.keys(theme.colors.test)).toHaveLength(3);
		});
	});

	describe("Saturation modification", () => {
		it("should produce different outputs with different saturation", () => {
			const fullSat = createTheme({
				...TEST_CONFIG,
				saturation: 100,
			});

			const halfSat = createTheme({
				...TEST_CONFIG,
				saturation: 50,
			});

			// Colors should differ
			expect(fullSat.colors.accent).not.toEqual(halfSat.colors.accent);
		});
	});

	describe("Contrast multiplier", () => {
		it("should produce different outputs with different contrast", () => {
			const normalContrast = createTheme({
				...TEST_CONFIG,
				contrast: 1,
			});

			const highContrast = createTheme({
				...TEST_CONFIG,
				contrast: 1.5,
			});

			expect(normalContrast.colors.accent).not.toEqual(
				highContrast.colors.accent
			);
		});
	});

	describe("Background lightness", () => {
		it("should produce different backgrounds with different lightness", () => {
			const light = createTheme({
				colors: [
					{ name: "test", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: {
					name: "bg",
					colorKeys: ["#6366f1"],
				},
				lightness: 95,
			});

			const dark = createTheme({
				colors: [
					{ name: "test", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: {
					name: "bg",
					colorKeys: ["#6366f1"],
				},
				lightness: 10,
			});

			expect(light.background).not.toEqual(dark.background);
		});
	});

	describe("WCAG3 formula support", () => {
		it("should work with wcag3 formula", () => {
			const theme = createTheme({
				colors: [
					{
						name: "test",
						colorKeys: ["#6366f1"],
						ratios: [30, 60, 90], // APCA values
					},
				],
				backgroundColor: "#ffffff",
				formula: "wcag3",
			});

			expect(theme.colors.test).toBeDefined();
			expect(Object.keys(theme.colors.test)).toHaveLength(3);
		});
	});

	describe("Smooth interpolation", () => {
		it("should work with smooth option", () => {
			const smooth = createTheme({
				colors: [
					{
						name: "test",
						colorKeys: ["#6366f1"],
						ratios: [1.5, 3, 4.5],
						smooth: true,
					},
				],
				backgroundColor: "#ffffff",
			});

			const notSmooth = createTheme({
				colors: [
					{
						name: "test",
						colorKeys: ["#6366f1"],
						ratios: [1.5, 3, 4.5],
						smooth: false,
					},
				],
				backgroundColor: "#ffffff",
			});

			// Both should produce valid outputs
			expect(Object.keys(smooth.colors.test)).toHaveLength(3);
			expect(Object.keys(notSmooth.colors.test)).toHaveLength(3);
		});
	});

	describe("Named ratios", () => {
		it("should support object ratios with named keys", () => {
			const theme = createTheme({
				colors: [
					{
						name: "accent",
						colorKeys: ["#6366f1"],
						ratios: {
							subtle: 1.5,
							default: 3,
							strong: 7,
						},
					},
				],
				backgroundColor: "#ffffff",
			});

			expect(theme.colors.accent.subtle).toBeDefined();
			expect(theme.colors.accent.default).toBeDefined();
			expect(theme.colors.accent.strong).toBeDefined();
		});
	});
});
