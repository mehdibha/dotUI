import { createStyles } from "@/lib/styles"

import {
  SELECTED_INVERSE_INK,
  SELECTED_SOLID_INK,
  SELECTED_TINT_INK,
  SELECTED_TONE_INK,
  UPPERCASE,
} from "../button/styles"
import {
  CHIP_INVERSE,
  CHIP_RAISED,
  CHIP_RING,
  CHIP_TONE,
  TRACK_FILLED,
  TRACK_OUTLINE,
  WEIGHT_BOLD,
  WEIGHT_MEDIUM,
  WEIGHT_MEDIUM_SEMIBOLD,
  WEIGHT_REGULAR,
  WEIGHT_REGULAR_MEDIUM,
  WEIGHT_REGULAR_SEMIBOLD,
  WEIGHT_SEMIBOLD,
} from "../segmented-control/styles"
import tabsMeta from "./meta"

/* The `variant` prop is per-instance API; the `style` param sets its default
   for the design system. Segmented wears the segmented control's chip and
   track, pill a quiet toggle's selected look, line the indicator color. */

const { useStyles, styles } = createStyles(tabsMeta, {
  base: {
    slots: {
      root: "flex gap-2",
      list: "inline-flex w-fit items-center justify-center text-fg-muted",
      item: [
        "relative isolate inline-flex flex-1 cursor-default items-center justify-center whitespace-nowrap focus-reset transition-[background-color,border-color,color,box-shadow] duration-(--studio-tabs-color-duration) ease-(--studio-tabs-color-ease) select-ui focus-visible:focus-ring-outside",
        "text-fg-muted hover:text-fg disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor) aria-disabled:cursor-disabled aria-disabled:text-(--disabled-fg,currentColor)",
        "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      ],
      indicator:
        "pointer-events-none absolute transition-[translate,width,height] duration-(--studio-tabs-state-duration) ease-(--studio-tabs-state-ease) motion-reduce:transition-none",
      panel: "flex-1 outline-none data-[inert=true]:hidden",
    },
    variants: {
      orientation: {
        horizontal: {
          root: "flex-col",
          list: "h-(--tabs-list-height) flex-row",
        },
        vertical: {
          root: "flex-row",
          list: "h-fit flex-col",
          item: "w-full justify-start",
        },
      },
      variant: {
        segmented: {
          list: "rounded-(--studio-tabs-list-radius)",
          item: "rounded-[calc(var(--studio-tabs-list-radius)-3px)] border border-transparent orientation-horizontal:h-[calc(100%-1px)]",
          indicator:
            "inset-0 rounded-[calc(var(--studio-tabs-list-radius)-3px)]",
        },
        line: {
          list: "gap-3 orientation-horizontal:border-b orientation-vertical:border-r",
          item: "rounded-(--studio-tabs-tab-radius) orientation-horizontal:h-full selected:text-fg",
          indicator:
            "orientation-horizontal:-bottom-px orientation-vertical:top-0 orientation-vertical:-right-px orientation-vertical:h-full orientation-vertical:w-0.5 orientation-vertical:rounded-full",
        },
        pill: {
          list: "gap-1",
          item: "group/tab rounded-(--studio-tabs-pill-radius) orientation-horizontal:h-full",
          indicator: "inset-0 rounded-(--studio-tabs-pill-radius)",
        },
        enclosed: {
          list: "orientation-horizontal:items-end orientation-horizontal:border-b orientation-vertical:border-r",
          // The selected tab steps one pixel onto the list's edge and paints
          // over it, so tab and content read as one surface.
          item: "border border-transparent orientation-horizontal:-mb-px orientation-horizontal:h-full orientation-horizontal:rounded-t-(--studio-tabs-radius) orientation-vertical:-mr-px orientation-vertical:rounded-l-(--studio-tabs-radius) selected:z-10 selected:border-border selected:bg-(--surface-bg,var(--color-bg)) selected:text-fg orientation-horizontal:selected:border-b-transparent orientation-vertical:selected:border-r-transparent",
          indicator: "hidden",
        },
      },
    },
    defaultVariants: {
      variant: "segmented",
    },
  },
  density: {
    compact: {
      slots: {
        root: "[--tabs-list-height:2rem]",
        item: "gap-1.5 px-1.5 py-0.5 text-xs has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 **:[svg]:not-with-[size]:size-3.5",
        panel: "text-xs/relaxed",
      },
    },
    default: {
      slots: {
        root: "[--tabs-list-height:2rem]",
        item: "gap-1.5 px-1.5 py-0.5 text-sm has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 **:[svg]:not-with-[size]:size-4",
        panel: "text-sm",
      },
    },
    comfortable: {
      slots: {
        root: "[--tabs-list-height:2.25rem]",
        item: "gap-1.5 px-2 py-1 text-sm has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 **:[svg]:not-with-[size]:size-4",
        panel: "text-sm",
      },
    },
    spacious: {
      slots: {
        root: "[--tabs-list-height:2.5rem]",
        item: "gap-2 px-3 py-1.5 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 **:[svg]:not-with-[size]:size-4",
        panel: "text-sm",
      },
    },
    touch: {
      slots: {
        root: "[--tabs-list-height:3rem]",
        item: "gap-2 px-4 py-2 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 **:[svg]:not-with-[size]:size-5",
        panel: "text-sm",
      },
    },
  },
  params: {
    style: {
      segmented: { defaultVariants: { variant: "segmented" } },
      line: { defaultVariants: { variant: "line" } },
      pill: { defaultVariants: { variant: "pill" } },
    },
    // The line indicator across the tab, or hugging its label: 3px with a
    // rounded top (Material 3), inset by the tab's padding.
    indicator: {
      full: {
        variants: {
          variant: {
            line: {
              indicator:
                "orientation-horizontal:left-0 orientation-horizontal:h-0.5 orientation-horizontal:w-full orientation-horizontal:rounded-full",
            },
          },
        },
      },
      label: {
        variants: {
          variant: {
            line: {
              indicator:
                "orientation-horizontal:h-[3px] orientation-horizontal:rounded-t-[3px]",
            },
          },
        },
        density: {
          compact: {
            variants: {
              variant: {
                line: { indicator: "orientation-horizontal:inset-x-1.5" },
              },
            },
          },
          default: {
            variants: {
              variant: {
                line: { indicator: "orientation-horizontal:inset-x-1.5" },
              },
            },
          },
          comfortable: {
            variants: {
              variant: {
                line: { indicator: "orientation-horizontal:inset-x-2" },
              },
            },
          },
          spacious: {
            variants: {
              variant: {
                line: { indicator: "orientation-horizontal:inset-x-3" },
              },
            },
          },
          touch: {
            variants: {
              variant: {
                line: { indicator: "orientation-horizontal:inset-x-4" },
              },
            },
          },
        },
      },
    },
    color: {
      neutral: {
        variants: { variant: { line: { indicator: "bg-fg" } } },
      },
      accent: {
        variants: { variant: { line: { indicator: "bg-accent" } } },
      },
    },
    chip: {
      tone: { variants: { variant: { segmented: CHIP_TONE } } },
      raised: { variants: { variant: { segmented: CHIP_RAISED } } },
      ring: { variants: { variant: { segmented: CHIP_RING } } },
      inverse: { variants: { variant: { segmented: CHIP_INVERSE } } },
    },
    track: {
      filled: { variants: { variant: { segmented: { list: TRACK_FILLED } } } },
      outline: {
        variants: { variant: { segmented: { list: TRACK_OUTLINE } } },
      },
    },
    // A quiet toggle's selected ink and fill; the fill rides the indicator,
    // so the tab's hover and press reach it through the group.
    pill: {
      tone: {
        variants: {
          variant: {
            pill: {
              item: SELECTED_TONE_INK,
              indicator:
                "bg-selected group-hover/tab:bg-selected-hover group-pressed/tab:bg-selected-active",
            },
          },
        },
      },
      solid: {
        variants: {
          variant: {
            pill: {
              item: SELECTED_SOLID_INK,
              indicator:
                "bg-selection group-hover/tab:bg-selection-hover group-pressed/tab:bg-selection-hover",
            },
          },
        },
      },
      tint: {
        variants: {
          variant: {
            pill: { item: SELECTED_TINT_INK, indicator: "bg-selection-muted" },
          },
        },
      },
      inverse: {
        variants: {
          variant: {
            pill: {
              item: SELECTED_INVERSE_INK,
              indicator:
                "bg-inverse group-hover/tab:bg-inverse/90 group-pressed/tab:bg-inverse/80",
            },
          },
        },
      },
    },
    weight: {
      regular: { slots: WEIGHT_REGULAR },
      "regular-medium": { slots: WEIGHT_REGULAR_MEDIUM },
      "regular-semibold": { slots: WEIGHT_REGULAR_SEMIBOLD },
      medium: { slots: WEIGHT_MEDIUM },
      "medium-semibold": { slots: WEIGHT_MEDIUM_SEMIBOLD },
      semibold: { slots: WEIGHT_SEMIBOLD },
      bold: { slots: WEIGHT_BOLD },
    },
    case: {
      uppercase: { slots: { item: UPPERCASE } },
    },
  },
})

export type TabsStyles = typeof styles

export { useStyles }
