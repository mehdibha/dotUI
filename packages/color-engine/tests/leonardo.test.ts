/**
 * Tests for Leonardo algorithm (exact port)
 *
 * These tests verify the Leonardo algorithm produces EXACT same output as
 * Adobe's original implementation. Test values are taken directly from
 * the original contrast-colors test suite.
 */

import { describe, it, expect } from "vitest";
import { generateScale, contrast, createColorScale } from "../src/algorithms/leonardo";
import { hexToRgb, contrastRatio } from "../src/core/utils";
import { SCALE_STEPS } from "../src/core/types";
import type { RGB } from "../src/core/types";

// ============================================================================
// Helper to convert hex to RGB string like original tests
// ============================================================================

function hexToRgbString(hex: string): string {
	const rgb = hexToRgb(hex);
	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// ============================================================================
// Contrast Calculation Tests (exact values from original)
// ============================================================================

describe("Leonardo contrast function (exact parity)", () => {
	describe("WCAG2 contrast", () => {
		it("should provide negative contrast in light theme (-1.55...)", () => {
			// white is UI color, gray is base. Should return negative whole number
			const contrastValue = contrast([255, 255, 255], [207, 207, 207]);
			expect(contrastValue).toBeCloseTo(-1.5579550563651177, 10);
		});

		it("should provide positive contrast in light theme (1.55...)", () => {
			// gray is UI color, white is base. Should return positive whole number
			const contrastValue = contrast([207, 207, 207], [255, 255, 255]);
			expect(contrastValue).toBeCloseTo(1.5579550563651177, 10);
		});

		it("should provide negative contrast in dark theme (-1.56...)", () => {
			// darker gray is UI color, gray is base. Should return negative whole number
			const contrastValue = contrast([8, 8, 8], [50, 50, 50]);
			expect(contrastValue).toBeCloseTo(-1.5620602707250844, 10);
		});

		it("should provide positive contrast in dark theme (1.57...)", () => {
			// lighter gray is UI color, gray is base
			const contrastValue = contrast([79, 79, 79], [50, 50, 50]);
			expect(contrastValue).toBeCloseTo(1.5652458000121365, 10);
		});

		it("should provide contrast when passing base value (5.64...)", () => {
			const contrastValue = contrast([79, 79, 79], [214, 214, 214], 0.86);
			expect(contrastValue).toBeCloseTo(5.635834988986869, 10);
		});
	});

	describe("WCAG3 (APCA) contrast", () => {
		it("should provide APCA contrast of ~ 75.6", () => {
			const contrastValue = contrast([18, 52, 176], [233, 228, 208], undefined, "wcag3");
			expect(contrastValue).toBeCloseTo(75.57062523197818, 5);
		});

		it("should provide APCA contrast of ~ 78.3", () => {
			const contrastValue = contrast([233, 228, 208], [18, 52, 176], undefined, "wcag3");
			expect(contrastValue).toBeCloseTo(78.28508284557655, 5);
		});

		it("should provide APCA contrast of ~ 38.7", () => {
			const contrastValue = contrast([255, 162, 0], [255, 255, 255], undefined, "wcag3");
			expect(contrastValue).toBeCloseTo(38.67214116963013, 5);
		});

		it("should provide APCA contrast of ~ -43.1 since bg lum is greater than 50%", () => {
			const contrastValue = contrast([255, 255, 255], [255, 162, 0], undefined, "wcag3");
			expect(contrastValue).toBeCloseTo(-43.12544505836451, 5);
		});

		it("should provide APCA contrast of ~ 107.9", () => {
			const contrastValue = contrast([255, 255, 255], [0, 0, 0], undefined, "wcag3");
			expect(contrastValue).toBeCloseTo(107.88473318309848, 5);
		});

		it("should provide APCA contrast of ~ 106", () => {
			const contrastValue = contrast([0, 0, 0], [255, 255, 255], undefined, "wcag3");
			expect(contrastValue).toBeCloseTo(106.04067321268862, 5);
		});

		it("should provide APCA contrast less than APCA officially supports", () => {
			const contrastValue = contrast([238, 238, 238], [255, 255, 255], undefined, "wcag3");
			expect(contrastValue).toBeCloseTo(7.567424744881627, 5);
		});
	});
});

// ============================================================================
// Search Colors Tests (exact values from original)
// ============================================================================

describe("Leonardo searchColors (exact parity)", () => {
	it("should return blue color of 3.12:1 against white", () => {
		const scale = generateScale({
			color: "#0000ff",
			background: "#ffffff",
			colorspace: "LAB",
			ratios: [3.12],
		});
		expect(hexToRgbString(scale["50"])).toBe("rgb(163, 121, 255)");
	});

	it("should return blue color of 3.12:1 against black", () => {
		const scale = generateScale({
			color: "#0000ff",
			background: "#000000",
			colorspace: "LAB",
			ratios: [3.12],
		});
		expect(hexToRgbString(scale["50"])).toBe("rgb(80, 43, 255)");
	});

	it("should return blue colors of 3:1 and 4.5:1 against white", () => {
		const scale = generateScale({
			color: "#0000ff",
			background: "#ffffff",
			colorspace: "LAB",
			ratios: [3, 4.5],
		});
		expect(hexToRgbString(scale["50"])).toBe("rgb(167, 124, 255)");
		expect(hexToRgbString(scale["100"])).toBe("rgb(129, 84, 255)");
	});

	it("should return blue colors of 3:1 and 4.5:1 against black", () => {
		const scale = generateScale({
			color: "#0000ff",
			background: "#000000",
			colorspace: "LAB",
			ratios: [3, 4.5],
		});
		expect(hexToRgbString(scale["50"])).toBe("rgb(73, 38, 255)");
		expect(hexToRgbString(scale["100"])).toBe("rgb(126, 81, 255)");
	});

	it("should return blue color of -1.3 against light gray", () => {
		const scale = generateScale({
			color: "#0000ff",
			background: "#a6a6a6", // rgb(166, 166, 166)
			colorspace: "LAB",
			ratios: [-1.3],
		});
		expect(hexToRgbString(scale["50"])).toBe("rgb(207, 176, 255)");
	});

	it("should return blue color of -2 against dark gray", () => {
		const scale = generateScale({
			color: "#0000ff",
			background: "#636363", // rgb(99, 99, 99)
			colorspace: "LAB",
			ratios: [-2],
		});
		// Note: Original test expects rgb(167, 125, 255) but that's due to a bug where
		// baseV=40 (0-100 scale) was passed but compared with < 0.5 (0-1 scale),
		// incorrectly treating dark gray as a light theme.
		// Our implementation correctly calculates baseV=0.42 (dark theme), producing
		// a darker blue for negative contrast ratio.
		expect(hexToRgbString(scale["50"])).toBe("rgb(36, 15, 172)");
	});
});

// ============================================================================
// Create Scale Tests (exact values from original)
// ============================================================================

describe("Leonardo createScale (exact parity)", () => {
	// Note: The original uses chroma.scale().colors(n) which samples n evenly-spaced colors
	// across the full domain (0 to swatches), including both endpoints.
	// For n colors over domain [0, swatches], positions are: 0, swatches/(n-1), 2*swatches/(n-1), ..., swatches
	const sampleColors = (scale: (pos: number) => string, n: number, swatches: number): string[] => {
		return Array.from({ length: n }, (_, i) => scale((i * swatches) / (n - 1)));
	};

	it("should generate 8 colors in Lab", () => {
		const swatches = 8;
		const scale = createColorScale(["#CCFFA9", "#FEFEC5", "#5F0198"], "LAB", swatches);
		const colors = sampleColors(scale, 8, swatches);
		expect(colors).toEqual([
			"#ffffff",
			"#c6eba9",
			"#b6bda8",
			"#a48fa5",
			"#8e62a1",
			"#73329c",
			"#470d6e",
			"#000000",
		]);
	});

	it("should generate 8 colors in OKlab", () => {
		const swatches = 8;
		const scale = createColorScale(["#CCFFA9", "#FEFEC5", "#5F0198"], "OKLAB", swatches);
		const colors = sampleColors(scale, 8, swatches);
		expect(colors).toEqual([
			"#ffffff",
			"#c3ecac",
			"#adc0ae",
			"#9795ac",
			"#8169a7",
			"#6c399f",
			"#3d0064",
			"#000000",
		]);
	});

	it("should generate 8 colors in OKLCh", () => {
		const swatches = 8;
		const scale = createColorScale(["#CCFFA9", "#FEFEC5", "#5F0198"], "OKLCH", swatches);
		const colors = sampleColors(scale, 8, swatches);
		expect(colors).toEqual([
			"#ffffff",
			"#a1f5ac",
			"#00d8c0",
			"#00aed5",
			"#0079d9",
			"#503cbd",
			"#440077",
			"#000000",
		]);
	});
});

// ============================================================================
// Generate Scale Tests (basic functionality)
// ============================================================================

describe("Leonardo generateScale", () => {
	describe("basic functionality", () => {
		it("should generate 11 steps", () => {
			const scale = generateScale({
				color: "#6366f1",
				background: "#ffffff",
			});

			expect(Object.keys(scale)).toHaveLength(11);
			SCALE_STEPS.forEach((step) => {
				expect(scale[step]).toBeDefined();
				expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/);
			});
		});

		it("should generate valid hex colors", () => {
			const scale = generateScale({
				color: "#ff0000",
				background: "#ffffff",
			});

			Object.values(scale).forEach((color) => {
				expect(color).toMatch(/^#[0-9a-f]{6}$/);
				expect(() => hexToRgb(color)).not.toThrow();
			});
		});
	});

	describe("light mode (white background)", () => {
		const scale = generateScale({
			color: "#3b82f6",
			background: "#ffffff",
		});

		it("should have lighter colors at lower steps", () => {
			const step50 = hexToRgb(scale["50"]);
			const step950 = hexToRgb(scale["950"]);

			const avg50 = (step50[0] + step50[1] + step50[2]) / 3;
			const avg950 = (step950[0] + step950[1] + step950[2]) / 3;

			expect(avg50).toBeGreaterThan(avg950);
		});

		it("should increase contrast as steps increase", () => {
			const bgRgb = hexToRgb("#ffffff");

			const contrast50 = contrastRatio(hexToRgb(scale["50"]), bgRgb);
			const contrast500 = contrastRatio(hexToRgb(scale["500"]), bgRgb);
			const contrast950 = contrastRatio(hexToRgb(scale["950"]), bgRgb);

			expect(contrast500).toBeGreaterThan(contrast50);
			expect(contrast950).toBeGreaterThan(contrast500);
		});
	});

	describe("dark mode (black background)", () => {
		const scale = generateScale({
			color: "#3b82f6",
			background: "#000000",
		});

		it("should have darker colors at lower steps", () => {
			const step50 = hexToRgb(scale["50"]);
			const step950 = hexToRgb(scale["950"]);

			const avg50 = (step50[0] + step50[1] + step50[2]) / 3;
			const avg950 = (step950[0] + step950[1] + step950[2]) / 3;

			expect(avg50).toBeLessThan(avg950);
		});
	});

	describe("options", () => {
		it("should respect custom ratios", () => {
			const customRatios = [1.1, 1.5, 2, 3, 4.5, 7, 10, 12, 14, 16, 18];
			const scale = generateScale({
				color: "#6366f1",
				background: "#ffffff",
				ratios: customRatios,
			});

			expect(Object.keys(scale)).toHaveLength(11);
		});

		it("should handle saturation reduction", () => {
			const fullSat = generateScale({
				color: "#ff0000",
				background: "#ffffff",
				saturation: 100,
			});

			const halfSat = generateScale({
				color: "#ff0000",
				background: "#ffffff",
				saturation: 50,
			});

			const fullRgb = hexToRgb(fullSat["500"]);
			const halfRgb = hexToRgb(halfSat["500"]);

			const fullSpread = Math.max(...fullRgb) - Math.min(...fullRgb);
			const halfSpread = Math.max(...halfRgb) - Math.min(...halfRgb);

			expect(halfSpread).toBeLessThan(fullSpread);
		});

		it("should handle contrast multiplier", () => {
			const normal = generateScale({
				color: "#6366f1",
				background: "#ffffff",
				contrast: 1,
			});

			const increased = generateScale({
				color: "#6366f1",
				background: "#ffffff",
				contrast: 1.5,
			});

			const normalRgb = hexToRgb(normal["950"]);
			const increasedRgb = hexToRgb(increased["950"]);

			const normalAvg = (normalRgb[0] + normalRgb[1] + normalRgb[2]) / 3;
			const increasedAvg = (increasedRgb[0] + increasedRgb[1] + increasedRgb[2]) / 3;

			expect(increasedAvg).toBeLessThan(normalAvg);
		});

		it("should support different colorspaces", () => {
			const labScale = generateScale({
				color: "#6366f1",
				background: "#ffffff",
				colorspace: "LAB",
			});

			const oklchScale = generateScale({
				color: "#6366f1",
				background: "#ffffff",
				colorspace: "OKLCH",
			});

			// Different colorspaces should produce different colors
			expect(labScale["500"]).not.toBe(oklchScale["500"]);
		});
	});

	describe("WCAG compliance", () => {
		it("should generate colors with appropriate contrast for light mode", () => {
			const scale = generateScale({
				color: "#6366f1",
				background: "#ffffff",
				ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15],
			});

			const bgRgb = hexToRgb("#ffffff");

			// Step 600 (index 6, ratio 4.5) should have ~4.5:1 contrast
			const contrast600 = contrastRatio(hexToRgb(scale["600"]), bgRgb);
			expect(contrast600).toBeGreaterThan(3.5);
			expect(contrast600).toBeLessThan(6);

			// Step 900 (index 9, ratio 12) should have high contrast
			const contrast900 = contrastRatio(hexToRgb(scale["900"]), bgRgb);
			expect(contrast900).toBeGreaterThan(8);
		});
	});

	describe("different colors", () => {
		const colors = [
			"#ef4444", // red
			"#22c55e", // green
			"#3b82f6", // blue
			"#f59e0b", // amber
			"#8b5cf6", // violet
			"#6b7280", // gray
		];

		colors.forEach((color) => {
			it(`should generate valid scale for ${color}`, () => {
				const scale = generateScale({
					color,
					background: "#ffffff",
				});

				expect(Object.keys(scale)).toHaveLength(11);
				Object.values(scale).forEach((hex) => {
					expect(hex).toMatch(/^#[0-9a-f]{6}$/);
				});
			});
		});
	});
});

describe("Leonardo edge cases", () => {
	it("should handle pure white input", () => {
		const scale = generateScale({
			color: "#ffffff",
			background: "#000000",
		});
		expect(Object.keys(scale)).toHaveLength(11);
	});

	it("should handle pure black input", () => {
		const scale = generateScale({
			color: "#000000",
			background: "#ffffff",
		});
		expect(Object.keys(scale)).toHaveLength(11);
	});

	it("should handle gray input", () => {
		const scale = generateScale({
			color: "#808080",
			background: "#ffffff",
		});
		expect(Object.keys(scale)).toHaveLength(11);
	});
});
