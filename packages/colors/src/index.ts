// Unified API

// Algorithm-specific exports
export {
	type CreateContrastThemeOptions,
	createContrastTheme,
	createContrastThemeOptionsSchema,
} from "./contrast";
export {
	type CreateThemeOptions as CreateMaterialThemeOptions,
	createMaterialTheme,
	createMaterialThemeOptionsSchema,
} from "./material";
export { type CreateThemeOptions, createThemeOptionsSchema } from "./schema";
export { createTheme } from "./theme";
// Shared types
export type { ColorScale, Theme, ThemeMode } from "./shared/types";
