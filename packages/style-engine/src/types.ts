import type { z } from "zod";

import type * as schemas from "./schemas";

// utils
export type Css = z.infer<typeof schemas.CssSchema>;

// icons
export type IconLibrary = z.infer<typeof schemas.iconLibrarySchema>;
export type IconsDefinition = z.infer<typeof schemas.iconsDefinitionSchema>;
export type MinimizedIconsDefinition = z.infer<
  typeof schemas.minimizedIconsDefinitionSchema
>;

// colors
export type ColorScale = z.infer<typeof schemas.colorScaleSchema>;
export type ModeDefinition = z.infer<typeof schemas.modeDefinitionSchema>;
export type MinimizedColorScale = z.infer<
  typeof schemas.minimizedColorScaleSchema
>;
export type MinimizedModeDefinition = z.infer<
  typeof schemas.minimizedModeDefinitionSchema
>;
export type MinimizedColorTokens = z.infer<
  typeof schemas.minimizedColorTokensSchema
>;
export type ColorTokens = z.infer<typeof schemas.colorTokensSchema>;

// layout
export type Radius = z.infer<typeof schemas.radiusSchema>;
export type Spacing = z.infer<typeof schemas.spacingSchema>;

// typography
export type Fonts = z.infer<typeof schemas.fontsSchema>;
export type LetterSpacing = z.infer<typeof schemas.letterSpacingSchema>;

// effects
export type BackgroundPattern = z.infer<typeof schemas.backgroundPatternSchema>;
export type Texture = z.infer<typeof schemas.textureSchema>;
export type Shadows = z.infer<typeof schemas.shadowsSchema>;

// theme
export type MinimizedThemeDefinition = z.infer<
  typeof schemas.minimizedThemeDefinitionSchema
>;
export type ThemeDefinition = z.infer<typeof schemas.themeDefinitionSchema>;
export type Theme = z.infer<typeof schemas.themeSchema>;

// variants
export type MinimizedVariantsDefinition = z.infer<
  typeof schemas.minimizedVariantsDefinitionSchema
>;
export type VariantsDefinition = z.infer<
  typeof schemas.variantsDefinitionSchema
>;
export type Variants = z.infer<typeof schemas.variantsSchema>;

// style
export type MinimizedStyleDefinition = z.infer<
  typeof schemas.minimizedStyleDefinitionSchema
>;
export type StyleDefinition = z.infer<typeof schemas.styleDefinitionSchema>;
export type Style = z.infer<typeof schemas.styleSchema>;
