import { createStyles } from "@/lib/styles"

import accordionMeta from "./meta"

const { useStyles, styles } = createStyles(accordionMeta, {
  base: {
    base: "flex w-full flex-col",
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    container: {
      divided: {
        base: "**:data-disclosure:not-last:border-b",
      },
      boxed: {
        base: "rounded-(--accordion-radius) border bg-card **:data-disclosure:px-3 **:data-disclosure:not-last:border-b",
      },
      cards: {
        base: "gap-2 **:data-disclosure:rounded-(--accordion-radius) **:data-disclosure:border **:data-disclosure:bg-card **:data-disclosure:px-3",
      },
    },
  },
})

export type AccordionStyles = typeof styles

export { useStyles }
