import { Theme } from "@/modules/themes/types";

export const defaultTheme: Theme = {
  name: "default",
  label: "Default",
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
};
