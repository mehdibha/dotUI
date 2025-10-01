import type { RegistryItem } from "@dotui/registry/types";

const radioGroupMeta = {
  name: "radio-group",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/radio-group/basic.tsx",
          target: "ui/radio-group.tsx",
        },
      ],
      registryDependencies: ["focus-styles", "field"],
    },
  },
} satisfies RegistryItem;

export default radioGroupMeta;
export const radioGroupVariants = Object.keys(
  radioGroupMeta.variants,
) as (keyof typeof radioGroupMeta.variants)[];
