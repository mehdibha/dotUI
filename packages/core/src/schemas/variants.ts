import { z } from "zod";

import { VARIANTS } from "@dotui/core/__registry__/variants";

/**
 * Generate variants schema from registry metadata
 * Only includes components with 2+ variants
 */
function createVariantsSchema() {
	const shape: Record<string, z.ZodOptional<z.ZodType<string>>> = {};

	for (const [key, config] of Object.entries(VARIANTS)) {
		// Use z.enum with a tuple assertion for proper typing
		const options = [...config.options] as [string, ...string[]];
		shape[key] = z.enum(options).optional();
	}

	return z.object(shape);
}

export const variantsConfigSchema = createVariantsSchema();

export type VariantsConfig = z.infer<typeof variantsConfigSchema>;

export type { VariantGroupKey, VariantKey } from "@dotui/core/__registry__/variants";
// Re-export registry constants for convenience
export { VARIANT_GROUPS, VARIANTS } from "@dotui/core/__registry__/variants";
