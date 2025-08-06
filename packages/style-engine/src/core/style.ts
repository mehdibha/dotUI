import { createTheme } from "./theme";
import { createVariants } from "./variants";
import type { Style, StyleDefinition } from "../types";

export const createStyle = <T extends StyleDefinition>(
  styleDefinition: T,
): Style & Omit<T, keyof StyleDefinition> => {
  const { theme, icons, variants, ...rest } = styleDefinition;

  return {
    ...rest,
    theme: createTheme(theme),
    icons,
    variants: createVariants(variants),
  } as Style & Omit<T, keyof StyleDefinition>;
};
