import { createStyles } from "@/lib/styles"
import { fieldStyles } from "@/registry/ui/field/styles"

import otpFieldMeta from "./meta"

const { useStyles, styles } = createStyles(otpFieldMeta, {
  base: {
    slots: {
      root: [
        fieldStyles().field({ className: "group/otp-field" }),
        "**:data-input:w-9 **:data-input:flex-none **:data-input:px-0 **:data-input:text-center **:data-input:font-mono **:data-input:tabular-nums",
      ],
      group: "flex",
      separator: "",
    },
  },
  params: {
    cells: {
      group: {
        slots: {
          group:
            "w-fit items-stretch -space-x-px *:not-first:rounded-l-none *:not-last:rounded-r-none *:focus:z-1",
        },
      },
      boxes: {
        slots: { group: "gap-2" },
      },
      underline: {
        slots: {
          group:
            "gap-2 **:data-input:rounded-none **:data-input:border-x-0 **:data-input:border-t-0 **:data-input:border-b-2 **:data-input:bg-transparent **:data-input:shadow-none **:data-input:focus:ring-0",
        },
      },
    },
  },
})

export type OTPFieldStyles = typeof styles

export { styles as otpFieldStyles, useStyles }
