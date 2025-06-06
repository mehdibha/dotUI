import { createStyle } from "@/modules/styles/lib/create-style";
import { Style } from "@/modules/styles/types";

export const polarisTheme: Style = createStyle({
  name: "polaris",
  label: "Polaris",
  icon: "ShopifyIcon",
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
});
