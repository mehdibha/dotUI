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
        "inline-flex items-center gap-px leading-none select-none peer-disabled:cursor-disabled peer-disabled:text-fg-disabled [&_svg]:size-3",
        "in-data-required:after:ml-0.5 in-data-required:after:text-fg-danger in-data-required:after:content-['*']",
        "in-disabled:cursor-disabled in-disabled:text-fg-disabled",
        "in-data-invalid:text-fg-danger",
      ],
      description:
        "text-fg-muted last:mt-0 in-data-disabled:text-fg-disabled nth-last-2:-mt-1",
      fieldError: "text-fg-danger",
      fieldErrorIcon: "shrink-0",
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
        fieldErrorIcon: "size-3",
        fieldGroup:
          "gap-4 has-data-checkbox:gap-2 has-data-radio:gap-2 has-[[data-checkbox]_[data-label]]:gap-1.5 has-[[data-radio]_[data-label]]:gap-1.5",
      },
    },
    default: {
      slots: {
        label: "text-sm",
        description: "text-sm",
        fieldError: "text-sm",
        fieldErrorIcon: "size-3.5",
        fieldGroup:
          "gap-5 has-data-checkbox:gap-3 has-data-radio:gap-3 has-[[data-checkbox]_[data-label]]:gap-2 has-[[data-radio]_[data-label]]:gap-2",
      },
    },
    comfortable: {
      slots: {
        label: "text-sm",
        description: "text-sm",
        fieldError: "text-sm",
        fieldErrorIcon: "size-3.5",
        fieldGroup:
          "gap-7 has-data-checkbox:gap-3 has-data-radio:gap-3 has-[[data-checkbox]_[data-label]]:gap-2.5 has-[[data-radio]_[data-label]]:gap-2.5",
      },
    },
  },
  /* Invalid treatment: the danger border alone (shadcn), an icon on the
     message line (Material, Spectrum, Polaris), or GOV.UK's bar with the
     message above the field. */
  params: {
    error: {
      border: {
        slots: {
          fieldErrorIcon: "hidden",
        },
      },
      message: {
        slots: {
          fieldError: "flex items-center gap-1",
        },
      },
      bar: {
        slots: {
          field:
            "invalid:border-l-[3px] invalid:border-border-danger invalid:pl-2.5",
          label: "order-first",
          fieldError: "order-first font-semibold",
          fieldErrorIcon: "hidden",
        },
      },
    },
  },
})

export type FieldStyles = typeof styles

export { styles as fieldStyles, useStyles }
