import { createStyles } from "@/lib/styles"

import badgeMeta from "./meta"

/* The chips recipe, shared with tag-group: a palette sets the --chip-* vars,
   an appearance paints with them, and the `style` param only moves the
   appearance default, so the prop stays API for products that mix chips. */

export const CHIP_SOLID = "bg-(--chip-fill) text-(--chip-fg)"
export const CHIP_SOFT = "bg-(--chip-tint) text-(--chip-fg-tint)"
export const CHIP_OUTLINE =
  "border border-(--chip-border) text-(--chip-fg-tint)"
export const CHIP_SOFT_OUTLINE =
  "border border-(--chip-border) bg-(--chip-tint) text-(--chip-fg-tint)"
// Neutral hairline pill; the status rides a leading dot (Linear labels).
export const CHIP_DOT =
  "border border-border text-fg before:size-2 before:shrink-0 before:rounded-full before:bg-(--chip-dot,var(--chip-fill)) before:content-['']"

// Half-strength wash: the neutral fill is already the wash tone; its dot
// takes the muted ink, the fill being too light to read.
export const CHIP_NEUTRAL =
  "[--chip-border:var(--color-border)] [--chip-dot:var(--color-fg-muted)] [--chip-fg-tint:var(--color-fg)] [--chip-fg:var(--color-fg-on-neutral)] [--chip-fill:var(--color-neutral)] [--chip-tint:color-mix(in_oklab,var(--color-muted)_50%,transparent)]"

export const CHIPS = {
  // shadcn, Geist, Spectrum 2 (bold), Mantine (filled), Fluent 2.
  solid: {},
  // Radix Themes, Polaris, Chakra (subtle), Carbon, Atlassian, HeroUI.
  soft: { defaultVariants: { appearance: "soft" } },
  // Primer (Label).
  outline: { defaultVariants: { appearance: "outline" } },
  // Ant Design (Tag), Untitled UI, Supabase.
  "soft-outline": { defaultVariants: { appearance: "soft-outline" } },
  // Linear (labels).
  dot: { defaultVariants: { appearance: "dot" } },
} as const

/* Caps, one size down, tracked: Supabase, Mantine, Atlassian (v15). */
export const CAPS = "text-[0.6875rem] tracking-wider uppercase"

const { useStyles, styles } = createStyles(badgeMeta, {
  base: {
    base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-(--studio-badge-radius) font-medium whitespace-nowrap [&>svg]:pointer-events-none",
    variants: {
      appearance: {
        solid: CHIP_SOLID,
        soft: CHIP_SOFT,
        outline: CHIP_OUTLINE,
        "soft-outline": CHIP_SOFT_OUTLINE,
        dot: CHIP_DOT,
      },
      variant: {
        neutral: CHIP_NEUTRAL,
        accent:
          "[--chip-border:var(--color-border-accent)] [--chip-fg-tint:var(--color-fg-accent)] [--chip-fg:var(--color-fg-on-accent)] [--chip-fill:var(--color-accent)] [--chip-tint:var(--color-accent-muted)]",
        danger:
          "[--chip-border:var(--color-border-danger)] [--chip-fg-tint:var(--color-fg-danger)] [--chip-fg:var(--color-fg-on-danger)] [--chip-fill:var(--color-danger)] [--chip-tint:var(--color-danger-muted)]",
        success:
          "[--chip-border:var(--color-border-success)] [--chip-fg-tint:var(--color-fg-success)] [--chip-fg:var(--color-fg-on-success)] [--chip-fill:var(--color-success)] [--chip-tint:var(--color-success-muted)]",
        warning:
          "[--chip-border:var(--color-border-warning)] [--chip-fg-tint:var(--color-fg-warning)] [--chip-fg:var(--color-fg-on-warning)] [--chip-fill:var(--color-warning)] [--chip-tint:var(--color-warning-muted)]",
        info: "[--chip-border:var(--color-border-info)] [--chip-fg-tint:var(--color-fg-info)] [--chip-fg:var(--color-fg-on-info)] [--chip-fill:var(--color-info)] [--chip-tint:var(--color-info-muted)]",
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
    spacious: {},
    touch: {},
  },
  params: {
    style: CHIPS,
    case: {
      sentence: { base: "text-xs" },
      uppercase: { base: CAPS },
    },
  },
})

export type BadgeStyles = typeof styles

export { useStyles }
