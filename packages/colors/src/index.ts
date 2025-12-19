// Unified API
export { createTheme } from "./theme";
export { createThemeOptionsSchema, type CreateThemeOptions } from "./schema";

// Algorithm-specific exports
export {
	createContrastTheme,
	createContrastThemeOptionsSchema,
	type CreateContrastThemeOptions,
} from "./contrast";
export {
	createMaterialTheme,
	createMaterialThemeOptionsSchema,
	type CreateThemeOptions as CreateMaterialThemeOptions,
} from "./material";

// Shared types
export type { ColorScale, Theme, ThemeMode } from "./shared/types";
