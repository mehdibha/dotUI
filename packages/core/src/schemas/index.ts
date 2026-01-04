/**
 * Schema exports
 *
 * All Zod schemas for validating style configurations.
 */

// Individual schemas
export { type ColorsConfig, colorsConfigSchema } from "./colors";
export {
	type ComponentConfig,
	type ComponentsConfig,
	componentConfigSchema,
	componentsConfigSchema,
} from "./components";
export { type EffectsConfig, effectsConfigSchema } from "./effects";
export {
	type IconLibrary,
	type IconsConfig,
	iconLibraries,
	iconLibrarySchema,
	icons,
	iconsConfigSchema,
} from "./icons";
export { type StyleConfig, styleConfigSchema } from "./style";
export { type ThemeConfig, themeConfigSchema } from "./theme";
export { type TypographyConfig, typographyConfigSchema } from "./typography";
export {
	VARIANT_GROUPS,
	VARIANTS,
	type VariantGroupKey,
	type VariantKey,
	type VariantsConfig,
	variantsConfigSchema,
} from "./variants";
