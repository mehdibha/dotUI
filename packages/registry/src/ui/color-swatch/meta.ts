import type { RegistryItem } from "@dotui/registry/types";

const colorSwatchMeta = {
  name: "color-swatch",
  type: "registry:ui",
  group: "color",
  defaultVariant: "basic",
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

export type ColorSwatchVariant = keyof typeof colorSwatchMeta.variants;

export const defaultColorSwatchVariant = colorSwatchMeta.defaultVariant;
