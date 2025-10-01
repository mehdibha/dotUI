import type { RegistryItem } from "@dotui/registry/types";

const dateRangePickerMeta = {
  name: "date-range-picker",
  type: "registry:ui",
  variants: {
    basic: {
      files: [
        {
          type: "registry:ui",
          path: "ui/date-range-picker/basic.tsx",
          target: "ui/date-range-picker.tsx",
        },
      ],
      registryDependencies: [
        "button",
        "calendar",
        "field",
        "input",
        "date-input",
        "dialog",
      ],
    },
  },
} satisfies RegistryItem;

export default dateRangePickerMeta;
export const dateRangePickerVariants = Object.keys(
  dateRangePickerMeta.variants,
) as (keyof typeof dateRangePickerMeta.variants)[];
