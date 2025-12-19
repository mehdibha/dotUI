/**
 * Re-export constants from style-system
 */
export {
  DEFAULT_LIGHT_MODE,
  DEFAULT_DARK_MODE,
  DEFAULT_FONTS,
  DEFAULT_VARIANTS_DEFINITION,
  DEFAULT_RADIUS_FACTOR,
  DEFAULT_SPACING,
  DEFAULT_LETTER_SPACING,
  DEFAULT_BACKGROUND_PATTERN,
  DEFAULT_TEXTURE,
  DEFAULT_SHADOWS,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_ICON_STROKE_WIDTH,
  DEFAULT_ACCENT_EMPHASIS_LEVEL,
} from "@dotui/style-system/utils";

import type { StyleConfig } from "@dotui/core/schemas";

/**
 * Default style configuration
 */
export const DEFAULT_STYLE: StyleConfig = {
  theme: {
    colors: {
      algorithm: "material",
      palettes: {
        primary: "#0091FF",
        neutral: "#8B8D98",
      },
      modes: {
        light: true,
        dark: true,
      },
    },
    radius: 1,
    spacing: 0.25,
    typography: {
      font: "Inter",
    },
  },
  icons: {
    library: "lucide",
    strokeWidth: 2,
  },
  variants: {},
};

/**
 * Default theme configuration (alias for DEFAULT_STYLE.theme)
 */
export const DEFAULT_THEME = DEFAULT_STYLE.theme;
