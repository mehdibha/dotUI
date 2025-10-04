import type { RegistryItem } from "@dotui/registry/types";

const colorSwatchMeta = {
  name: "color-swatch",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/color-swatch/basic.tsx",
          target: "ui/color-swatch.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default colorSwatchMeta;
export const colorSwatchVariants = Object.keys(
  colorSwatchMeta.variants,
) as (keyof typeof colorSwatchMeta.variants)[];
