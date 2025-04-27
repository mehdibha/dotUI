import { Theme } from "@/modules/styles/types";

export const darkyTheme: Theme = {
  name: "darky",
  label: "Darky",
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
      "--color-bg-muted": "var(--color-neutral-100)",
      "--color-bg": "var(--color-neutral-200)",
    },
  },
  variants: {
    global: "primary",
  },
};
