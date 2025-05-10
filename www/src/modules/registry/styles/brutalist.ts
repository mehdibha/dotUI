import { Theme } from "@/modules/styles/types";

export const brutalistTheme: Theme = {
  name: "brutalist",
  label: "Brutalist",
  fonts: {
    heading: "Geist Mono",
    body: "Geist Mono",
  },
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
