import { createStyles } from "@/lib/styles"

import tokenFieldMeta from "./meta"

const { useStyles } = createStyles(tokenFieldMeta, {
  base: {
    slots: {
      root: ["flex w-full flex-col gap-1.5"],
      // The shell is input's text area; this adds the empty placeholder.
      input:
        "empty:before:pointer-events-none empty:before:text-fg-muted empty:before:content-[attr(data-placeholder)]",
      token: [
        "rounded-(--studio-tag-radius) bg-selected px-0.5 text-fg-on-selected",
        "data-selected:bg-selection data-selected:text-fg-on-selection",
      ],
    },
  },
})

export { useStyles }
