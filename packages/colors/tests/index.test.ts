/**
 * Tests for createTheme API
 */

import { describe, it, expect } from "vitest";
import { createTheme } from "../src";
import type {
	CreateThemeInput,
	CreateThemeOutput,
	ColorInput,
	BackgroundColorInput,
	LeonardoColorspace,
	ContrastFormula,
} from "../src";

describe("createTheme", () => {
	describe("basic functionality", () => {
		it("should create a theme with single color", () => {
			const theme = createTheme({
				colors: [
					{
						name: "accent",
						colorKeys: ["#6366f1"],
						ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15],
					},
				],
				backgroundColor: "#ffffff",
			});

			expect(theme.background).toBeDefined();
			expect(theme.colors.accent).toBeDefined();
			expect(Object.keys(theme.colors.accent).length).toBe(11);
		});

		it("should create a theme with multiple colors", () => {
			const theme = createTheme({
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
			});

			expect(theme.colors.accent).toBeDefined();
			expect(theme.colors.success).toBeDefined();
		});

		it("should output HSL format", () => {
			const theme = createTheme({
				colors: [
					{
						name: "accent",
						colorKeys: ["#6366f1"],
						ratios: [3],
					},
				],
				backgroundColor: "#ffffff",
			});

			expect(theme.background).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
			const firstStep = Object.values(theme.colors.accent)[0];
			expect(firstStep).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
		});
	});

	describe("options", () => {
		it("should respect lightness option with background object", () => {
			const lightTheme = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: {
					name: "neutral",
					colorKeys: ["#6366f1"],
				},
				lightness: 97,
			});

			const darkTheme = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: {
					name: "neutral",
					colorKeys: ["#6366f1"],
				},
				lightness: 10,
			});

			expect(lightTheme.background).not.toBe(darkTheme.background);
		});

		it("should respect lightness option with string backgroundColor", () => {
			const lightTheme = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: "#6b7280",
				lightness: 97,
			});

			const darkTheme = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: "#6b7280",
				lightness: 10,
			});

			// Light theme should have a light background
			expect(lightTheme.background).toMatch(/hsl\(\d+, \d+%, 9[0-9]%\)/);
			// Dark theme should have a dark background
			expect(darkTheme.background).toMatch(/hsl\(\d+, \d+%, [0-2]?[0-9]%\)/);
			// They should be different
			expect(lightTheme.background).not.toBe(darkTheme.background);
		});

		it("should respect saturation option", () => {
			const fullSat = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: "#ffffff",
				saturation: 100,
			});

			const lowSat = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: "#ffffff",
				saturation: 50,
			});

			expect(fullSat.colors.accent).not.toEqual(lowSat.colors.accent);
		});

		it("should respect contrast option", () => {
			const normalContrast = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: "#ffffff",
				contrast: 1,
			});

			const highContrast = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: "#ffffff",
				contrast: 1.5,
			});

			expect(normalContrast.colors.accent).not.toEqual(
				highContrast.colors.accent
			);
		});

		it("should support wcag2 and wcag3 formula", () => {
			const wcag2 = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [4.5] },
				],
				backgroundColor: "#ffffff",
				formula: "wcag2",
			});

			const wcag3 = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [60] },
				],
				backgroundColor: "#ffffff",
				formula: "wcag3",
			});

			expect(wcag2.colors.accent).toBeDefined();
			expect(wcag3.colors.accent).toBeDefined();
		});
	});

	describe("background color input", () => {
		it("should accept string background", () => {
			const theme = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: "#f5f5f5",
			});

			expect(theme.background).toBeDefined();
		});

		it("should accept object background", () => {
			const theme = createTheme({
				colors: [
					{ name: "accent", colorKeys: ["#6366f1"], ratios: [3] },
				],
				backgroundColor: {
					name: "neutral",
					colorKeys: ["#f5f5f5"],
				},
				lightness: 95,
			});

			expect(theme.background).toBeDefined();
		});
	});

	describe("named ratios", () => {
		it("should support object ratios with named keys", () => {
			const theme = createTheme({
				colors: [
					{
						name: "accent",
						colorKeys: ["#6366f1"],
						ratios: {
							light: 1.5,
							base: 3,
							dark: 7,
						},
					},
				],
				backgroundColor: "#ffffff",
			});

			expect(theme.colors.accent.light).toBeDefined();
			expect(theme.colors.accent.base).toBeDefined();
			expect(theme.colors.accent.dark).toBeDefined();
		});
	});
});

describe("Type exports", () => {
	it("should export all required types", () => {
		// These are compile-time checks - if the types don't exist, TypeScript will fail
		const input: CreateThemeInput = {
			colors: [],
			backgroundColor: "#ffffff",
		};

		const output: CreateThemeOutput = {
			background: "hsl(0, 0%, 100%)",
			colors: {},
		};

		const colorInput: ColorInput = {
			name: "test",
			colorKeys: ["#000000"],
			ratios: [3],
		};

		const bgInput: BackgroundColorInput = {
			name: "bg",
			colorKeys: ["#ffffff"],
		};

		const colorspace: LeonardoColorspace = "RGB";
		const formula: ContrastFormula = "wcag2";

		expect(input).toBeDefined();
		expect(output).toBeDefined();
		expect(colorInput).toBeDefined();
		expect(bgInput).toBeDefined();
		expect(colorspace).toBe("RGB");
		expect(formula).toBe("wcag2");
	});
});
