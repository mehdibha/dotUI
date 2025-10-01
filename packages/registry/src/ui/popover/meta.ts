import type { RegistryItem } from "@dotui/registry/types";

const popoverMeta = {
  name: "popover",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/popover/basic.tsx",
          target: "ui/popover.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default popoverMeta;
export const popoverVariants = Object.keys(
  popoverMeta.variants,
) as (keyof typeof popoverMeta.variants)[];
