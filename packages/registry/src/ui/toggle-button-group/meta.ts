import type { RegistryItem } from "@dotui/registry/types";

const toggleButtonGroupMeta = {
  name: "toggle-button-group",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/toggle-button-group/basic.tsx",
          target: "ui/toggle-button-group.tsx",
        },
      ],
      registryDependencies: ["toggle-button"],
    },
  },
} satisfies RegistryItem;

export default toggleButtonGroupMeta;
export const toggleButtonGroupVariants = Object.keys(
  toggleButtonGroupMeta.variants,
) as (keyof typeof toggleButtonGroupMeta.variants)[];
