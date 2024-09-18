import { buildDotUIColorScales } from "@/lib/build-color-scales";
import { RegistryEntry } from "@/registry/schema";

export const defaultTheme: RegistryEntry = {
  name: "theme-default",
  label: "Default theme",
  type: "registry:theme",
  tailwind: {
    config: {
      theme: {
        extend: {
          borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
          },
          colors: {},
        },
      },
    },
  },
  cssVars: {
    light: buildDotUIColorScales("light", {
      neutral: ["#000000"],
      accent: ["#0091FF"],
      primary: ["#000000"],
      success: ["#1A9338"],
      warning: ["#E79D13"],
      danger: ["#D93036"],
    }),
    dark: buildDotUIColorScales("dark", {
      neutral: ["#FFFFFF"],
      accent: ["#0091FF"],
      primary: ["#000000"],
      success: ["#1A9338"],
      warning: ["#E79D13"],
      danger: ["#D93036"],
    }),
  },
};
