import { createStyles } from "@/lib/styles"

import colorEditorMeta from "./meta"

const { useStyles, styles } = createStyles(colorEditorMeta, {
  base: {
    slots: {
      root: "flex w-fit flex-col",
      area: "flex",
      fields: "flex flex-col",
      fieldGroup: "flex flex-1 items-center",
    },
  },
  density: {
    compact: {
      slots: {
        root: "gap-1.5",
        area: "gap-1.5",
        fields: "gap-1.5",
        fieldGroup: "gap-1.5",
      },
    },
    default: {
      slots: {
        root: "gap-2",
        area: "gap-2",
        fields: "gap-2",
        fieldGroup: "gap-2",
      },
    },
    comfortable: {
      slots: {
        root: "gap-2.5",
        area: "gap-2.5",
        fields: "gap-2.5",
        fieldGroup: "gap-2.5",
      },
    },
  },
  params: {
    style: {
      default: {},
      hammamet: {
        slots: {
          root: "rounded-lg border border-(--card-border) bg-card p-3 shadow-[var(--shadow-card,0_0_#0000)]",
        },
      },
    },
  },
})

export type ColorEditorStyles = typeof styles

export { useStyles }
