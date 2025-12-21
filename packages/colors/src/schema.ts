import { z } from "zod";

import { baseContrastThemeOptionsSchema } from "./contrast/schema";
import { baseMaterialThemeOptionsSchema } from "./material/schema";

const materialOptionsSchema = baseMaterialThemeOptionsSchema.extend({
	algorithm: z.literal("material"),
});

const contrastOptionsSchema = baseContrastThemeOptionsSchema.extend({
	algorithm: z.literal("contrast"),
});

export const createThemeOptionsSchema = z.discriminatedUnion("algorithm", [
	materialOptionsSchema,
	contrastOptionsSchema,
]);

export type CreateThemeOptions = z.infer<typeof createThemeOptionsSchema>;
