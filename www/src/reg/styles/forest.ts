import { Theme } from "@/modules/themes/types";

export const forestTheme: Theme = {
  name: "forest",
  label: "Forest",
  foundations: {
    light: {
      palettes: {
        neutral: {
          baseColors: ["#fff"],
        },
        accent: {
          baseColors: ["#3d7b42"],
        },
      },
    },
    dark: {
      palettes: {
        neutral: {
          baseColors: ["#000"],
        },
        accent: {
          baseColors: ["#3d7b42"],
        },
      },
      lightness: 10,
    },
  },
};
