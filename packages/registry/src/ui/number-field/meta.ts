import type { RegistryItem } from "@dotui/registry/types";

const numberFieldMeta = {
  name: "number-field",
  type: "registry:ui",
  group: "inputs",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/number-field/basic.tsx",
          target: "ui/number-field.tsx",
        },
      ],
      registryDependencies: ["input", "field", "use-is-mobile"],
    },
  },
} satisfies RegistryItem;

export default numberFieldMeta;
export const numberFieldVariants = Object.keys(
  numberFieldMeta.variants,
) as (keyof typeof numberFieldMeta.variants)[];

export type NumberFieldVariant = keyof typeof numberFieldMeta.variants;

export const defaultNumberFieldVariant = numberFieldMeta.defaultVariant;
