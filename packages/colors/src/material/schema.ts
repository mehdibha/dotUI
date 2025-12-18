import { z } from "zod";

// === Building blocks ===

export const tonesSchema = z.array(z.number().min(0).max(100)).length(11);

export const paletteDefinitionSchema = z.string().min(1);

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

export const modeVariantSchema = z.enum([
	"tonalSpot",
	"vibrant",
	"expressive",
	"neutral",
	"monochrome",
	"fidelity",
	"content",
	"rainbow",
	"fruitSalad",
]);

const paletteSchema = z.object({
	color: z.string().min(1).optional(),
	tones: tonesSchema.optional(),
});

export const modeSchema = z.union([
	z.literal(true),
	z.object({
		isDark: z.boolean(),
		variant: modeVariantSchema.optional(),
		contrast: z.number().min(-1).max(1).optional(),
		palettes: z.record(z.string(), paletteSchema).optional(),
	}),
]);

// === Main schema ===

export const createThemeOptionsSchema = z
	.object({
		palettes: paletteDefinitionsSchema,
		modes: z.record(z.string(), modeSchema).optional(),
	})
	.refine(
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
