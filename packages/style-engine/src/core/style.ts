import { createTheme } from "./theme";
import { createVariants } from "./variants";
import type { Style, StyleDefinition } from "../types";

export const createStyle = (styleDefinition: StyleDefinition): Style => {
  const { name, slug, description, theme, icons, variants } = styleDefinition;

  return {
    name,
    slug,
    description,
    theme: createTheme(theme),
    icons,
    variants: createVariants(variants),
  };
};
