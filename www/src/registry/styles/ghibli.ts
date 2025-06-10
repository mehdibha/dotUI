import { createStyle } from "@/modules/styles/lib/create-style";
import type { Style } from "@/modules/styles/types";

export const ghibliTheme: Style = createStyle({
  name: "ghibli",
  label: "Ghibli",
  icon: "GhibliIcon",
  fonts: {
    heading: "Inter",
    body: "Poppins",
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
