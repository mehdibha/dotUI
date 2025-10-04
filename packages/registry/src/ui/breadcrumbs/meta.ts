import type { RegistryItem } from "@dotui/registry/types";

const breadcrumbsMeta = {
  name: "breadcrumbs",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/breadcrumbs/basic.tsx",
          target: "ui/breadcrumbs.tsx",
        },
      ],
      registryDependencies: ["focus-styles"],
    },
  },
} satisfies RegistryItem;

export default breadcrumbsMeta;
export const breadcrumbsVariants = Object.keys(
  breadcrumbsMeta.variants,
) as (keyof typeof breadcrumbsMeta.variants)[];
