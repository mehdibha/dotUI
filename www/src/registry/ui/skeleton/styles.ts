import { createStyles } from "@/lib/styles"

import skeletonMeta from "./meta"

const { useStyles, styles } = createStyles(skeletonMeta, {
  base: {
    slots: {
      root: [
        "group/skeleton pointer-events-none select-none",

        /* Explicit skeleton intents */
        "**:data-[skeleton=text]:rounded-(--studio-skeleton-radius) **:data-[skeleton=text]:text-transparent",
        "**:data-[skeleton=block]:skeleton **:data-[skeleton=text]:skeleton",
        "**:data-[skeleton=circle]:skeleton **:data-[skeleton=circle]:rounded-full",
        "**:data-[skeleton=control]:skeleton **:data-[skeleton=control]:border-transparent **:data-[skeleton=control]:text-transparent",
        "**:data-[skeleton=media]:skeleton",

        /* Text-like dotUI anatomy */
        "**:data-text:skeleton **:data-text:rounded-(--studio-skeleton-radius) **:data-text:text-transparent",
        "**:data-label:skeleton **:data-label:rounded-(--studio-skeleton-radius) **:data-label:text-transparent",
        "**:data-description:skeleton **:data-description:rounded-(--studio-skeleton-radius) **:data-description:text-transparent",
        "**:data-card-title:skeleton **:data-card-title:rounded-(--studio-skeleton-radius) **:data-card-title:text-transparent",
        "**:data-card-description:skeleton **:data-card-description:rounded-(--studio-skeleton-radius) **:data-card-description:text-transparent",
        "**:data-menu-item-label:skeleton **:data-menu-item-label:rounded-(--studio-skeleton-radius) **:data-menu-item-label:text-transparent",
        "**:data-menu-item-description:skeleton **:data-menu-item-description:rounded-(--studio-skeleton-radius) **:data-menu-item-description:text-transparent",
        "**:data-listbox-item-label:skeleton **:data-listbox-item-label:rounded-(--studio-skeleton-radius) **:data-listbox-item-label:text-transparent",
        "**:data-listbox-item-description:skeleton **:data-listbox-item-description:rounded-(--studio-skeleton-radius) **:data-listbox-item-description:text-transparent",

        /* Native typography */
        "[&_h1]:skeleton [&_h1]:rounded-(--studio-skeleton-radius) [&_h1]:text-transparent",
        "[&_h2]:skeleton [&_h2]:rounded-(--studio-skeleton-radius) [&_h2]:text-transparent",
        "[&_h3]:skeleton [&_h3]:rounded-(--studio-skeleton-radius) [&_h3]:text-transparent",
        "[&_h4]:skeleton [&_h4]:rounded-(--studio-skeleton-radius) [&_h4]:text-transparent",
        "[&_h5]:skeleton [&_h5]:rounded-(--studio-skeleton-radius) [&_h5]:text-transparent",
        "[&_h6]:skeleton [&_h6]:rounded-(--studio-skeleton-radius) [&_h6]:text-transparent",
        "[&_p]:skeleton [&_p]:rounded-(--studio-skeleton-radius) [&_p]:text-transparent",
        "[&_small]:skeleton [&_small]:rounded-(--studio-skeleton-radius) [&_small]:text-transparent",
        "[&_strong]:skeleton [&_strong]:rounded-(--studio-skeleton-radius) [&_strong]:text-transparent",
        "[&_em]:skeleton [&_em]:rounded-(--studio-skeleton-radius) [&_em]:text-transparent",
        "[&_code]:skeleton [&_code]:rounded-(--studio-skeleton-radius) [&_code]:text-transparent",
        "[&_kbd]:skeleton [&_kbd]:rounded-(--studio-skeleton-radius) [&_kbd]:text-transparent",
        "[&_samp]:skeleton [&_samp]:rounded-(--studio-skeleton-radius) [&_samp]:text-transparent",
        "[&_figcaption]:skeleton [&_figcaption]:rounded-(--studio-skeleton-radius) [&_figcaption]:text-transparent",
        "[&_legend]:skeleton [&_legend]:rounded-(--studio-skeleton-radius) [&_legend]:text-transparent",

        /* Controls and compact UI primitives */
        "**:data-button:skeleton **:data-button:border-transparent **:data-button:text-transparent **:data-button:shadow-none",
        "**:data-input-control:skeleton **:data-input-control:border-transparent **:data-input-control:text-transparent **:data-input-control:placeholder:text-transparent",
        "**:data-badge:skeleton **:data-badge:border-transparent **:data-badge:text-transparent",
        "**:data-tag:skeleton **:data-tag:border-transparent **:data-tag:text-transparent",
        "**:data-kbd:skeleton **:data-kbd:border-transparent **:data-kbd:text-transparent",
        "**:data-combobox-value:skeleton **:data-combobox-value:rounded-(--studio-skeleton-radius) **:data-combobox-value:text-transparent",

        /* Media / identity */
        "**:data-avatar:skeleton **:data-avatar:text-transparent",
        "**:data-avatar-group-count:skeleton **:data-avatar-group-count:text-transparent",

        /* Preserve geometry, hide real visuals. */
        "[&_[data-avatar-group-count]_*]:invisible [&_[data-avatar]_*]:invisible",
        "[&_[data-badge]_*]:invisible [&_[data-button]_*]:invisible [&_[data-kbd]_*]:invisible [&_[data-tag]_*]:invisible",
        "[&_[data-skeleton=circle]_*]:invisible [&_[data-skeleton=control]_*]:invisible [&_[data-skeleton=media]_*]:invisible",
      ],
    },
  },
  params: {
    animation: {
      shimmer: {
        slots: {
          root: "skeleton--shimmer",
        },
      },
      pulse: {
        slots: {
          root: "skeleton--pulse",
        },
      },
      none: {
        slots: {
          root: "skeleton--none",
        },
      },
    },
  },
})

export type SkeletonStyles = typeof styles

export { styles as skeletonStyles, useStyles }
