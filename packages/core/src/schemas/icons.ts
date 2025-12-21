import { z } from "zod";

import { iconLibraries } from "@dotui/core/__registry__/icons";

// Extract library names from registry (single source of truth)
const ICON_LIBRARY_NAMES = iconLibraries.map((lib) => lib.name) as [string, ...string[]];

export const iconLibrarySchema = z.enum(ICON_LIBRARY_NAMES);

export const iconsConfigSchema = z.object({
	/** Icon library to use */
	library: iconLibrarySchema,
	/** Default stroke width for icons */
	strokeWidth: z.number().default(2),
});

export type IconLibrary = (typeof iconLibraries)[number]["name"];
export type IconsConfig = z.infer<typeof iconsConfigSchema>;

// Re-export registry icons for convenience
export { iconLibraries, icons } from "@dotui/core/__registry__/icons";
