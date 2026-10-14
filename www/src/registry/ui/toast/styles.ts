import { createStyles } from "@/lib/styles"

import toastMeta from "./meta"

/* The timing is the studio's (styles.css): entering and restacking on the
   enter leg, a dismissal on the exit leg, a swiped-away toast on its own. */
const toastTransition =
  "transition-[transform,opacity,height,background-color,border-color] duration-(--studio-toast-enter-duration) ease-(--studio-toast-ease) data-ending-style:not-data-swipe-direction:duration-(--studio-toast-exit-duration) data-ending-style:not-data-swipe-direction:ease-(--studio-toast-exit-ease) data-ending-style:data-swipe-direction:duration-(--studio-toast-swipe-state-duration) data-ending-style:data-swipe-direction:ease-(--studio-toast-swipe-state-ease) motion-reduce:transition-none"
const contentTransition =
  "transition-opacity duration-(--studio-toast-enter-duration) ease-(--studio-toast-ease) motion-reduce:transition-none"

const { useStyles, styles } = createStyles(toastMeta, {
  base: {
    slots: {
      viewport: [
        "fixed z-50 mx-auto flex w-[calc(100vw-(var(--toast-inset)*2))] max-w-96 focus-reset outline-none [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(6)]",
        "data-[position*=bottom]:bottom-(--toast-inset) data-[position*=top]:top-(--toast-inset)",
        "data-[position*=center]:left-1/2 data-[position*=center]:-translate-x-1/2 data-[position*=left]:left-(--toast-inset) data-[position*=right]:right-(--toast-inset)",
      ],
      toast: [
        "absolute z-[calc(50-var(--toast-index))] h-(--toast-calc-height) w-full overflow-hidden rounded-(--studio-toast-radius) shadow-(--shadow-modal,var(--shadow-lg)) focus-reset outline-none select-none focus-visible:focus-ring",
        "[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]",
        "after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full data-[position*=bottom]:after:bottom-full data-[position*=top]:after:top-full",
        "data-ending-style:opacity-0 data-limited:opacity-0",
        "data-expanded:h-(--toast-height)",
        "data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-[50%_calc(50%+50%*min(var(--toast-index),1))]",
        "data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-[50%_calc(50%-50%*min(var(--toast-index),1))]",
        "data-[position*=center]:right-0 data-[position*=center]:left-0 data-[position*=left]:right-auto data-[position*=left]:left-0 data-[position*=right]:right-0 data-[position*=right]:left-auto",
        "data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]",
        "data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]",
        "data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
        "data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
        "data-[position*=bottom]:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]",
        "data-[position*=top]:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]",
        "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
        "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
        "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
        "border",
      ],
      content:
        "pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden text-sm data-behind:opacity-0 data-behind:not-data-expanded:pointer-events-none data-expanded:opacity-100",
      body: "flex min-w-0 items-center gap-2",
      icon: "flex size-4 shrink-0 items-center justify-center **:[svg]:size-4 **:[svg]:shrink-0",
      message: "flex min-w-0 flex-1 flex-col gap-0.5",
      // Base UI's title is an <h2>; keep the body face, not the heading's.
      title: "font-sans font-medium tracking-normal empty:hidden",
      description: "empty:hidden",
      actions: "ml-2 flex shrink-0 items-center gap-1",
      action: "max-w-32 empty:hidden **:[span]:truncate",
    },
    variants: {
      // On a solid fill the action is the quiet button in the toast's ink.
      onFill: {
        true: {
          action: "text-current hover:bg-current/10 pressed:bg-current/20",
        },
      },
      position: {
        "top-left": {},
        "top-center": {},
        "top-right": {},
        "bottom-left": {},
        "bottom-center": {},
        "bottom-right": {},
      },
      variant: {
        neutral: {},
        success: {},
        warning: {},
        danger: {},
        error: {},
        info: {},
        loading: {},
      },
    },
    defaultVariants: {
      position: "bottom-right",
      variant: "neutral",
    },
  },
  density: {
    compact: {
      slots: {
        content: "min-h-10 px-3 py-2.5",
        title: "text-[0.8125rem] leading-snug",
        description: "text-xs leading-snug",
      },
    },
    default: {
      slots: {
        content: "min-h-12 px-3.5 py-3",
        title: "text-sm leading-snug",
        description: "text-sm leading-snug",
      },
    },
    comfortable: {
      slots: {
        content: "min-h-16 px-4 py-3.5",
        title: "text-sm leading-snug",
        description: "text-sm leading-snug",
      },
    },
    spacious: {
      slots: {
        content: "min-h-16 px-4 py-3.5",
        title: "text-sm leading-snug",
        description: "text-sm leading-snug",
      },
    },
    touch: {
      slots: {
        content: "min-h-16 px-4 py-3.5",
        title: "text-sm leading-snug",
        description: "text-sm leading-snug",
      },
    },
  },
  params: {
    motion: {
      // Sonner's (shadcn's toast): in from beyond its edge, out sliding down.
      slide: {
        slots: {
          toast: [
            toastTransition,
            "data-[position*=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]",
            "data-[position*=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))]",
            "data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]",
          ],
          content: contentTransition,
        },
      },
      none: {},
    },
    surface: {
      // Sonner (shadcn), Atlassian, Fluent 2, Ant, HeroUI, Chakra, Mantine:
      // the overlay surface, glass included.
      surface: {
        slots: {
          toast:
            "border-(--overlay-border) bg-popover/(--popover-alpha) text-fg [backdrop-filter:var(--popover-backdrop-filter)]",
          content: "[--surface-bg:var(--color-popover)]",
          description: "text-fg-muted",
        },
        variants: { variant: { loading: { icon: "text-fg-muted" } } },
      },
      // Material 3 (snackbar), Polaris, Spectrum 2, Carbon: opaque inverse.
      inverse: {
        slots: {
          toast: "border-transparent bg-inverse text-fg-inverse",
          content: "[--surface-bg:var(--color-inverse)]",
          description: "text-fg-inverse",
        },
      },
    },
    status: {
      // Sonner (shadcn), Fluent 2, Ant, HeroUI, Mantine, Carbon: only the
      // icon carries the status.
      icon: {
        variants: {
          variant: {
            success: { icon: "text-fg-success" },
            warning: { icon: "text-fg-warning" },
            danger: { icon: "text-fg-danger" },
            error: { icon: "text-fg-danger" },
            info: { icon: "text-fg-info" },
          },
        },
      },
      // Carbon (inverse): the solid status color, to read on an inverse
      // surface.
      "solid-icon": {
        variants: {
          variant: {
            success: { icon: "text-success" },
            warning: { icon: "text-warning" },
            danger: { icon: "text-danger" },
            error: { icon: "text-danger" },
            info: { icon: "text-info" },
          },
        },
      },
      // Spectrum 2, Polaris (critical), Chakra, Atlassian (bold): the solid
      // status fill.
      bold: {
        variants: {
          variant: {
            success: {
              toast: "border-transparent bg-success text-fg-on-success",
              content: "[--surface-bg:var(--color-success)]",
              description: "text-fg-on-success",
            },
            warning: {
              toast: "border-transparent bg-warning text-fg-on-warning",
              content: "[--surface-bg:var(--color-warning)]",
              description: "text-fg-on-warning",
            },
            danger: {
              toast: "border-transparent bg-danger text-fg-on-danger",
              content: "[--surface-bg:var(--color-danger)]",
              description: "text-fg-on-danger",
            },
            error: {
              toast: "border-transparent bg-danger text-fg-on-danger",
              content: "[--surface-bg:var(--color-danger)]",
              description: "text-fg-on-danger",
            },
            info: {
              toast: "border-transparent bg-info text-fg-on-info",
              content: "[--surface-bg:var(--color-info)]",
              description: "text-fg-on-info",
            },
          },
        },
      },
      // Sonner (richColors), Carbon (low contrast): the status wash inside
      // a status edge, tinted ink.
      soft: {
        variants: {
          variant: {
            success: {
              toast: "border-border-success bg-success-muted text-fg-success",
              content: "[--surface-bg:var(--color-success-muted)]",
              description: "text-fg-success",
            },
            warning: {
              toast: "border-border-warning bg-warning-muted text-fg-warning",
              content: "[--surface-bg:var(--color-warning-muted)]",
              description: "text-fg-warning",
            },
            danger: {
              toast: "border-border-danger bg-danger-muted text-fg-danger",
              content: "[--surface-bg:var(--color-danger-muted)]",
              description: "text-fg-danger",
            },
            error: {
              toast: "border-border-danger bg-danger-muted text-fg-danger",
              content: "[--surface-bg:var(--color-danger-muted)]",
              description: "text-fg-danger",
            },
            info: {
              toast: "border-border-info bg-info-muted text-fg-info",
              content: "[--surface-bg:var(--color-info-muted)]",
              description: "text-fg-info",
            },
          },
        },
      },
    },
  },
})

export type ToastStyles = typeof styles

export { useStyles }
