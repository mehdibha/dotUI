import type { RegistryItem } from "@dotui/registry/types";

const tableMeta = {
  name: "table",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/table/basic.tsx",
          target: "ui/table.tsx",
        },
      ],
      registryDependencies: ["checkbox", "focus-styles"],
    },
  },
} satisfies RegistryItem;

export default tableMeta;
export const tableVariants = Object.keys(
  tableMeta.variants,
) as (keyof typeof tableMeta.variants)[];
