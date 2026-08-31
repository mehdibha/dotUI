import { createStyles } from "@/lib/styles"

import messageScrollerMeta from "./meta"

const { useStyles, styles } = createStyles(messageScrollerMeta, {
  base: {
    slots: {
      root: "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
      viewport:
        "size-full min-h-0 min-w-0 [scrollbar-width:thin] overflow-y-auto overscroll-contain contain-content",
      content: "flex h-max min-h-full flex-col",
      item: "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
      button: [
        "absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
        "transition-[translate,scale,opacity] duration-200",
        "data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)]",
        "data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)]",
        "data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full",
        "data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full data-[direction=start]:*:[svg]:rotate-180",
      ],
    },
  },
  density: {
    compact: {
      slots: {
        content: "gap-4",
      },
    },
    default: {
      slots: {
        content: "gap-6",
      },
    },
    comfortable: {
      slots: {
        content: "gap-8",
      },
    },
  },
})

export type MessageScrollerStyles = typeof styles

export { useStyles }
