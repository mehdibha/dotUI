import { createStyles } from "@/lib/styles"

import linkMeta from "./meta"

/* The link recipe; link buttons and breadcrumb ancestors import it. The
   params shape the default variant only: quiet is the understated link that
   reads without color, so its underline is its definition, not a policy. */
export const LINK_ALWAYS = "underline underline-offset-2"
export const LINK_HOVER = "underline-offset-2 hover:underline"
export const LINK_ACCENT = "text-fg-accent"
export const LINK_NEUTRAL = "text-fg"
// Weight is the only resting cue a neutral link gets (Supabase, Geist); a
// link button keeps its label weight instead.
export const LINK_NEUTRAL_WEIGHT = "font-medium"

const { useStyles, styles } = createStyles(linkMeta, {
  base: {
    base: [
      "focus-reset focus-visible:focus-ring-outside",
      "inline-flex items-center gap-1 transition-colors duration-(--studio-link-state-duration) ease-(--studio-link-state-ease)",
    ],
    variants: {
      variant: {
        default: "disabled:text-(--disabled-fg,currentColor)",
        quiet:
          "font-medium text-fg underline underline-offset-2 disabled:text-(--disabled-fg,var(--color-fg))",
        unstyled: "",
      },
    },
    defaultVariants: {
      variant: "default",
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
    underline: {
      always: { variants: { variant: { default: LINK_ALWAYS } } },
      hover: { variants: { variant: { default: LINK_HOVER } } },
      never: {},
    },
    color: {
      accent: { variants: { variant: { default: LINK_ACCENT } } },
      neutral: {
        variants: { variant: { default: [LINK_NEUTRAL_WEIGHT, LINK_NEUTRAL] } },
      },
    },
  },
})

export type LinkStyles = typeof styles

export { useStyles }
