import { createStyles } from "@/lib/styles"

import tokenFieldMeta from "./meta"

const { useStyles, styles } = createStyles(tokenFieldMeta, {
  base: {
    slots: {
      root: ["group/token-field flex w-full flex-col gap-1.5"],
      input: [
        "min-h-16 w-full rounded-(--input-radius) border border-border-control bg-field px-2.5 py-2 text-base outline-none sm:text-sm",
        "transition-[box-shadow,border-color,color]",
        "focus:border-border-focus focus:focus-input",
        "data-disabled:cursor-disabled data-disabled:border-(--disabled-border,var(--color-border-control)) data-disabled:bg-(--disabled-bg,var(--color-field)) data-disabled:text-(--disabled-fg,currentColor)",
        // Placeholder for the empty contenteditable, driven by data-placeholder.
        "empty:before:pointer-events-none empty:before:text-fg-muted empty:before:content-[attr(data-placeholder)]",
      ],
      token: [
        "rounded-(--tag-radius) bg-accent-muted px-0.5 text-fg-accent",
        "data-selected:bg-accent data-selected:text-fg-on-accent",
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type TokenFieldStyles = typeof styles

export { useStyles }
