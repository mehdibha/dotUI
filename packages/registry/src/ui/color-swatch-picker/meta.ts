import type { RegistryItem } from "@dotui/registry/types";

const colorSwatchPickerMeta = {
  name: "color-swatch-picker",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/color-swatch-picker/basic.tsx",
          target: "ui/color-swatch-picker.tsx",
        },
      ],
      registryDependencies: ["focus-styles", "color-swatch"],
    },
  },
} satisfies RegistryItem;

export default colorSwatchPickerMeta;

export const colorSwatchPickerVariants = Object.keys(
  colorSwatchPickerMeta.variants,
) as (keyof typeof colorSwatchPickerMeta.variants)[];
