import { createStyles } from "@/lib/styles"

import colorThumbMeta from "./meta"

const { useStyles } = createStyles(colorThumbMeta, {
  base: {
    base: [
      "outline-none focus-visible:focus-ring focus-visible:outline-offset-(--studio-focus-outside-offset)",
      "z-30 size-6 rounded-(--studio-radius-pill) border-2 border-thumb ring-1 ring-scrim disabled:border-border disabled:bg-disabled!",
    ],
  },
})

export { useStyles }
