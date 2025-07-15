import type {
  MinimizedModeDefinition,
  MinimizedThemeDefinition,
  ThemeDefinition,
} from "../../src/types";

export const mockMinimizedLightMode: MinimizedModeDefinition = {
  mode: "light",
  // Uses defaults for lightness, saturation, contrast
  scales: [
    {
      id: "accent",
      colorKeys: ["#FF6B6B"], // Custom accent color
    },
  ],
};

export const mockMinimizedDarkMode: MinimizedModeDefinition = {
  mode: "dark",
  lightness: 5, // Custom lightness
  scales: [
    {
      id: "accent",
      colorKeys: ["#FF6B6B"],
    },
    {
      id: "brand", // Custom scale
      name: "Brand",
      colorKeys: ["#8B5CF6"],
      ratios: [1.5, 2.0, 3.0, 4.0],
    },
  ],
};

export const mockMinimizedTheme: MinimizedThemeDefinition = {
  colors: {
    modes: [mockMinimizedLightMode, mockMinimizedDarkMode],
  },
  radius: 1.2,
  spacing: 0.3,
};

export const mochThemeDefintion: ThemeDefinition = {
  colors: {
    modes: [
      {
        mode: "light",
        lightness: 97,
        saturation: 100,
        contrast: 100,
        scales: [
          {
            id: "neutral",
            name: "Neutral",
            colorKeys: [{ id: 0, color: "#000000" }],
            ratios: [1.05, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "accent",
            name: "Accent",
            colorKeys: [{ id: 0, color: "#FF6B6B" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "success",
            name: "Success",
            colorKeys: [{ id: 0, color: "#1A9338" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "warning",
            name: "Warning",
            colorKeys: [{ id: 0, color: "#E79D13" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "danger",
            name: "Danger",
            colorKeys: [{ id: 0, color: "#D93036" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "info",
            name: "Info",
            colorKeys: [{ id: 0, color: "#0091FF" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
        ],
      },
      {
        mode: "dark",
        lightness: 5,
        saturation: 100,
        contrast: 100,
        scales: [
          {
            id: "neutral",
            name: "Neutral",
            colorKeys: [{ id: 0, color: "#ffffff" }],
            ratios: [1, 1.25, 1.7, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "accent",
            name: "Accent",
            colorKeys: [{ id: 0, color: "#FF6B6B" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "success",
            name: "Success",
            colorKeys: [{ id: 0, color: "#1A9338" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "warning",
            name: "Warning",
            colorKeys: [{ id: 0, color: "#E79D13" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "danger",
            name: "Danger",
            colorKeys: [{ id: 0, color: "#D93036" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "info",
            name: "Info",
            colorKeys: [{ id: 0, color: "#0091FF" }],
            ratios: [1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
            overrides: {},
          },
          {
            id: "brand",
            name: "Brand",
            colorKeys: [{ id: 0, color: "#8B5CF6" }],
            ratios: [1.5, 2.0, 3.0, 4.0],
            overrides: {},
          },
        ],
      },
    ],
    tokens: [
      { id: "color-bg", name: "color-bg", value: "var(--neutral-100)" },
      {
        id: "color-bg-muted",
        name: "color-bg-muted",
        value: "var(--neutral-200)",
      },
      { id: "color-fg", name: "color-fg", value: "var(--neutral-1000)" },
      {
        id: "color-fg-muted",
        name: "color-fg-muted",
        value: "var(--neutral-800)",
      },
    ],
  },
  radius: 1.2,
  spacing: 0.3,
  fonts: { heading: "Inter", body: "Inter" },
  letterSpacing: 0,
  backgroundPattern: "none",
  texture: "none",
  shadows: "default",
};
