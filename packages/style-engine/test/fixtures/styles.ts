import { mochThemeDefintion, mockMinimizedTheme } from "./themes";
import type {
  MinimizedStyleDefinition,
  Style,
  StyleDefinition,
} from "../../src/types";

export const mockMinimizedStyle: MinimizedStyleDefinition = {
  name: "Test Theme",
  slug: "test-theme",
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
  name: "Test Theme",
  slug: "test-theme",
  description: "A test theme for unit testing",
  theme: mochThemeDefintion,
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
  name: "Custom Theme",
  slug: "custom-theme",
  theme: {
    colors: {
      modes: [
        {
          mode: "light",
          scales: [
            {
              id: "brand",
              name: "Brand Primary",
              colorKeys: ["#8B5CF6"],
              ratios: [1.2, 1.5, 2.0, 3.0],
            },
            {
              id: "secondary",
              name: "Secondary",
              colorKeys: ["#F59E0B"],
            },
          ],
        },
      ],
    },
  },
  icons: {
    library: "lucide",
    strokeWidth: 2,
  },
  variants: {},
};
