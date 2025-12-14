import type { RegistryItem } from "@dotui/registry/types";

const searchFieldMeta = {
  name: "search-field",
  type: "registry:ui",
  defaultVariant: "basic",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/search-field/basic.tsx",
          target: "ui/search-field.tsx",
        },
      ],
      registryDependencies: ["field", "button"],
    },
  },
} satisfies RegistryItem;

export default searchFieldMeta;
export const searchFieldVariants = Object.keys(
  searchFieldMeta.variants,
) as (keyof typeof searchFieldMeta.variants)[];

export type SearchFieldVariant = keyof typeof searchFieldMeta.variants;

export const defaultSearchFieldVariant = searchFieldMeta.defaultVariant;
