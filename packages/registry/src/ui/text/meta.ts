import type { RegistryItem } from "@dotui/registry/types";

const textMeta = {
  name: "text",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/text/basic.tsx",
          target: "ui/text.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default textMeta;
export const textVariants = Object.keys(
  textMeta.variants,
) as (keyof typeof textMeta.variants)[];
