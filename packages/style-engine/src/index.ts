import { DEFAULT_FONTS, DEFAULT_VARIANTS } from "./constants";
import type { Fonts, IconLibrary, Style, ThemeDefinition, Variants } from "./types";

interface RawStyle {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  iconLibrary: string;
  fonts: Partial<Fonts> | null;
  variants: Partial<Variants> | null;
  theme: ThemeDefinition;
}

export function createStyle(rawStyle: RawStyle | null): Style | null {
  if (!rawStyle) {
    return null;
  }

  const style: Style = {
    name: rawStyle.name,
    slug: rawStyle.slug,
    description: rawStyle.description,
    iconLibrary: rawStyle.iconLibrary as IconLibrary,
    fonts: { ...DEFAULT_FONTS, ...rawStyle.fonts } as Fonts,
    variants: { ...DEFAULT_VARIANTS, ...rawStyle.variants } as Variants,
    theme: rawStyle.theme,
  };

  return style;
}
