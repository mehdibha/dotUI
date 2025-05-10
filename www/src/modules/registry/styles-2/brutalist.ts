import { StyleFoudations } from "@/modules/styles-2/types";

export const brutalistTheme: StyleFoudations = {
  name: "brutalist",
  label: "Brutalist",
  fonts: {
    heading: "Geist Mono",
    body: "Geist Mono",
  },
  theme: {
    light: {
      colors: {
        neutral: {
          baseColors: ["#fff"],
        },
        accent: {
          baseColors: ["#fece00"],
        },
      },
    },
  },
  components: {
    button: "brutalist",
  },
};
