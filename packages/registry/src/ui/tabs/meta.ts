import type { RegistryItem } from "@dotui/registry/types";

const tabsMeta = {
  name: "tabs",
  type: "registry:ui",
  group: "navigation",
  defaultVariant: "basic",
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
  },
} satisfies RegistryItem;

export default tabsMeta;
export const tabsVariants = Object.keys(
  tabsMeta.variants,
) as (keyof typeof tabsMeta.variants)[];

export type TabsVariant = keyof typeof tabsMeta.variants;

export const defaultTabsVariant = tabsMeta.defaultVariant;
