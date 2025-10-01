import type { RegistryItem } from "@dotui/registry/types";

const switchMeta = {
  name: "switch",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/switch/basic.tsx",
          target: "ui/switch.tsx",
        },
      ],
      registryDependencies: ["focus-styles"],
    },
  },
} satisfies RegistryItem;

export default switchMeta;
export const switchVariants = Object.keys(
  switchMeta.variants,
) as (keyof typeof switchMeta.variants)[];
