import type { RegistryItem } from "@dotui/registry/types";

const colorThumbMeta = {
  name: "color-thumb",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/color-thumb/basic.tsx",
          target: "ui/color-thumb.tsx",
        },
      ],
      registryDependencies: ["focus-styles"],
    },
  },
} satisfies RegistryItem;

export default colorThumbMeta;
export const colorThumbVariants = Object.keys(
  colorThumbMeta.variants,
) as (keyof typeof colorThumbMeta.variants)[];
