import { createStyles } from "@/lib/styles"

import bubbleMeta from "./meta"

const { useStyles, styles } = createStyles(bubbleMeta, {
  base: {
    slots: {
      group: "flex min-w-0 flex-col",
      root: [
        "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1",
        "group-data-[role=user]/message:self-end data-[align=end]:self-end",
      ],
      content: [
        "w-fit max-w-full min-w-0 overflow-hidden rounded-(--bubble-radius) border border-transparent wrap-break-word",
        "group-data-[align=end]/bubble:self-end",
      ],
      reactions:
        "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 ring-bg has-[button]:p-0 data-[align=end]:right-3 data-[align=start]:left-3 data-[side=bottom]:bottom-0 data-[side=bottom]:translate-y-3/4 data-[side=top]:top-0 data-[side=top]:-translate-y-3/4",
    },
    variants: {
      variant: {
        primary: {
          root: "*:data-bubble-content:bg-primary *:data-bubble-content:text-fg-on-primary",
        },
        neutral: {
          root: "*:data-bubble-content:bg-neutral *:data-bubble-content:text-fg-on-neutral",
        },
        muted: {
          root: "*:data-bubble-content:bg-muted",
        },
        tinted: {
          root: "*:data-bubble-content:bg-primary-muted",
        },
        outline: {
          root: "*:data-bubble-content:border-border *:data-bubble-content:bg-bg",
        },
        ghost: {
          root: "max-w-full *:data-bubble-content:rounded-none *:data-bubble-content:border-none *:data-bubble-content:bg-transparent *:data-bubble-content:p-0",
        },
        danger: {
          root: "*:data-bubble-content:bg-danger-muted *:data-bubble-content:text-fg-danger",
        },
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
  density: {
    compact: {
      slots: {
        group: "gap-1.5",
        content: "px-2.5 py-1.5 text-xs/relaxed",
        reactions: "text-xs ring-2",
      },
    },
    default: {
      slots: {
        group: "gap-2",
        content: "px-3 py-2 text-sm leading-relaxed",
        reactions: "text-sm ring-3",
      },
    },
    comfortable: {
      slots: {
        group: "gap-2.5",
        content: "px-4 py-2.5 text-sm leading-relaxed",
        reactions: "text-sm ring-3",
      },
    },
  },
})

export type BubbleStyles = typeof styles

export { useStyles }
