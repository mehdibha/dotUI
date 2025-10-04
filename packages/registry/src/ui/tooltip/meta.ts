import type { RegistryItem } from "@dotui/registry/types";

const tooltipMeta = {
  name: "tooltip",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/tooltip/basic.tsx",
          target: "ui/tooltip.tsx",
        },
      ],
    },
    motion: {
      files: [
        {
          type: "registry:ui",
          path: "ui/tooltip/motion.tsx",
          target: "ui/tooltip.tsx",
        },
      ],
      dependencies: ["motion"],
    },
  },
} satisfies RegistryItem;

export default tooltipMeta;
export const tooltipVariants = Object.keys(
  tooltipMeta.variants,
) as (keyof typeof tooltipMeta.variants)[];
