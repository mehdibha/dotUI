import { createStyles } from "@/lib/styles"

import linkMeta from "./meta"

/* `underline` and `color` shape the default variant only. Quiet is the
   understated link that reads without color, so its underline is its
   definition, not a policy. */

const { useStyles, styles } = createStyles(linkMeta, {
  base: {
    base: [
      "focus-reset focus-visible:focus-ring",
      "inline-flex items-center gap-1 transition-colors",
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
  },
  params: {
    underline: {
      always: {
        variants: { variant: { default: "underline underline-offset-2" } },
      },
      hover: {
        variants: {
          variant: { default: "underline-offset-2 hover:underline" },
        },
      },
      never: {},
    },
    color: {
      accent: {
        variants: { variant: { default: "text-fg-accent" } },
      },
      /* Weight is the only resting cue a foreground link gets — the
         Vercel/Linear pattern against a muted paragraph. */
      foreground: {
        variants: { variant: { default: "font-medium text-fg" } },
      },
    },
  },
})

export type LinkStyles = typeof styles

export { useStyles }
