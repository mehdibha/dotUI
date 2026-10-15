import { createStyles } from "@/lib/styles"

import colorThumbMeta from "./meta"

const { useStyles, styles } = createStyles(colorThumbMeta, {
  base: {
    base: [
      "focus-reset focus-visible:focus-ring-outside",
      "z-30 size-6 rounded-(--studio-radius-pill) border-2 border-thumb ring-1 ring-overlay/40 disabled:border-border disabled:bg-disabled!",
      "group-orientation-horizontal/color-slider:top-1/2 group-orientation-vertical/color-slider:left-1/2",
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
