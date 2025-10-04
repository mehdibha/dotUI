import type { RegistryItem } from "@dotui/registry/types";

const kbdMeta = {
  name: "kbd",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/kbd/basic.tsx",
          target: "ui/kbd.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default kbdMeta;
export const kbdVariants = Object.keys(
  kbdMeta.variants,
) as (keyof typeof kbdMeta.variants)[];
