import { createStyles } from "@/lib/styles"
import { fieldStyles } from "@/registry/ui/field/styles"

import otpFieldMeta from "./meta"

const { useStyles, styles } = createStyles(otpFieldMeta, {
  base: {
    slots: {
      root: [
        fieldStyles().field({ className: "group/otp-field" }),
        "**:data-input:w-9 **:data-input:flex-none **:data-input:px-0 **:data-input:text-center **:data-input:font-mono **:data-input:tabular-nums **:data-input:invalid:[--invalid-icon:none]",
      ],
      group: "flex",
      separator: "",
    },
  },
  params: {
    cells: {
      // shadcn: one row sharing edges; the cells keep the control edge even
      // on edgeless shells.
      attached: {
        slots: {
          group:
            "w-fit items-stretch -space-x-(--studio-control-stroke) *:not-first:rounded-l-none *:not-last:rounded-r-none *:focus:z-1 **:data-input:border-(length:--studio-control-stroke) **:data-input:not-invalid:not-focus:border-border-control",
        },
      },
      // Ant, Mantine, Clerk: gapped cells, each the field shell itself.
      separate: {
        slots: { group: "gap-2" },
      },
    },
  },
})

export type OTPFieldStyles = typeof styles

export { styles as otpFieldStyles, useStyles }
