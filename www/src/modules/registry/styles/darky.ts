import { StyleFoudations } from "@/modules/styles/types";

export const darkyTheme: StyleFoudations = {
  name: "darky",
  label: "Darky",
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
    theme: {
      "color-bg-muted": "var(--color-neutral-100)",
      "color-bg": "var(--color-neutral-200)",
    },
  },
};
