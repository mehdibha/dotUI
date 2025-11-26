import type { RegistryItem } from "@dotui/registry/types";

const buttonMeta = {
  name: "button",
  type: "registry:ui",
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
  },
} satisfies RegistryItem;

export default buttonMeta;

export const buttonVariants = Object.keys(
  buttonMeta.variants,
) as (keyof typeof buttonMeta.variants)[];
