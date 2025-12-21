import { z } from "zod";

/**
 * Per-component configuration overrides
 */
export const componentConfigSchema = z.object({
	/** Custom CSS tokens for this component */
	tokens: z.record(z.string(), z.string()).optional(),
	/** Component-specific radius override */
	radius: z.number().optional(),
});

/**
 * Components configuration - per-component overrides
 */
export const componentsConfigSchema = z.record(z.string(), componentConfigSchema);

export type ComponentConfig = z.infer<typeof componentConfigSchema>;
export type ComponentsConfig = z.infer<typeof componentsConfigSchema>;
