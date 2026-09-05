import { createStyles } from "@/lib/styles"

import badgeMeta from "./meta"

/* Each intent sets the chip's palette as vars; `appearance` picks which of
   them paint. The `style` param only moves the appearance default, so a
   product that mixes chips keeps the prop. Synced with tag-group. */

const { useStyles, styles } = createStyles(badgeMeta, {
  base: {
    base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-(--badge-radius) text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none",
    variants: {
      appearance: {
        solid: "bg-(--badge-fill) text-(--badge-fg)",
        soft: "bg-(--badge-tint) text-(--badge-fg-tint)",
        outline: "border border-(--badge-border) text-(--badge-fg-tint)",
        "soft-outline":
          "border border-(--badge-border) bg-(--badge-tint) text-(--badge-fg-tint)",
      },
      variant: {
        neutral:
          "[--badge-border:var(--color-border)] [--badge-fg-tint:var(--color-fg)] [--badge-fg:var(--color-fg-on-neutral)] [--badge-fill:var(--color-neutral)] [--badge-tint:var(--color-muted)]",
        accent:
          "[--badge-border:var(--color-border-accent)] [--badge-fg-tint:var(--color-fg-accent)] [--badge-fg:var(--color-fg-on-accent)] [--badge-fill:var(--color-accent)] [--badge-tint:var(--color-accent-muted)]",
        danger:
          "[--badge-border:var(--color-border-danger)] [--badge-fg-tint:var(--color-fg-danger)] [--badge-fg:var(--color-fg-on-danger)] [--badge-fill:var(--color-danger)] [--badge-tint:var(--color-danger-muted)]",
        success:
          "[--badge-border:var(--color-border-success)] [--badge-fg-tint:var(--color-fg-success)] [--badge-fg:var(--color-fg-on-success)] [--badge-fill:var(--color-success)] [--badge-tint:var(--color-success-muted)]",
        warning:
          "[--badge-border:var(--color-border-warning)] [--badge-fg-tint:var(--color-fg-warning)] [--badge-fg:var(--color-fg-on-warning)] [--badge-fill:var(--color-warning)] [--badge-tint:var(--color-warning-muted)]",
        info: "[--badge-border:var(--color-border-info)] [--badge-fg-tint:var(--color-fg-info)] [--badge-fg:var(--color-fg-on-info)] [--badge-fill:var(--color-info)] [--badge-tint:var(--color-info-muted)]",
      },
      size: {
        sm: "h-4.5 min-w-4.5 px-1.5 **:data-loader:*:[svg]:size-2.5 [&>svg]:size-2.5",
        md: "h-5 min-w-5 px-1.75 **:data-loader:*:[svg]:size-3 [&>svg]:size-3",
        lg: "h-5.5 min-w-5.5 px-2.25 **:data-loader:*:[svg]:size-3.5 [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      appearance: "solid",
      variant: "neutral",
      size: "md",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    style: {
      solid: {},
      soft: { defaultVariants: { appearance: "soft" } },
      outline: { defaultVariants: { appearance: "outline" } },
      "soft-outline": { defaultVariants: { appearance: "soft-outline" } },
    },
  },
})

export type BadgeStyles = typeof styles

export { useStyles }
