import type { RegistryItem } from "@dotui/registry/types";

const colorFieldMeta = {
  name: "color-field",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/color-field/basic.tsx",
          target: "ui/color-field.tsx",
        },
      ],
      registryDependencies: ["field", "input"],
    },
  },
} satisfies RegistryItem;

export default colorFieldMeta;
export const colorFieldVariants = Object.keys(
  colorFieldMeta.variants,
) as (keyof typeof colorFieldMeta.variants)[];
