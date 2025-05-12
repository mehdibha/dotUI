import { StyleFoudations } from "@/modules/styles/types";

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
