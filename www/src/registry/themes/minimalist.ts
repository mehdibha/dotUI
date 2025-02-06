import { Theme } from "@/modules/themes/types";

export const minimalistTheme: Theme = {
  name: "minimalist",
  label: "Minimalist",
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
  },
  variants: {
    global: "primary",
  },
};
