import type { Style } from "@/modules/styles/types";
import { createStyle } from "@/modules/styles/lib/create-style";

export const brutalistTheme: Style = createStyle({
  name: "brutalist",
  label: "Brutalist",
  // icon: "VercelIcon",
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
  },
  components: {
    button: "brutalist",
  },
  preferences: {
    defaultColorScheme: "primary",
  },
});
