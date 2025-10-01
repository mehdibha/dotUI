import type { RegistryItem } from "@dotui/registry/types";

const fieldMeta = {
  name: "field",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/field/basic.tsx",
          target: "ui/field.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default fieldMeta;
export const fieldVariants = Object.keys(
  fieldMeta.variants,
) as (keyof typeof fieldMeta.variants)[];
