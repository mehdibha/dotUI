import type { RegistryItem } from "@dotui/registry/types";

const dropZoneMeta = {
  name: "drop-zone",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/drop-zone/basic.tsx",
          target: "ui/drop-zone.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default dropZoneMeta;
export const dropZoneVariants = Object.keys(
  dropZoneMeta.variants,
) as (keyof typeof dropZoneMeta.variants)[];
