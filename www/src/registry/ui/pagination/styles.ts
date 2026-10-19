import { createStyles } from "@/lib/styles"

import paginationMeta from "./meta"

const { useStyles } = createStyles(paginationMeta, {
  base: {
    slots: {
      root: "mx-auto flex w-full justify-center",
      list: "flex flex-row items-center gap-1",
      item: "",
      // Matches an icon-only page button at `md` so the ellipsis lines up with the page cells.
      ellipsis:
        "flex size-8 items-center justify-center text-fg-muted [&_svg]:size-4",
    },
  },
  density: {
    compact: {
      slots: {
        list: "gap-0.5",
        ellipsis: "size-7 [&_svg]:size-3.5",
      },
    },
    default: {},
    comfortable: {
      slots: {
        ellipsis: "size-9",
      },
    },
    spacious: {
      slots: {
        ellipsis: "size-10",
      },
    },
    touch: {
      slots: {
        ellipsis: "size-12",
      },
    },
  },
})

export { useStyles }
