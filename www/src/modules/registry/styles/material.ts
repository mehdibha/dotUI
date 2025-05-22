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
          baseColors: ["#000"],
        },
        accent: {
          baseColors: ["#0091FF"],
        },
      },
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
