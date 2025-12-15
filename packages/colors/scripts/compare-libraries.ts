/**
 * Comparison script to validate Color.js can match our current implementation
 * Run with: npx tsx scripts/compare-libraries.ts
 */

import { createTheme } from "../src/index";
import Color from "colorjs.io";

// Test configuration
const testConfig = {
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

// Generate theme with current implementation
console.log("=".repeat(60));
console.log("COMPARISON: Current Implementation vs Color.js Verification");
console.log("=".repeat(60));

const theme = createTheme(testConfig);

console.log("\n📋 Theme Background:", theme.background);

// Parse HSL string to Color.js color
function parseHsl(hslString: string): Color {
	const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
	if (!match) throw new Error(`Invalid HSL: ${hslString}`);
	return new Color("hsl", [
		parseFloat(match[1]),
		parseFloat(match[2]),
		parseFloat(match[3]),
	]);
}

// Verify contrast ratios using Color.js
console.log("\n🔍 Verifying contrast ratios with Color.js:");
console.log("-".repeat(60));

const bgColor = parseHsl(theme.background);

for (const [scaleName, scale] of Object.entries(theme.colors)) {
	console.log(`\n${scaleName.toUpperCase()}:`);
	console.log(
		"Step".padEnd(8) +
			"HSL".padEnd(24) +
			"Target".padEnd(10) +
			"Actual".padEnd(10) +
			"Status"
	);

	const targetRatios = testConfig.colors.find(
		(c) => c.name === scaleName
	)?.ratios;
	if (!targetRatios || !Array.isArray(targetRatios)) continue;

	let i = 0;
	for (const [step, hslValue] of Object.entries(scale)) {
		const fgColor = parseHsl(hslValue);

		// Calculate WCAG 2.1 contrast using Color.js
		const actualContrast = Math.abs(bgColor.contrast(fgColor, "WCAG21"));
		const targetContrast = targetRatios[i] ?? 0;

		// Check if within tolerance (Leonardo uses binary search, small variance expected)
		const tolerance = 0.1;
		const withinTolerance =
			Math.abs(actualContrast - targetContrast) <= tolerance;
		const status = withinTolerance ? "✅" : "⚠️";

		console.log(
			step.padEnd(8) +
				hslValue.padEnd(24) +
				targetContrast.toFixed(2).padEnd(10) +
				actualContrast.toFixed(2).padEnd(10) +
				status
		);

		i++;
	}
}

// Test Color.js capabilities
console.log("\n" + "=".repeat(60));
console.log("COLOR.JS CAPABILITIES TEST");
console.log("=".repeat(60));

// HSLuv support
console.log("\n🎨 HSLuv Support:");
const hsluvColor = new Color("hsluv", [270, 100, 50]);
console.log(`  HSLuv(270, 100, 50) → sRGB: ${hsluvColor.to("srgb").toString()}`);

// CAM16 support
console.log("\n🎨 CAM16 Support:");
const cam16Color = new Color("cam16-jmh", [50, 30, 270]);
console.log(
	`  CAM16(J:50, M:30, h:270) → sRGB: ${cam16Color.to("srgb").toString()}`
);

// APCA contrast
console.log("\n🎨 APCA Contrast Support:");
const white = new Color("white");
const testColor = new Color("#6366f1");
const apcaContrast = white.contrast(testColor, "APCA");
console.log(`  White vs #6366f1 APCA: ${apcaContrast.toFixed(2)} Lc`);

// WCAG contrast
const wcagContrast = white.contrast(testColor, "WCAG21");
console.log(`  White vs #6366f1 WCAG: ${wcagContrast.toFixed(2)}:1`);

// Interpolation in different spaces
console.log("\n🎨 Interpolation Support:");
const color1 = new Color("#6366f1");
const color2 = new Color("#22c55e");

const oklchMix = color1.mix(color2, 0.5, { space: "oklch" });
console.log(`  OKLCH interpolation: ${oklchMix.to("srgb").toString({ format: "hex" })}`);

const cam16Mix = color1.mix(color2, 0.5, { space: "cam16-jmh" });
console.log(`  CAM16 interpolation: ${cam16Mix.to("srgb").toString({ format: "hex" })}`);

console.log("\n" + "=".repeat(60));
console.log("CONCLUSION");
console.log("=".repeat(60));
console.log(`
✅ Color.js provides:
   - HSLuv color space (for background lightness)
   - CAM16 (improved successor to CIECAM02)
   - APCA contrast calculation
   - WCAG 2.1 contrast calculation
   - Rich interpolation in any color space

📝 Migration would:
   - Replace 5 packages with 1
   - Use CAM16 instead of CIECAM02 (better)
   - Keep same algorithm logic, just different API calls
`);
