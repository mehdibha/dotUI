import type { RegistryItem } from "@dotui/registry/types";

const modalMeta = {
  name: "modal",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/modal/basic.tsx",
          target: "ui/modal.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default modalMeta;
export const modalVariants = Object.keys(
  modalMeta.variants,
) as (keyof typeof modalMeta.variants)[];
