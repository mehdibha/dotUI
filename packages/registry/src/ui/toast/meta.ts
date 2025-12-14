import type { RegistryItem } from "@dotui/registry/types";

const toastMeta = {
  name: "toast",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/toast/basic.tsx",
          target: "ui/toast.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default toastMeta;
export const toastVariants = Object.keys(
  toastMeta.variants,
) as (keyof typeof toastMeta.variants)[];

export type ToastVariant = keyof typeof toastMeta.variants;

export const defaultToastVariant = toastMeta.defaultVariant;
