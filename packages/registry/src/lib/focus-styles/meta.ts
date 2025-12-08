import type { RegistryItem } from "@dotui/registry/types";

const focusStylesMeta = {
  name: "focus-styles",
  type: "registry:lib",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          path: "lib/focus-styles/basic.ts",
          type: "registry:lib",
          target: "lib/focus-styles.ts",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default focusStylesMeta;
export const focusStylesVariants = Object.keys(
  focusStylesMeta.variants,
) as (keyof typeof focusStylesMeta.variants)[];

export type FocusStylesVariant = keyof typeof focusStylesMeta.variants;

export const defaultFocusStylesVariant = focusStylesMeta.defaultVariant;
