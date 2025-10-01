import type { RegistryItem } from "@dotui/registry/types";

const textAreaMeta = {
  name: "text-area",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/text-area/basic.tsx",
          target: "ui/text-area.tsx",
        },
      ],
      registryDependencies: ["field", "input"],
    },
  },
} satisfies RegistryItem;

export default textAreaMeta;
export const textAreaVariants = Object.keys(
  textAreaMeta.variants,
) as (keyof typeof textAreaMeta.variants)[];
