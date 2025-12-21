import type { z } from "zod";

import type { createMaterialThemeOptionsSchema, modeSchema, modeVariantSchema, tonesSchema } from "./schema";

// ============================================================================
// Schema-inferred types
// ============================================================================

export type Tones = z.infer<typeof tonesSchema>;

export type ModeVariant = z.infer<typeof modeVariantSchema>;

export type Mode = z.infer<typeof modeSchema>;

export type CreateThemeOptions = z.infer<typeof createMaterialThemeOptionsSchema>;

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
