import { z } from "zod";

import { componentsConfigSchema } from "./components";
import { type IconsConfig, iconsConfigSchema } from "./icons";
export type { IconsConfig };

import { themeConfigSchema } from "./theme";
import { variantsConfigSchema } from "./variants";

/**
 * Complete style configuration schema
 * This is what gets stored in the database
 */
export const styleConfigSchema = z.object({
	/** Theme configuration (colors, typography, etc.) */
	theme: themeConfigSchema,
	/** Icons configuration */
	icons: iconsConfigSchema,
	/** Component variants selection */
	variants: variantsConfigSchema,
	/** Per-component overrides (optional) */
	components: componentsConfigSchema.optional(),
});

export type StyleConfig = z.infer<typeof styleConfigSchema>;
