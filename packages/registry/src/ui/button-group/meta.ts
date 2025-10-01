import type { RegistryItem } from "@dotui/registry/types";

const buttonGroupMeta = {
  name: "button-group",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/button-group/basic.tsx",
          target: "ui/button-group.tsx",
        },
      ],
      registryDependencies: ["button"],
    },
  },
} satisfies RegistryItem;

export default buttonGroupMeta;
export const buttonGroupVariants = Object.keys(
  buttonGroupMeta.variants,
) as (keyof typeof buttonGroupMeta.variants)[];
