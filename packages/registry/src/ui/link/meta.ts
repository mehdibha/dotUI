import type { RegistryItem } from "@dotui/registry/types";

const linkMeta = {
  name: "link",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/link/basic.tsx",
          target: "ui/link.tsx",
        },
      ],
      registryDependencies: ["focus-styles"],
    },
  },
} satisfies RegistryItem;

export default linkMeta;
export const linkVariants = Object.keys(
  linkMeta.variants,
) as (keyof typeof linkMeta.variants)[];
