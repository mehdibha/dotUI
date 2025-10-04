import type { RegistryItem } from "@dotui/registry/types";

const menuMeta = {
  name: "menu",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/menu/basic.tsx",
          target: "ui/menu.tsx",
        },
      ],
      registryDependencies: ["kbd", "overlay", "text"],
    },
  },
} satisfies RegistryItem;

export default menuMeta;
export const menuVariants = Object.keys(
  menuMeta.variants,
) as (keyof typeof menuMeta.variants)[];
