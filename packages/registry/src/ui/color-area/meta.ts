import type { RegistryItem } from "@dotui/registry/types";

const colorAreaMeta = {
  name: "color-area",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/color-area/basic.tsx",
          target: "ui/color-area.tsx",
        },
      ],
      registryDependencies: ["color-thumb"],
    },
  },
} satisfies RegistryItem;

export default colorAreaMeta;
export const colorAreaVariants = Object.keys(
  colorAreaMeta.variants,
) as (keyof typeof colorAreaMeta.variants)[];
