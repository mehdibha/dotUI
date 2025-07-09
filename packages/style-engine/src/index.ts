import {
  DEFAULT_FONTS,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_VARIANTS,
} from "./constants";
import { createTheme } from "./theme";
import type { IconLibrary, Style, StyleDefinition } from "./types";

export function createStyle(styleDefinition: StyleDefinition): Style {
  const style: Style = {
    name: styleDefinition.name,
    slug: styleDefinition.slug,
    description: styleDefinition.description,
    iconLibrary: (styleDefinition.iconLibrary ??
      DEFAULT_ICON_LIBRARY) as IconLibrary,
    fonts: { ...DEFAULT_FONTS, ...styleDefinition.fonts },
    variants: { ...DEFAULT_VARIANTS, ...styleDefinition.variants },
    theme: createTheme(styleDefinition.theme ?? {}),
  };

  return style;
}

export { createTheme };
