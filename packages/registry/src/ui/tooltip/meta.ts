import type { RegistryItem } from "@dotui/registry/types";

const tooltipMeta = {
  name: "tooltip",
  type: "registry:ui",
  defaultVariant: "basic",
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
  },
} satisfies RegistryItem;

export default tooltipMeta;
export const tooltipVariants = Object.keys(
  tooltipMeta.variants,
) as (keyof typeof tooltipMeta.variants)[];

export type TooltipVariant = keyof typeof tooltipMeta.variants;

export const defaultTooltipVariant = tooltipMeta.defaultVariant;
