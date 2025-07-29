import { mockMinimizedTheme, mockThemeDefinition } from "./themes";
import type {
  MinimizedStyleDefinition,
  StyleDefinition,
} from "../../src/types";

export const mockMinimizedStyle: MinimizedStyleDefinition = {
  name: "test-theme",
  description: "A test theme for unit testing",
  theme: mockMinimizedTheme,
  icons: {
    library: "lucide",
    strokeWidth: 1.5,
  },
  variants: {
    buttons: "brutalist",
    alert: "notch",
  },
};

export const mockStyleDefinition: StyleDefinition = {
  name: "test-theme",
  description: "A test theme for unit testing",
  theme: mockThemeDefinition,
  icons: {
    library: "lucide",
    strokeWidth: 1.5,
  },
  variants: {
    alert: "notch",
    buttons: "brutalist",
    loader: "ring",
    "focus-style": "basic",
    inputs: "basic",
    pickers: "basic",
    selection: "basic",
    calendars: "basic",
    "list-box-and-menu": "basic",
    overlays: "basic",
    checkboxes: "basic",
    radios: "basic",
    switch: "basic",
    slider: "basic",
    "badge-and-tag-group": "basic",
    tooltip: "basic",
  },
};

export const mockMinimizedStyleWithCustomScales: MinimizedStyleDefinition = {
  name: "custom-theme",
  theme: {
    colors: {
      modes: {
        light: {
          scales: {},
        },
      },
    },
  },
  icons: {
    library: "lucide",
    strokeWidth: 2,
  },
  variants: {},
};
