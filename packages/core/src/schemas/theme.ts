import { z } from "zod";

import { colorsConfigSchema } from "./colors";
import { effectsConfigSchema } from "./effects";
import { typographyConfigSchema } from "./typography";

/**
 * Theme configuration schema
 */
export const themeConfigSchema = z.object({
	/** Colors configuration */
	colors: colorsConfigSchema,
	/** Border radius factor (multiplier for --radius) */
	radius: z.number(),
	/** Base spacing unit */
	spacing: z.number(),
	/** Typography configuration */
	typography: typographyConfigSchema,
	/** Visual effects (optional) */
	effects: effectsConfigSchema.optional(),
});

export type ThemeConfig = z.infer<typeof themeConfigSchema>;
