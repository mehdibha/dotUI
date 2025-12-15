/**
 * Snapshot baseline tests for class-to-functional refactoring
 *
 * These tests capture exact outputs from the class-based implementation
 * to verify byte-for-byte parity after refactoring to pure functions.
 *
 * DO NOT modify expected values - they represent the baseline truth.
 */

import { describe, it, expect } from "vitest";
import { createTheme } from "../src";
import type { CreateThemeInput } from "../src";

// Standard ratios used throughout the library
const STANDARD_RATIOS = [1, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15];

// Test cases that cover all major code paths
const SNAPSHOT_CASES: Array<{ name: string; input: CreateThemeInput }> = [
	// Case 1: Basic single color, light theme
	{
		name: "basic-single-color-light",
		input: {
			colors: [
				{
					name: "accent",
					colorKeys: ["#6366f1"],
					ratios: STANDARD_RATIOS,
				},
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 2: Basic single color, dark theme
	{
		name: "basic-single-color-dark",
		input: {
			colors: [
				{
					name: "accent",
					colorKeys: ["#6366f1"],
					ratios: STANDARD_RATIOS,
				},
			],
			backgroundColor: "#000000",
			lightness: 0,
		},
	},
	// Case 3: Multiple colors
	{
		name: "multiple-colors",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
				{ name: "success", colorKeys: ["#22c55e"], ratios: STANDARD_RATIOS },
				{ name: "warning", colorKeys: ["#eab308"], ratios: STANDARD_RATIOS },
				{ name: "danger", colorKeys: ["#ef4444"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: "#ffffff",
			lightness: 97,
		},
	},
	// Case 4: Saturation modification
	{
		name: "saturation-80",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
			saturation: 80,
		},
	},
	// Case 5: Low saturation (desaturated)
	{
		name: "saturation-30",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
			saturation: 30,
		},
	},
	// Case 6: Contrast multiplier > 1
	{
		name: "contrast-1.2",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
			contrast: 1.2,
		},
	},
	// Case 7: Contrast multiplier < 1
	{
		name: "contrast-0.8",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
			contrast: 0.8,
		},
	},
	// Case 8: LAB colorspace
	{
		name: "colorspace-LAB",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS, colorspace: "LAB" },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 9: LCH colorspace
	{
		name: "colorspace-LCH",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS, colorspace: "LCH" },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 10: OKLCH colorspace
	{
		name: "colorspace-OKLCH",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS, colorspace: "OKLCH" },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 11: CAM02 colorspace
	{
		name: "colorspace-CAM02",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS, colorspace: "CAM02" },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 12: HSLuv colorspace
	{
		name: "colorspace-HSLuv",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS, colorspace: "HSLuv" },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 13: WCAG3 formula
	{
		name: "formula-wcag3",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: [15, 30, 45, 60, 75, 90] },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
			formula: "wcag3",
		},
	},
	// Case 14: Smooth interpolation
	{
		name: "smooth-interpolation",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS, smooth: true },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 15: Object backgroundColor
	{
		name: "background-object",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: {
				name: "neutral",
				colorKeys: ["#6b7280"],
			},
			lightness: 97,
		},
	},
	// Case 16: Named ratios
	{
		name: "named-ratios",
		input: {
			colors: [
				{
					name: "accent",
					colorKeys: ["#6366f1"],
					ratios: {
						subtle: 1.15,
						default: 3,
						strong: 4.5,
						contrast: 7,
					},
				},
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 17: Multiple key colors (gradient)
	{
		name: "multiple-key-colors",
		input: {
			colors: [
				{
					name: "gradient",
					colorKeys: ["#6366f1", "#ec4899", "#f97316"],
					ratios: STANDARD_RATIOS,
				},
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 18: Mid-lightness theme
	{
		name: "mid-lightness-50",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: {
				name: "neutral",
				colorKeys: ["#6b7280"],
			},
			lightness: 50,
		},
	},
	// Case 19: Near-dark theme
	{
		name: "near-dark-10",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: {
				name: "neutral",
				colorKeys: ["#6b7280"],
			},
			lightness: 10,
		},
	},
	// Case 20: Combined options (saturation + contrast + colorspace)
	{
		name: "combined-options",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS, colorspace: "OKLCH" },
				{ name: "success", colorKeys: ["#22c55e"], ratios: STANDARD_RATIOS, colorspace: "OKLCH" },
			],
			backgroundColor: "#ffffff",
			lightness: 97,
			saturation: 90,
			contrast: 1.1,
		},
	},
	// Case 21: Gray/neutral color
	{
		name: "gray-color",
		input: {
			colors: [
				{ name: "neutral", colorKeys: ["#6b7280"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 22: Very saturated color
	{
		name: "saturated-color",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#ff0000"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: "#ffffff",
			lightness: 100,
		},
	},
	// Case 23: Edge case - lightness at boundary
	{
		name: "lightness-boundary-1",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: {
				name: "neutral",
				colorKeys: ["#6b7280"],
			},
			lightness: 1,
		},
	},
	// Case 24: Edge case - lightness at 99
	{
		name: "lightness-boundary-99",
		input: {
			colors: [
				{ name: "accent", colorKeys: ["#6366f1"], ratios: STANDARD_RATIOS },
			],
			backgroundColor: {
				name: "neutral",
				colorKeys: ["#6b7280"],
			},
			lightness: 99,
		},
	},
];

describe("Snapshot Baseline", () => {
	describe("Output structure validation", () => {
		it.each(SNAPSHOT_CASES)("$name - has valid structure", ({ input }) => {
			const result = createTheme(input);
			expect(result).toBeDefined();
			expect(result.background).toBeDefined();
			expect(result.colors).toBeDefined();

			// Verify all colors are present
			for (const color of input.colors) {
				expect(result.colors[color.name]).toBeDefined();
			}
		});

		it.each(SNAPSHOT_CASES)("$name - has correct number of steps", ({ input }) => {
			const result = createTheme(input);

			for (const color of input.colors) {
				const scale = result.colors[color.name];
				const expectedSteps = Array.isArray(color.ratios)
					? color.ratios.length
					: Object.keys(color.ratios).length;
				expect(Object.keys(scale ?? {}).length).toBe(expectedSteps);
			}
		});

		it.each(SNAPSHOT_CASES)("$name - outputs HSL format", ({ input }) => {
			const result = createTheme(input);

			// Check background
			expect(result.background).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);

			// Check all color values
			for (const scale of Object.values(result.colors ?? {})) {
				for (const value of Object.values(scale)) {
					expect(value).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
				}
			}
		});
	});

	describe("Determinism validation", () => {
		it.each(SNAPSHOT_CASES)("$name - produces identical output on repeated calls", ({ input }) => {
			const result1 = createTheme(input);
			const result2 = createTheme(input);
			expect(result1).toEqual(result2);
		});
	});

	describe("Exact snapshot values", () => {
		it.each(SNAPSHOT_CASES)("$name - matches snapshot", ({ name, input }) => {
			const result = createTheme(input);
			expect(result).toMatchSnapshot(name);
		});
	});
});
