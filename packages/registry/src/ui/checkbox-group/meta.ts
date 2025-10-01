import type { RegistryItem } from "@dotui/registry/types";

const checkboxGroupMeta = {
  name: "checkbox-group",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/checkbox-group/basic.tsx",
          target: "ui/checkbox-group.tsx",
        },
      ],
      registryDependencies: ["field", "checkbox"],
    },
  },
} satisfies RegistryItem;

export default checkboxGroupMeta;
export const checkboxGroupVariants = Object.keys(
  checkboxGroupMeta.variants,
) as (keyof typeof checkboxGroupMeta.variants)[];
