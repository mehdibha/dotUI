import type { z } from "zod";

import { restoreStyleDefinitionDefaults } from "@dotui/registry/__style-system__/utils";

import type { createStyleSchema } from "./schemas";

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
  // restoreStyleDefinitionDefaults({
  //   name: "material",
  //   theme: {
  //     colors: {
  //       activeModes: ["light", "dark"],
  //       modes: {
  //         light: {
  //           scales: {
  //             neutral: {
  //               colorKeys: ["#000000"],
  //             },
  //             accent: {
  //               colorKeys: ["#0091FF"],
  //             },
  //           },
  //         },
  //         dark: {
  //           scales: {
  //             neutral: {
  //               colorKeys: ["#ffffff"],
  //             },
  //             accent: {
  //               colorKeys: ["#0091FF"],
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   variants: {
  //     buttons: "ripple",
  //   },
  // }),
  // restoreStyleDefinitionDefaults({
  //   name: "ghibli",
  //   theme: {
  //     colors: {
  //       activeModes: ["light"],
  //       modes: {
  //         light: {
  //           scales: {
  //             neutral: {
  //               colorKeys: ["#f1dfbe"],
  //             },
  //             accent: {
  //               colorKeys: ["#969A54"],
  //             },
  //           },
  //         },
  //       },
  //     },
  //     fonts: {
  //       body: "Poppins",
  //     },
  //   },
  // }),
];
