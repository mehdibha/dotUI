import type { RegistryItem } from "@dotui/registry/types";

const dialogMeta = {
  name: "dialog",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/dialog/basic.tsx",
          target: "ui/dialog.tsx",
        },
      ],
      registryDependencies: ["overlay"],
    },
  },
} satisfies RegistryItem;

export default dialogMeta;
export const dialogVariants = Object.keys(
  dialogMeta.variants,
) as (keyof typeof dialogMeta.variants)[];
