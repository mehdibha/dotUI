import type { RegistryItem } from "@dotui/registry/types";

const sliderMeta = {
  name: "slider",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/slider/basic.tsx",
          target: "ui/slider.tsx",
        },
      ],
      registryDependencies: ["field", "focus-styles"],
      dependencies: ["@react-aria/utils"],
    },
  },
} satisfies RegistryItem;

export default sliderMeta;
export const sliderVariants = Object.keys(
  sliderMeta.variants,
) as (keyof typeof sliderMeta.variants)[];
