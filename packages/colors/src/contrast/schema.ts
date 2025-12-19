import { z } from "zod";

// === Building blocks ===

const ratiosSchema = z.array(z.number().positive()).length(11);

const paletteDefinitionSchema = z.string().min(1);

const paletteDefinitionsSchema = z
	.object({
		primary: paletteDefinitionSchema,
		neutral: paletteDefinitionSchema.optional(),
		success: z.union([paletteDefinitionSchema, z.boolean()]).optional(),
		danger: z.union([paletteDefinitionSchema, z.boolean()]).optional(),
		warning: z.union([paletteDefinitionSchema, z.boolean()]).optional(),
		info: z.union([paletteDefinitionSchema, z.boolean()]).optional(),
	})
	.catchall(z.union([paletteDefinitionSchema, z.boolean()]));

const paletteOverrideSchema = z.object({
	color: z.string().min(1).optional(),
	ratios: ratiosSchema.optional(),
});

export const modeSchema = z.union([
	z.literal(true),
	z.object({
		lightness: z.number().min(0).max(100).optional(),
		palettes: z.record(z.string(), paletteOverrideSchema).optional(),
	}),
]);

export const contrastFormulaSchema = z.enum(["wcag2", "wcag3"]);

// === Main schema ===

export const baseContrastThemeOptionsSchema = z.object({
	palettes: paletteDefinitionsSchema,
	modes: z.record(z.string(), modeSchema).optional(),
	ratios: ratiosSchema.optional(),
	formula: contrastFormulaSchema.optional(),
	saturation: z.number().min(0).max(100).optional(),
});

export const createContrastThemeOptionsSchema = baseContrastThemeOptionsSchema.refine(
	(data) => {
		const globalKeys = Object.keys(data.palettes);
		for (const modeConfig of Object.values(data.modes ?? {})) {
			if (modeConfig !== true && modeConfig.palettes) {
				for (const key of Object.keys(modeConfig.palettes)) {
					if (!globalKeys.includes(key)) return false;
				}
			}
		}
		return true;
	},
	{
		message: "Mode palette overrides can only reference palettes defined in 'palettes'",
	},
);
