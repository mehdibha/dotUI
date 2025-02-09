import { Theme } from "@/modules/themes/types";

export const materialTheme: Theme = {
  name: "material",
  label: "Material",
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
  primitives: {
    button: "ripple",
  },
};
