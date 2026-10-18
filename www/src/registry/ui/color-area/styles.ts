import { createStyles } from "@/lib/styles"

import colorAreaMeta from "./meta"

// Comfortable, spacious and touch share one tier.
const roomy = {
  base: "w-56",
}

const { useStyles, styles } = createStyles(colorAreaMeta, {
  base: {
    base: "block aspect-square min-w-20 rounded-(--studio-color-area-radius) disabled:[background:var(--color-disabled)]! in-data-dialog:w-full",
  },
  density: {
    compact: {
      base: "w-40",
    },
    default: {
      base: "w-48",
    },
    comfortable: roomy,
    spacious: roomy,
    touch: roomy,
  },
})

export type ColorAreaStyles = typeof styles

export { useStyles }
