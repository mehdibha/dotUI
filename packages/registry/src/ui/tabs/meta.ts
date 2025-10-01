import type { RegistryItem } from "@dotui/registry/types";

const tabsMeta = {
  name: "tabs",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/tabs/basic.tsx",
          target: "ui/tabs.tsx",
        },
      ],
      registryDependencies: ["focus-styles"],
    },
    motion: {
      files: [
        {
          type: "registry:ui",
          path: "ui/tabs/motion.tsx",
          target: "ui/tabs.tsx",
        },
      ],
      registryDependencies: ["focus-styles"],
      dependencies: ["motion"],
    },
  },
} satisfies RegistryItem;

export default tabsMeta;
export const tabsVariants = Object.keys(
  tabsMeta.variants,
) as (keyof typeof tabsMeta.variants)[];
