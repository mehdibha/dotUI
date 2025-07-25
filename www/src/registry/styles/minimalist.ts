import type { Style } from "@/modules/styles/types";
import { createStyle } from "@/modules/styles/lib/create-style";

export const minimalistTheme: Style = createStyle({
  name: "minimalist",
  label: "Minimalist",
  icon: "ShadcnIcon",
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
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
  },
  preferences: {
    defaultColorScheme: "primary",
  },
});
