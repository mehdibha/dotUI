import type { RegistryItem } from "@dotui/registry/types";

const dateFieldMeta = {
  name: "date-field",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/date-field/basic.tsx",
          target: "ui/date-field.tsx",
        },
      ],
      registryDependencies: ["field", "input"],
    },
  },
} satisfies RegistryItem;

export default dateFieldMeta;
export const dateFieldVariants = Object.keys(
  dateFieldMeta.variants,
) as (keyof typeof dateFieldMeta.variants)[];
