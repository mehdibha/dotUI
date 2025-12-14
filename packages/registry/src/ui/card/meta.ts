import type { RegistryItem } from "@dotui/registry/types";

const cardMeta = {
  name: "card",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/card/basic.tsx",
          target: "ui/card.tsx",
        },
      ],
      registryDependencies: ["button", "text", "focus-styles"],
    },
  },
} satisfies RegistryItem;

export default cardMeta;
export const cardVariants = Object.keys(
  cardMeta.variants,
) as (keyof typeof cardMeta.variants)[];

export type CardVariant = keyof typeof cardMeta.variants;

export const defaultCardVariant = cardMeta.defaultVariant;
