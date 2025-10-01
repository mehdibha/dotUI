import type { RegistryItem } from "@dotui/registry/types";

const overlayMeta = {
  name: "overlay",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/overlay/basic.tsx",
          target: "ui/overlay.tsx",
        },
      ],
      registryDependencies: ["modal", "popover", "drawer", "use-is-mobile"],
    },
  },
} satisfies RegistryItem;

export default overlayMeta;
export const overlayVariants = Object.keys(
  overlayMeta.variants,
) as (keyof typeof overlayMeta.variants)[];
