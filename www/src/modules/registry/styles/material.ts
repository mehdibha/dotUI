import { createStyle } from "@/modules/styles/lib/create-style";
import { Style } from "@/modules/styles/types";

export const materialTheme: Style = createStyle({
  name: "material",
  label: "Material",
  icon: "MuiIcon",
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
          baseColors: ["#101214"],
        },
        accent: {
          baseColors: ["#0273E6"],
        },
      },
      lightness: 7,
    },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  components: {
    button: "ripple",
  },
});
