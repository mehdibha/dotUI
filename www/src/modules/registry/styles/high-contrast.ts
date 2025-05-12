import { StyleFoudations } from "@/modules/styles/types";

export const highContrastTheme: StyleFoudations = {
  name: "high-contrast",
  label: "High contrast",
  theme: {
    light: {
      colors: {
        neutral: {
          baseColors: ["#fff"],
        },
        accent: {
          baseColors: ["#0091FF"],
        },
      },
    },
    dark: {
      colors: {
        neutral: {
          baseColors: ["#000"],
        },
        accent: {
          baseColors: ["#0091FF"],
        },
      },
    },
    theme: {
      "color-border": "var(--color-neutral-500)",
      "color-border-field": "var(--color-neutral-600)",
    },
  },
};
