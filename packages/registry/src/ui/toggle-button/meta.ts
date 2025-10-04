import type { RegistryItem } from "@dotui/registry/types";

const toggleButtonMeta = {
  name: "toggle-button",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/toggle-button/basic.tsx",
          target: "ui/toggle-button.tsx",
        },
      ],
      registryDependencies: ["focus-styles"],
    },
  },
} satisfies RegistryItem;

export default toggleButtonMeta;
export const toggleButtonVariants = Object.keys(
  toggleButtonMeta.variants,
) as (keyof typeof toggleButtonMeta.variants)[];
