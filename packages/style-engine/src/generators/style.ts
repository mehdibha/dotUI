import type { ComputedStyle, StyleDefinition } from "../types";
import {
  DEFAULT_DESIGN_TOKENS,
  DEFAULT_ICON_LIBRARY,
  DEFAULT_REGISTRY_VARIANTS,
  DEFAULT_TYPOGRAPHY,
} from "../constants";
import { createTheme } from "./theme";

export const createStyle = (
  definition: StyleDefinition,
  metadata: {
    name: string;
    label: string;
    icon?: string;
  },
): ComputedStyle => {
  return {
    name: metadata.name,
    label: metadata.label,
    icon: metadata.icon,
    theme: createTheme(definition.theme),
    typography: {
      ...DEFAULT_TYPOGRAPHY,
      ...definition.typography,
    },
    registryVariants: {
      ...DEFAULT_REGISTRY_VARIANTS,
      ...definition.registryVariants,
    },
    designTokens: {
      ...DEFAULT_DESIGN_TOKENS,
      ...definition.designTokens,
    },
    iconLibrary: definition.iconLibrary ?? DEFAULT_ICON_LIBRARY,
  };
};
