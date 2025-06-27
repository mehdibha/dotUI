import type { StyleDefinition } from "./types";
import {
  DEFAULT_STYLE_DEFINITION,
  getDifferencesFromDefaults,
} from "./constants/defaults";

/**
 * Pre-built style configurations that extend the defaults
 */

export const MINIMAL_STYLE: StyleDefinition = {
  ...DEFAULT_STYLE_DEFINITION,
  // Uses all defaults - completely minimal
};

export const BRUTALIST_STYLE: StyleDefinition = {
  ...DEFAULT_STYLE_DEFINITION,
  variants: {
    ...DEFAULT_STYLE_DEFINITION.variants,
    button: "brutalist",
    modal: "blur",
    tabs: "motion",
    tooltip: "motion",
  },
};

export const REMIX_STYLE: StyleDefinition = {
  ...DEFAULT_STYLE_DEFINITION,
  iconLibrary: "remix-icons",
};

export const MODERN_STYLE: StyleDefinition = {
  ...DEFAULT_STYLE_DEFINITION,
  fonts: {
    heading: "Outfit",
    body: "Inter",
  },
  variants: {
    ...DEFAULT_STYLE_DEFINITION.variants,
    button: "outline",
    modal: "blur",
    tabs: "motion",
    tooltip: "motion",
    loader: "ring",
  },
};

/**
 * Get the storage-optimized versions (only differences from defaults)
 */
export const PRESET_STORAGE_DATA = {
  minimal: getDifferencesFromDefaults(MINIMAL_STYLE),
  brutalist: getDifferencesFromDefaults(BRUTALIST_STYLE),
  remix: getDifferencesFromDefaults(REMIX_STYLE),
  modern: getDifferencesFromDefaults(MODERN_STYLE),
};

/**
 * All available preset styles
 */
export const PRESET_STYLES = {
  minimal: MINIMAL_STYLE,
  brutalist: BRUTALIST_STYLE,
  remix: REMIX_STYLE,
  modern: MODERN_STYLE,
} as const;

export type PresetStyleName = keyof typeof PRESET_STYLES;
