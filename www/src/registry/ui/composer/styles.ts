import { createStyles } from "@/lib/styles"

import composerMeta from "./meta"

const { useStyles, styles } = createStyles(composerMeta, {
  base: {
    slots: {
      root: "flex w-full cursor-text flex-col rounded-(--studio-composer-radius) border border-border bg-card text-fg shadow-(--shadow-card,0_0_#0000) transition-[border-color,box-shadow] has-focus-visible:border-border-control",
      textArea:
        "max-h-48 w-full resize-none bg-transparent outline-none placeholder:text-fg-muted disabled:cursor-disabled",
      toolbar: "flex items-center",
      submit: "ms-auto",
    },
  },
  density: {
    compact: {
      slots: {
        root: "gap-1 p-1.5 text-xs/relaxed",
        textArea: "min-h-8 px-1.5 py-1",
        toolbar: "gap-1",
      },
    },
    default: {
      slots: {
        root: "gap-1.5 p-2 text-sm",
        textArea: "min-h-10 px-2 py-1.5",
        toolbar: "gap-1.5",
      },
    },
    comfortable: {
      slots: {
        root: "gap-2 p-2 text-base",
        textArea: "min-h-12 px-2.5 py-2",
        toolbar: "gap-2",
      },
    },
  },
})

export type ComposerStyles = typeof styles

export { useStyles }
