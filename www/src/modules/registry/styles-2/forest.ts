import { StyleFoudations } from "@/modules/styles-2/types";

export const forestTheme: StyleFoudations = {
  name: "forest",
  label: "Forest",
  theme: {
    light: {
      colors: {
        neutral: {
          baseColors: ["#fff"],
        },
        accent: {
          baseColors: ["#3d7b42"],
        },
      },
    },
    dark: {
      lightness: 10,
      colors: {
        neutral: {
          baseColors: ["#000"],
        },
        accent: {
          baseColors: ["#3d7b42"],
        },
      },
    },
  },
};
