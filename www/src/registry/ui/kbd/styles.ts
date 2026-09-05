import { createStyles } from "@/lib/styles"

import kbdMeta from "./meta"

/* The base is the key's layout only; each treatment ships its own chrome
   and type, so no value fights another's classes. */

const { useStyles, styles } = createStyles(kbdMeta, {
  base: {
    slots: {
      group: "inline-flex items-center gap-1",
      kbd: [
        "pointer-events-none inline-flex w-fit items-center justify-center gap-1 text-fg-muted select-none",
        "**:[svg]:not-with-[size]:size-3",
      ],
    },
  },
  params: {
    treatment: {
      text: {
        slots: { kbd: "font-sans text-xs tracking-widest" },
      },
      chip: {
        slots: {
          kbd: "h-5 min-w-5 rounded-(--kbd-radius) bg-muted px-1 font-sans text-xs font-medium",
        },
      },
      keycap: {
        slots: {
          kbd: "h-5 min-w-5 rounded-(--kbd-radius) border border-b-2 border-border bg-card px-1.5 font-mono text-[0.6875rem]",
        },
      },
    },
  },
})

export type KbdStyles = typeof styles

export { useStyles }
