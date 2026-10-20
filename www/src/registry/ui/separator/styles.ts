import { createStyles } from "@/lib/styles"

import separatorMeta from "./meta"

const { useStyles } = createStyles(separatorMeta, {
  base: {
    base: "shrink-0 border-0 bg-border",
    variants: {
      orientation: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
})

export { useStyles }
