import { Theme } from "@/modules/styles/types";

export const retroTheme: Theme = {
  name: "retro",
  label: "Retro",
  foundations: {
    light: {
      palettes: {
        neutral: {
          baseColors: ["#E79D13"],
          // ratios: [1.5, 1.8, 2, 2.5, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2],
        },
        accent: {
          baseColors: ["#d56309"],
        },
      },
      lightness: 98,
      saturation: 100,
    },
  },
  variants: {
    global: "accent",
  },
};
