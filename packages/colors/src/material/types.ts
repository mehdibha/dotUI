import type { z } from "zod";

import type {
	createThemeOptionsSchema,
	modeSchema,
	modeVariantSchema,
	tonesSchema,
} from "./schema";

// ============================================================================
// Schema-inferred types
// ============================================================================

export type Tones = z.infer<typeof tonesSchema>;

export type ModeVariant = z.infer<typeof modeVariantSchema>;

export type Mode = z.infer<typeof modeSchema>;

export type CreateThemeOptions = z.infer<typeof createThemeOptionsSchema>;

// ============================================================================
// Output types
// ============================================================================

export type ColorScale = {
	"50": string;
	"100": string;
	"200": string;
	"300": string;
	"400": string;
	"500": string;
	"600": string;
	"700": string;
	"800": string;
	"900": string;
	"950": string;
};

export type ThemeMode = {
	scales: Record<string, ColorScale>;
};

export type Theme = Record<string, ThemeMode>;

// ============================================================================
// Internal types
// ============================================================================

export type ResolvedModeConfig = {
	isDark: boolean;
	variant: ModeVariant;
	contrast: number;
	tones: number[];
	palettes: Record<string, { color?: string; tones?: number[] }>;
};
