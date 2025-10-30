import type { RegistryItem } from "@dotui/registry/types";

const accordionMeta = {
  name: "accordion",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/accordion/basic.tsx",
          target: "ui/accordion.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default accordionMeta;

export const accordionVariants = Object.keys(
  accordionMeta.variants,
) as (keyof typeof accordionMeta.variants)[];

export type AccordionVariant = keyof typeof accordionMeta.variants;
