import type { RegistryItem } from "@dotui/registry/types";

const drawerMeta = {
  name: "drawer",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/drawer/basic.tsx",
          target: "ui/drawer.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default drawerMeta;
export const drawerVariants = Object.keys(
  drawerMeta.variants,
) as (keyof typeof drawerMeta.variants)[];
