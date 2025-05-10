import { StyleFoudations } from "@/modules/styles-2/types";

export const materialTheme: StyleFoudations = {
  name: "material",
  label: "Material",
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
};
