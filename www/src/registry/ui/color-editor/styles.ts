import { createStyles } from "@/lib/styles"

import { CONTAINER_SURFACE } from "../card/styles"
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
    spacious: {
      slots: {
        root: "gap-2.5",
        area: "gap-2.5",
        fields: "gap-2.5",
        fieldGroup: "gap-2.5",
      },
    },
    touch: {
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
          root: [
            "rounded-(--studio-color-editor-radius) p-3",
            CONTAINER_SURFACE,
          ],
        },
      },
    },
  },
})

export type ColorEditorStyles = typeof styles

export { useStyles }
