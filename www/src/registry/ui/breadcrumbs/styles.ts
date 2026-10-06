import { createStyles } from "@/lib/styles"

import {
  LINK_ACCENT,
  LINK_ALWAYS,
  LINK_HOVER,
  LINK_NEUTRAL,
} from "../link/styles"
import breadcrumbsMeta from "./meta"

/* Ancestors are muted labels that sharpen on hover, or the link recipe in
   its color and underline. The current crumb is plain foreground in both. */

const { useStyles, styles } = createStyles(breadcrumbsMeta, {
  base: {
    slots: {
      root: "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-fg-muted",
      item: "inline-flex items-center gap-1",
      link: [
        "focus-reset focus-visible:focus-ring",
        "inline-flex items-center gap-1 px-0.5 leading-none transition-colors duration-(--studio-breadcrumbs-state-duration) ease-(--studio-breadcrumbs-state-ease) disabled:cursor-disabled disabled:not-current:text-(--disabled-fg,currentColor)",
      ],
      separator: "[&_svg]:size-4",
    },
    variants: {
      isCurrent: {
        true: { link: "text-fg" },
        false: { link: "" },
      },
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    ancestors: {
      muted: { slots: { link: "hover:[a]:text-fg" } },
      "accent-always": {
        variants: {
          isCurrent: { false: { link: [LINK_ACCENT, LINK_ALWAYS] } },
        },
      },
      "accent-hover": {
        variants: { isCurrent: { false: { link: [LINK_ACCENT, LINK_HOVER] } } },
      },
      "accent-never": {
        variants: { isCurrent: { false: { link: LINK_ACCENT } } },
      },
      "neutral-always": {
        variants: {
          isCurrent: { false: { link: [LINK_NEUTRAL, LINK_ALWAYS] } },
        },
      },
      "neutral-hover": {
        variants: {
          isCurrent: { false: { link: [LINK_NEUTRAL, LINK_HOVER] } },
        },
      },
      "neutral-never": {
        variants: { isCurrent: { false: { link: LINK_NEUTRAL } } },
      },
    },
  },
})

export type BreadcrumbsStyles = typeof styles

export { useStyles }
