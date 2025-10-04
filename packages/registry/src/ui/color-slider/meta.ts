import type { RegistryItem } from "@dotui/registry/types";

const colorSliderMeta = {
  name: "color-slider",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/color-slider/basic.tsx",
          target: "ui/color-slider.tsx",
        },
      ],
      registryDependencies: ["field", "color-thumb"],
    },
  },
} satisfies RegistryItem;

export default colorSliderMeta;
export const colorSliderVariants = Object.keys(
  colorSliderMeta.variants,
) as (keyof typeof colorSliderMeta.variants)[];
