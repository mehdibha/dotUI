import type { RegistryItem } from "@dotui/registry/types";

const groupMeta = {
  name: "group",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/group/basic.tsx",
          target: "ui/group.tsx",
        },
      ],
      registryDependencies: ["button"],
    },
  },
} satisfies RegistryItem;

export default groupMeta;

export const groupVariants = Object.keys(
  groupMeta.variants,
) as (keyof typeof groupMeta.variants)[];
