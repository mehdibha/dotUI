import type { RegistryItem } from "@dotui/registry/types";

const buttonMeta = {
  name: "button",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/button/basic.tsx",
          target: "ui/button.tsx",
        },
      ],
      registryDependencies: ["loader", "focus-styles"],
    },
    ripple: {
      files: [
        {
          type: "registry:ui",
          path: "ui/button/ripple.tsx",
          target: "ui/button.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default buttonMeta;

export const buttonVariants = Object.keys(
  buttonMeta.variants,
) as (keyof typeof buttonMeta.variants)[];

export type ButtonVariant = keyof typeof buttonMeta.variants;

export const defaultButtonVariant = buttonMeta.defaultVariant;
