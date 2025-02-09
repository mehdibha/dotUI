import { Theme } from "@/modules/themes/types";

export const brutalistTheme: Theme = {
  name: "brutalist",
  label: "Brutalist",
  foundations: {
    light: {
      palettes: {
        neutral: {
          baseColors: ["#fff"],
        },
        accent: {
          baseColors: ["#fece00"],
        },
      },
    },
  },
  primitives: {
    button: "brutalist",
  },
  variants: {
    global: "primary",
  },
};
