import { createStyles } from "@/lib/styles"

import colorThumbMeta from "./meta"

const { useStyles, styles } = createStyles(colorThumbMeta, {
  base: {
    base: [
      "focus-reset focus-visible:focus-ring-outside",
      "z-30 size-6 rounded-(--studio-radius-pill) border-2 border-thumb ring-1 ring-scrim disabled:border-border disabled:bg-disabled!",
    ],
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
    spacious: {},
    touch: {},
  },
})

export type ColorThumbStyles = typeof styles

export { useStyles }
