import { createStyles } from "@/lib/styles"

import dropZoneMeta from "./meta"

const { useStyles, styles } = createStyles(dropZoneMeta, {
  base: {
    slots: {
      dropzone:
        "flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border-control p-6 text-sm focus-visible:border-border-focus disabled:border-(--disabled-border,var(--color-border-control)) disabled:text-(--disabled-fg,currentColor) drop-target:border-border-focus drop-target:bg-accent-muted",
      label: "text-base",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type DropZoneStyles = typeof styles

export { useStyles }
