import { createStyle } from "@/modules/styles/lib/create-style";
import { Style } from "@/modules/styles/types";

export const primerTheme: Style = createStyle({
  name: "primer",
  label: "Primer",
  icon: "GitHubIcon",
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
