import { z } from "zod";

export const typographyConfigSchema = z.object({
	/** Font family for headings */
	heading: z.string(),
	/** Font family for body text */
	body: z.string(),
	/** Font family for monospace/code */
	mono: z.string().optional(),
	/** Base font size in pixels */
	baseFontSize: z.number().optional(),
	/** Letter spacing adjustment */
	letterSpacing: z.number().optional(),
	/** Line height multiplier */
	lineHeight: z.number().optional(),
});

export type TypographyConfig = z.infer<typeof typographyConfigSchema>;
