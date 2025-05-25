import { createStyle } from "@/modules/styles/lib/create-style";
import { Style } from "@/modules/styles/types";

export const ghibliTheme: Style = createStyle({
  name: "ghibli",
  label: "Ghibli",
  icon: "GhibliIcon",
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  theme: {
    light: {
      colors: {
        neutral: {
          baseColors: ["#f1dfbe"],
        },
        accent: {
          baseColors: ["#969A54"],
        },
      },
    },
  },
});
