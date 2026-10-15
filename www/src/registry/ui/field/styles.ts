import { createStyles } from "@/lib/styles"

import fieldMeta from "./meta"

const { useStyles, styles } = createStyles(fieldMeta, {
  base: {
    slots: {
      fieldset: "",
      legend: "",
      fieldGroup:
        "group/field-group @container/field-group flex w-full flex-col",
      field:
        "flex w-full gap-2 invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden",
      fieldContent: "flex flex-col gap-1",
      label: [
        "inline-flex items-center gap-px select-ui peer-disabled:cursor-disabled peer-disabled:text-(--disabled-fg,currentColor) [&_svg]:size-3",
        "in-data-required:after:ml-0.5 in-data-required:after:text-fg-danger in-data-required:after:content-['*']",
        "in-disabled:cursor-disabled in-disabled:text-(--disabled-fg,currentColor)",
        "in-data-invalid:text-fg-danger",
      ],
      description:
        "text-fg-muted last:mt-0 in-data-disabled:text-(--disabled-fg,var(--color-fg-muted)) nth-last-2:-mt-1",
      fieldError: "text-fg-danger",
    },
    variants: {
      orientation: {
        horizontal: {
          field:
            "flex-row items-center gap-2 has-data-[slot=description]:items-start",
        },
        vertical: {
          field: "w-full flex-col gap-2",
        },
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
  density: {
    compact: {
      slots: {
        label: "text-xs",
        description: "text-xs",
        fieldError: "text-xs",
        fieldGroup:
          "gap-4 has-data-checkbox:gap-2 has-data-radio:gap-2 has-[[data-checkbox]_[data-label]]:gap-1.5 has-[[data-radio]_[data-label]]:gap-1.5",
      },
    },
    default: {
      slots: {
        label: "text-sm",
        description: "text-sm",
        fieldError: "text-sm",
        fieldGroup:
          "gap-5 has-data-checkbox:gap-3 has-data-radio:gap-3 has-[[data-checkbox]_[data-label]]:gap-2 has-[[data-radio]_[data-label]]:gap-2",
      },
    },
    comfortable: {
      slots: {
        label: "text-sm",
        description: "text-sm",
        fieldError: "text-sm",
        fieldGroup:
          "gap-7 has-data-checkbox:gap-3 has-data-radio:gap-3 has-[[data-checkbox]_[data-label]]:gap-2.5 has-[[data-radio]_[data-label]]:gap-2.5",
      },
    },
    spacious: {
      slots: {
        label: "text-sm",
        description: "text-sm",
        fieldError: "text-sm",
        fieldGroup:
          "gap-7 has-data-checkbox:gap-3 has-data-radio:gap-3 has-[[data-checkbox]_[data-label]]:gap-2.5 has-[[data-radio]_[data-label]]:gap-2.5",
      },
    },
    touch: {
      slots: {
        label: "text-sm",
        description: "text-sm",
        fieldError: "text-sm",
        fieldGroup:
          "gap-7 has-data-checkbox:gap-3 has-data-radio:gap-3 has-[[data-checkbox]_[data-label]]:gap-2.5 has-[[data-radio]_[data-label]]:gap-2.5",
      },
    },
  },
  params: {
    // The error line: plain danger text (shadcn), or led by an icon (Polaris,
    // Primer, Geist). The icon-in-field option draws on input instead.
    error: {
      plain: {},
      "icon-message": {
        slots: {
          fieldError:
            "flex items-center gap-1 *:[svg]:size-[1em] *:[svg]:shrink-0",
        },
      },
    },
    // Form-field labels only; a checkbox, radio or switch keeps its own.
    label: {
      regular: {},
      medium: {
        slots: {
          label:
            "not-in-data-checkbox:not-in-data-radio:not-in-data-switch:font-medium",
        },
      },
      semibold: {
        slots: {
          label:
            "not-in-data-checkbox:not-in-data-radio:not-in-data-switch:font-semibold",
        },
      },
    },
  },
})

export type FieldStyles = typeof styles

export { styles as fieldStyles, useStyles }
