import { mockMinimizedTheme, mockThemeDefinition } from "./themes";
import type {
  MinimizedStyleDefinition,
  StyleDefinition,
} from "../../src/types";

export const mockMinimizedStyle: MinimizedStyleDefinition = {
  theme: mockMinimizedTheme,
  icons: {
    library: "lucide",
    strokeWidth: 1.5,
  },
  variants: {
    buttons: "shine",
    alert: "notch",
  },
};

export const mockStyleDefinition: StyleDefinition = {
  theme: mockThemeDefinition,
  icons: {
    library: "lucide",
    strokeWidth: 1.5,
  },
  variants: {
    alert: "notch",
    buttons: "shine",
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
    link: "basic",
  },
};

export const mockMinimizedStyleWithCustomScales: MinimizedStyleDefinition = {
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
