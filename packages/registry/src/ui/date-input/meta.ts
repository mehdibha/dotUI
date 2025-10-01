import type { RegistryItem } from "@dotui/registry/types";

const dateInputMeta = {
  name: "date-input",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/date-input/basic.tsx",
          target: "ui/date-input.tsx",
        },
      ],
    },
  },
} satisfies RegistryItem;

export default dateInputMeta;
export const dateInputVariants = Object.keys(
  dateInputMeta.variants,
) as (keyof typeof dateInputMeta.variants)[];
