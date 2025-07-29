import { createTheme } from "./theme";
import { createVariants } from "./variants";
import type { Style, StyleDefinition } from "../types";

export const createStyle = (styleDefinition: StyleDefinition): Style => {
  const { theme, icons, variants } = styleDefinition;

  return {
    theme: createTheme(theme),
    icons,
    variants: createVariants(variants),
  };
};
