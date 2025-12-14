import type { RegistryItem } from "@dotui/registry/types";

const comboboxMeta = {
  name: "combobox",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/combobox/basic.tsx",
          target: "ui/combobox.tsx",
        },
      ],
      registryDependencies: ["field", "button", "input", "list-box", "overlay"],
    },
  },
} satisfies RegistryItem;

export default comboboxMeta;
export const comboboxVariants = Object.keys(
  comboboxMeta.variants,
) as (keyof typeof comboboxMeta.variants)[];

export type ComboboxVariant = keyof typeof comboboxMeta.variants;

export const defaultComboboxVariant = comboboxMeta.defaultVariant;
