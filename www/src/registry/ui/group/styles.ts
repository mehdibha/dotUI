import { createStyles } from "@/lib/styles"

import groupMeta from "./meta"

/* How two attached buttons meet; toggle-button-group imports it. Shared edge
   lets the segments' own edges divide (bordered buttons share one, fills
   abut); divider strips the borders between two adjacent buttons and draws
   an inset hairline in their place, hidden beside a selected toggle. Seams
   next to a text, input or select child always share their edge. */
export const SEAMS = {
  "shared-edge": {},
  divider: {
    slots: {
      root: "*:data-button:selected:before:hidden *:data-button:[[data-selected]+&]:before:hidden",
    },
    variants: {
      orientation: {
        horizontal: {
          root: [
            "*:data-button:[&:has(+[data-button])]:me-0 *:data-button:[&:has(+[data-button])]:border-r-0 *:data-button:[[data-button]+&]:border-l-0",
            "*:data-button:[[data-button]+&]:before:absolute *:data-button:[[data-button]+&]:before:inset-y-1.5 *:data-button:[[data-button]+&]:before:left-0 *:data-button:[[data-button]+&]:before:w-(--studio-control-stroke) *:data-button:[[data-button]+&]:before:bg-current/20",
          ],
        },
        vertical: {
          root: [
            "*:data-button:[&:has(+[data-button])]:mb-0 *:data-button:[&:has(+[data-button])]:border-b-0 *:data-button:[[data-button]+&]:border-t-0",
            "*:data-button:[[data-button]+&]:before:absolute *:data-button:[[data-button]+&]:before:inset-x-1.5 *:data-button:[[data-button]+&]:before:top-0 *:data-button:[[data-button]+&]:before:h-(--studio-control-stroke) *:data-button:[[data-button]+&]:before:bg-current/20",
          ],
        },
      },
    },
  },
}

const { useStyles, styles } = createStyles(groupMeta, {
  base: {
    slots: {
      root: [
        "flex w-fit items-stretch",
        "has-data-[slot=group]:gap-2",
        "*:hover:z-1 *:focus:z-3 *:focus-visible:z-3 *:has-[input]:z-2 *:[input]:z-2",
        "*:data-label:shrink-0 *:data-label:rounded-(--studio-group-radius) *:data-label:border-(length:--studio-control-stroke) *:data-label:bg-card *:data-label:px-4",
      ],
      text: "flex items-center gap-2 rounded-(--studio-group-radius) border-(length:--studio-control-stroke) bg-card px-4 text-sm font-(--studio-font-weight-label) shadow-xs **:[svg]:pointer-events-none **:[svg]:not-with-[size]:size-4",
    },
    variants: {
      orientation: {
        horizontal: {},
        vertical: { root: "flex-col" },
      },
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
    // Gapped: Duolingo never attaches; its slab would be drawn twice.
    segments: {
      attached: {
        slots: { root: "*:data-button:shadow-none" },
        variants: {
          orientation: {
            horizontal: {
              root: [
                "-space-x-(--studio-control-stroke) not-has-data-group:*:not-first:rounded-l-none not-has-data-group:*:not-last:rounded-r-none",
                "not-has-data-group:*:not-last:data-select:*:data-button:rounded-r-none not-has-data-group:*:not-[:nth-child(2)]:data-select:*:data-button:rounded-l-none",
              ],
            },
            vertical: {
              root: "not-has-data-group:*:not-first:rounded-t-none not-has-data-group:*:not-last:rounded-b-none",
            },
          },
        },
      },
      gapped: {
        slots: { root: "gap-2" },
      },
    },
    separator: SEAMS,
  },
})

export type GroupStyles = typeof styles

export { useStyles }
