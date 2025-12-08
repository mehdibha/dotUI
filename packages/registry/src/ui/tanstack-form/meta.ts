import type { RegistryItem } from "@dotui/registry/types";

const formMeta = {
  name: "form",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/form/basic.tsx",
          target: "ui/form.tsx",
        },
      ],
    },
    "react-hook-form": {
      files: [
        {
          type: "registry:ui",
          path: "ui/form/react-hook-form.tsx",
          target: "ui/form.tsx",
        },
      ],
      dependencies: ["react-hook-form"],
    },
  },
} satisfies RegistryItem;

export default formMeta;
export const formVariants = Object.keys(
  formMeta.variants,
) as (keyof typeof formMeta.variants)[];

export type TanstackFormVariant = keyof typeof formMeta.variants;

export const defaultTanstackFormVariant = formMeta.defaultVariant;
