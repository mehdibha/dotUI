import { createStyles } from "@/lib/styles"

import groupMeta from "./meta"

/* Synced with toggle-button-group: same `separator` param — change both
   together. Auto lets the segments' own edges divide (bordered buttons share
   a hairline, fills abut); divider and none strip the borders between two
   adjacent buttons, divider drawing an inset hairline in their place. Seams
   next to a text, input or select child always stay auto. */

const { useStyles, styles } = createStyles(groupMeta, {
  base: {
    slots: {
      root: [
        "flex w-fit items-stretch",
        "has-data-[slot=group]:gap-2",
        "*:hover:z-1 *:focus:z-3 *:focus-visible:z-3 *:has-[input]:z-2 *:[input]:z-2",
        "*:data-label:shrink-0 *:data-label:rounded-md *:data-label:border *:data-label:bg-card *:data-label:px-4",
      ],
      text: "flex items-center gap-2 rounded-md border bg-card px-4 text-sm font-medium shadow-xs **:[svg]:pointer-events-none **:[svg]:not-with-[size]:size-4",
    },
    variants: {
      orientation: {
        horizontal: {
          root: [
            "-space-x-px not-has-data-group:*:not-first:rounded-l-none not-has-data-group:*:not-last:rounded-r-none",
            "not-has-data-group:*:not-last:data-select:*:data-button:rounded-r-none not-has-data-group:*:not-[:nth-child(2)]:data-select:*:data-button:rounded-l-none",
          ],
        },
        vertical: {
          root: "flex-col not-has-data-group:*:not-first:rounded-t-none not-has-data-group:*:not-last:rounded-b-none",
        },
      },
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    separator: {
      auto: {},
      divider: {
        variants: {
          orientation: {
            horizontal: {
              root: [
                "*:data-button:[&:has(+[data-button])]:me-0 *:data-button:[&:has(+[data-button])]:border-r-0 *:data-button:[[data-button]+&]:border-l-0",
                "*:data-button:[[data-button]+&]:before:absolute *:data-button:[[data-button]+&]:before:inset-y-1.5 *:data-button:[[data-button]+&]:before:left-0 *:data-button:[[data-button]+&]:before:w-px *:data-button:[[data-button]+&]:before:bg-current/20",
              ],
            },
            vertical: {
              root: [
                "*:data-button:[&:has(+[data-button])]:border-b-0 *:data-button:[[data-button]+&]:border-t-0",
                "*:data-button:[[data-button]+&]:before:absolute *:data-button:[[data-button]+&]:before:inset-x-1.5 *:data-button:[[data-button]+&]:before:top-0 *:data-button:[[data-button]+&]:before:h-px *:data-button:[[data-button]+&]:before:bg-current/20",
              ],
            },
          },
        },
      },
      none: {
        variants: {
          orientation: {
            horizontal: {
              root: "*:data-button:[&:has(+[data-button])]:border-r-0 *:data-button:[[data-button]+&]:border-l-0",
            },
            vertical: {
              root: "*:data-button:[&:has(+[data-button])]:border-b-0 *:data-button:[[data-button]+&]:border-t-0",
            },
          },
        },
      },
    },
  },
})

export type GroupStyles = typeof styles

export { useStyles }
