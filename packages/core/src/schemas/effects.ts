import { z } from "zod";

export const effectsConfigSchema = z.object({
	/** Background texture pattern */
	texture: z.string().optional(),
	/** Background pattern overlay */
	backgroundPattern: z.string().optional(),
});

export type EffectsConfig = z.infer<typeof effectsConfigSchema>;
