import type { z } from "zod";

import type { createStyleSchema } from "./schemas";
import { restoreStyleDefinitionDefaults } from "@dotui/style-engine/utils";

export const DEFAULT_STYLES: Omit<
  z.infer<typeof createStyleSchema>,
  "userId"
>[] = [
  restoreStyleDefinitionDefaults({
    name: "minimalist",
    theme: {
      colors: {
        activeModes: ["light", "dark"],
      },
    },
  }),
  {
    name: "material",
    theme: {
      colors: {
        activeModes: ["light"],
        modes: {
          light: {
            lightness: 97,
            saturation: 100,
            contrast: 100,
            scales: {
              neutral: {
                name: "Neutral",
                colorKeys: ["#000000"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              accent: {
                name: "Accent",
                colorKeys: ["#0091FF"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              success: {
                name: "Success",
                colorKeys: ["#1A9338"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              warning: {
                name: "Warning",
                colorKeys: ["#E79D13"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              danger: {
                name: "Danger",
                colorKeys: ["#D93036"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              info: {
                name: "Info",
                colorKeys: ["#0091FF"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
            },
          },
        },
      },
      radius: 1,
      spacing: 0.25,
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      letterSpacing: 0,
      backgroundPattern: "none",
      texture: "none",
      shadows: {
        color: "#000000",
        opacity: 0.1,
        blurRadius: 10,
        offsetX: 0,
        offsetY: 1,
        spread: 0,
      },
    },
    icons: {
      library: "lucide",
      strokeWidth: 1.5,
    },
    variants: {
      buttons: "ripple",
    },
  },
  {
    name: "ghibli",
    theme: {
      colors: {
        activeModes: ["light"],
        modes: {
          light: {
            lightness: 97,
            saturation: 100,
            contrast: 100,
            scales: {
              neutral: {
                name: "Neutral",
                colorKeys: ["#f1dfbe"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              accent: {
                name: "Accent",
                colorKeys: ["#969A54"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              success: {
                name: "Success",
                colorKeys: ["#1A9338"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              warning: {
                name: "Warning",
                colorKeys: ["#E79D13"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              danger: {
                name: "Danger",
                colorKeys: ["#D93036"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
              info: {
                name: "Info",
                colorKeys: ["#0091FF"],
                ratios: [
                  1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2,
                ],
                overrides: {},
              },
            },
          },
        },
      },
      radius: 1,
      spacing: 0.25,
      fonts: {
        heading: "Inter",
        body: "Poppins",
      },
      letterSpacing: 0,
      backgroundPattern: "none",
      texture: "none",
      shadows: {
        color: "#000000",
        opacity: 0.1,
        blurRadius: 10,
        offsetX: 0,
        offsetY: 1,
        spread: 0,
      },
    },
    icons: {
      library: "lucide",
      strokeWidth: 1.5,
    },
    variants: {},
  },
];
