import { Theme } from "@/modules/styles/types";

export const highContrastTheme: Theme = {
  name: "high-contrast",
  label: "High contrast",
  foundations: {
    light: {
      palettes: {
        neutral: {
          baseColors: ["#fff"],
        },
        accent: {
          baseColors: ["#0091FF"],
        },
      },
    },
    dark: {
      palettes: {
        neutral: {
          baseColors: ["#000"],
        },
        accent: {
          baseColors: ["#0091FF"],
        },
      },
    },
    overrides: {
      "--color-border": "var(--color-neutral-500)",
      "--color-border-field": "var(--color-neutral-600)",
    },
  },
  variants: {
    global: "primary",
  },
};
