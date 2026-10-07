import { createStyles } from "@/lib/styles"

import kbdMeta from "./meta"

/* The base is the key's layout only; each style ships its own chrome and
   type, so no value fights another's classes. */

const { useStyles, styles } = createStyles(kbdMeta, {
  base: {
    slots: {
      group: "inline-flex items-center gap-1",
      kbd: [
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-(--studio-radius-control-sm) text-fg-muted select-ui",
        "**:[svg]:not-with-[size]:size-3",
      ],
    },
  },
  params: {
    style: {
      chip: {
        slots: { kbd: "bg-muted px-1 font-sans text-xs font-medium" },
      },
      // Claude, Linear, Untitled UI: a hairline, no fill.
      outline: {
        slots: { kbd: "border px-1 font-sans text-xs font-medium" },
      },
      // Radix Themes: sans at 12px, so ⌘ and ⇧ stay legible (a mono
      // fallback like Menlo draws them tiny).
      keycap: {
        slots: {
          kbd: "border border-b-2 border-border bg-card px-1.5 font-sans text-xs",
        },
      },
    },
  },
})

export type KbdStyles = typeof styles

export { useStyles }
