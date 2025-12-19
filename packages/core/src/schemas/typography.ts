import { z } from "zod";

export const typographyConfigSchema = z.object({
	/** Font family (used for all text) */
	font: z.string(),
	/** Base font size in pixels */
	baseFontSize: z.number().optional(),
	/** Letter spacing adjustment */
	letterSpacing: z.number().optional(),
	/** Line height multiplier */
	lineHeight: z.number().optional(),
});

export type TypographyConfig = z.infer<typeof typographyConfigSchema>;
