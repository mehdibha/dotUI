import { createStyles } from "@/lib/styles"

import {
  LINK_ACCENT,
  LINK_ALWAYS,
  LINK_HOVER,
  LINK_NEUTRAL,
  LINK_NEUTRAL_WEIGHT,
} from "../link/styles"
import breadcrumbsMeta from "./meta"

/* Ancestors are muted labels that sharpen on hover, or the link recipe in
   its color and underline. The current crumb stays plain foreground. */

const { useStyles, styles } = createStyles(breadcrumbsMeta, {
  base: {
    slots: {
      root: "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-fg-muted",
      item: "inline-flex items-center gap-1",
      link: [
        "focus-reset focus-visible:focus-ring-outside",
        "inline-flex items-center gap-1 px-0.5 leading-none transition-colors duration-(--studio-breadcrumbs-state-duration) ease-(--studio-breadcrumbs-state-ease) disabled:cursor-disabled disabled:not-current:text-(--disabled-fg,currentColor) current:text-fg",
      ],
      separator: "[&_svg]:size-4",
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
    ancestors: {
      muted: { slots: { link: "hover:[a]:text-fg" } },
      "accent-always": {
        slots: { link: [LINK_ACCENT, LINK_ALWAYS, "current:no-underline"] },
      },
      "accent-hover": { slots: { link: [LINK_ACCENT, LINK_HOVER] } },
      "accent-never": { slots: { link: LINK_ACCENT } },
      // The current crumb drops the weight too, or it reads as an ancestor.
      "neutral-always": {
        slots: {
          link: [
            LINK_NEUTRAL_WEIGHT,
            LINK_NEUTRAL,
            LINK_ALWAYS,
            "current:font-normal current:no-underline",
          ],
        },
      },
      "neutral-hover": {
        slots: {
          link: [
            LINK_NEUTRAL_WEIGHT,
            LINK_NEUTRAL,
            LINK_HOVER,
            "current:font-normal",
          ],
        },
      },
      "neutral-never": {
        slots: {
          link: [LINK_NEUTRAL_WEIGHT, LINK_NEUTRAL, "current:font-normal"],
        },
      },
    },
  },
})

export type BreadcrumbsStyles = typeof styles

export { useStyles }
