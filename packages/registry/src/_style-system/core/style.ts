import { createTheme } from "./theme";
import { createVariants } from "./variants";
import type { ColorFormat, Style, StyleDefinition } from "../types";

export const createStyle = <T extends StyleDefinition>(
  styleDefinition: T,
  generateContrastColors = true,
  colorFormat: ColorFormat = "oklch",
): Style & Omit<T, keyof StyleDefinition> => {
  const { theme, icons, variants, ...rest } = styleDefinition;

  return {
    ...rest,
    theme: createTheme(theme, generateContrastColors, colorFormat),
    icons,
    variants: createVariants(variants),
  } as Style & Omit<T, keyof StyleDefinition>;
};
