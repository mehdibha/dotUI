/**
 * Schema exports
 *
 * All Zod schemas for validating style configurations.
 */

// Individual schemas
export { colorsConfigSchema, type ColorsConfig } from "./colors";
export { typographyConfigSchema, type TypographyConfig } from "./typography";
export { effectsConfigSchema, type EffectsConfig } from "./effects";
export {
	iconLibrarySchema,
	iconsConfigSchema,
	iconLibraries,
	icons,
	type IconLibrary,
	type IconsConfig,
} from "./icons";
export {
	variantsConfigSchema,
	VARIANTS,
	VARIANT_GROUPS,
	type VariantsConfig,
	type VariantKey,
	type VariantGroupKey,
} from "./variants";
export {
	componentConfigSchema,
	componentsConfigSchema,
	type ComponentConfig,
	type ComponentsConfig,
} from "./components";
export { themeConfigSchema, type ThemeConfig } from "./theme";
export { styleConfigSchema, type StyleConfig } from "./style";
