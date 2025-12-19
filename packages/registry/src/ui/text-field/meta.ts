import type { RegistryItem } from "@dotui/registry/types";

const textFieldMeta = {
  name: "text-field",
  type: "registry:ui",
  group: "inputs",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/text-field/basic.tsx",
          target: "ui/text-field.tsx",
        },
      ],
      registryDependencies: ["field", "input"],
    },
  },
} satisfies RegistryItem;

export default textFieldMeta;
export const textFieldVariants = Object.keys(
  textFieldMeta.variants,
) as (keyof typeof textFieldMeta.variants)[];

export type TextFieldVariant = keyof typeof textFieldMeta.variants;

export const defaultTextFieldVariant = textFieldMeta.defaultVariant;
