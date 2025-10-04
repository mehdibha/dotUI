import type { RegistryItem } from "@dotui/registry/types";

const selectMeta = {
  name: "select",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/select/basic.tsx",
          target: "ui/select.tsx",
        },
      ],
      registryDependencies: ["button", "field", "list-box", "popover"],
    },
  },
} satisfies RegistryItem;

export default selectMeta;
export const selectVariants = Object.keys(
  selectMeta.variants,
) as (keyof typeof selectMeta.variants)[];
