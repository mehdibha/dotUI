/**
 * Theme generation using @dotui/colors
 */

import { createTheme as createColorTheme } from "@dotui/colors";
import type { ThemeConfig, ThemeOutput, ModeConfig, ScaleId } from "../types";

/** Default contrast ratios for 11-step scale (50-950) */
const DEFAULT_RATIOS = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15];

/** Scale step names */
const SCALE_STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;

/** Scale IDs */
const SCALE_IDS: ScaleId[] = ["neutral", "accent", "success", "warning", "danger", "info"];

/**
 * Generate CSS variables for a single mode (light or dark)
 */
function generateModeVars(
	mode: ModeConfig,
	backgroundColor: string,
): Record<string, string> {
	const vars: Record<string, string> = {};

	// Build color inputs for @dotui/colors
	const colorInputs = SCALE_IDS.map((scaleId) => {
		const scale = mode.scales[scaleId];
		return {
			name: scaleId,
			colorKeys: scale.colorKeys,
			ratios: scale.ratios || DEFAULT_RATIOS,
			smooth: scale.smooth ?? false,
		};
	});

	// Generate colors using @dotui/colors
	const theme = createColorTheme({
		colors: colorInputs,
		backgroundColor,
		lightness: mode.lightness,
		saturation: mode.saturation ?? 100,
		contrast: mode.contrast ?? 1,
	});

	// Set background color
	vars["--background"] = theme.background;

	// Map generated colors to CSS variables
	for (const scaleId of SCALE_IDS) {
		const scale = theme.colors[scaleId];
		if (!scale) continue;

		for (const step of SCALE_STEPS) {
			const value = scale[step];
			if (value) {
				vars[`--${scaleId}-${step}`] = value;
			}
		}
	}

	// Add semantic color mappings
	addSemanticVars(vars);

	return vars;
}

/**
 * Add semantic color variable mappings
 */
function addSemanticVars(vars: Record<string, string>): void {
	// Foreground colors
	vars["--fg"] = "var(--neutral-950)";
	vars["--fg-muted"] = "var(--neutral-500)";
	vars["--fg-accent"] = "var(--accent-600)";
	vars["--fg-success"] = "var(--success-600)";
	vars["--fg-warning"] = "var(--warning-600)";
	vars["--fg-danger"] = "var(--danger-600)";
	vars["--fg-info"] = "var(--info-600)";

	// Background colors
	vars["--bg"] = "var(--background)";
	vars["--bg-muted"] = "var(--neutral-100)";
	vars["--bg-accent"] = "var(--accent-500)";
	vars["--bg-success"] = "var(--success-500)";
	vars["--bg-warning"] = "var(--warning-500)";
	vars["--bg-danger"] = "var(--danger-500)";
	vars["--bg-info"] = "var(--info-500)";

	// Border colors
	vars["--border"] = "var(--neutral-200)";
	vars["--border-muted"] = "var(--neutral-100)";

	// Card/surface colors
	vars["--card"] = "var(--background)";
	vars["--card-foreground"] = "var(--fg)";

	// Input colors
	vars["--input"] = "var(--neutral-200)";
	vars["--ring"] = "var(--accent-500)";
}

/**
 * Generate theme output from config
 */
export function generateTheme(config: ThemeConfig): ThemeOutput {
	const { colors, radius, spacing, fonts } = config;

	const cssVars: ThemeOutput["cssVars"] = {
		light: {},
	};

	// Generate light mode variables
	if (colors.activeModes.includes("light")) {
		cssVars.light = generateModeVars(colors.modes.light, colors.backgroundColor);
	}

	// Generate dark mode variables
	if (colors.activeModes.includes("dark")) {
		cssVars.dark = generateModeVars(colors.modes.dark, colors.backgroundColor);
	}

	// Add non-color theme variables to light (base) vars
	cssVars.light["--radius"] = `${radius}rem`;
	cssVars.light["--spacing"] = `${spacing}rem`;
	cssVars.light["--font-heading"] = fonts.heading;
	cssVars.light["--font-body"] = fonts.body;

	return { cssVars };
}

/**
 * Convert theme output to CSS string
 */
export function themeToCss(theme: ThemeOutput): string {
	const lines: string[] = [];

	// Root variables (light mode / base)
	lines.push(":root {");
	for (const [key, value] of Object.entries(theme.cssVars.light)) {
		lines.push(`  ${key}: ${value};`);
	}
	lines.push("}");

	// Dark mode variables
	if (theme.cssVars.dark) {
		lines.push("");
		lines.push(".dark {");
		for (const [key, value] of Object.entries(theme.cssVars.dark)) {
			lines.push(`  ${key}: ${value};`);
		}
		lines.push("}");
	}

	return lines.join("\n");
}
