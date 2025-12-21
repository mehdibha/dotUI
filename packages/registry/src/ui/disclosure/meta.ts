import type { RegistryItem } from "@dotui/registry/types";

const disclosureMeta = {
  name: "disclosure",
  type: "registry:ui",
  group: "data-display",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/disclosure/basic.tsx",
          target: "ui/disclosure.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default disclosureMeta;

export const disclosureVariants = Object.keys(
  disclosureMeta.variants,
) as (keyof typeof disclosureMeta.variants)[];

export type DisclosureVariant = keyof typeof disclosureMeta.variants;

export const defaultDisclosureVariant = disclosureMeta.defaultVariant;
