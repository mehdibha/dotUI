import { createStyles } from '@/lib/styles'

import toastMeta from './meta'

const { useStyles, styles } = createStyles(toastMeta, {
  base: {
    slots: {
      viewport: [
        'fixed z-50 mx-auto flex w-[calc(100vw-(var(--toast-inset)*2))] max-w-96 focus-reset outline-none [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(6)]',
        'data-[position*=bottom]:bottom-(--toast-inset) data-[position*=top]:top-(--toast-inset)',
        'data-[position*=center]:left-1/2 data-[position*=center]:-translate-x-1/2 data-[position*=left]:left-(--toast-inset) data-[position*=right]:right-(--toast-inset)',
      ],
      toast: [
        'absolute z-[calc(50-var(--toast-index))] h-(--toast-calc-height) w-full overflow-hidden rounded-lg border bg-card text-fg shadow-lg focus-reset outline-none select-none focus-visible:focus-ring',
        '[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]',
        '[transition:transform_500ms_cubic-bezier(.22,1,.36,1),opacity_500ms,height_150ms,background-color_500ms,border-color_500ms]',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_0_rgb(0_0_0_/_0.04)]',
        'after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full data-[position*=bottom]:after:bottom-full data-[position*=top]:after:top-full',
        'data-limited:opacity-0 data-[ending-style]:opacity-0',
        'data-expanded:h-(--toast-height)',
        'data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-[50%_calc(50%+50%*min(var(--toast-index),1))]',
        'data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-[50%_calc(50%-50%*min(var(--toast-index),1))]',
        'data-[position*=center]:right-0 data-[position*=center]:left-0 data-[position*=left]:right-auto data-[position*=left]:left-0 data-[position*=right]:right-0 data-[position*=right]:left-auto',
        'data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]',
        'data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]',
        'data-[position*=bottom]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]',
        'data-[position*=top]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]',
        'data-[position*=bottom]:data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]',
        'data-[position*=top]:data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]',
        'data-[position*=bottom]:data-[starting-style]:[transform:translateY(calc(100%+var(--toast-inset)))]',
        'data-[position*=top]:data-[starting-style]:[transform:translateY(calc(-100%-var(--toast-inset)))]',
        'data-[ending-style]:not-data-limited:not-data-[swipe-direction]:[transform:translateY(calc(100%+var(--toast-inset)))]',
        'data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]',
        'data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]',
        'data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
        'data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
        'data-expanded:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]',
        'data-expanded:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]',
        'data-expanded:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
        'data-expanded:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]',
      ],
      content:
        'pointer-events-auto flex min-h-12 items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm transition-opacity duration-200 data-behind:opacity-0 data-behind:not-data-expanded:pointer-events-none data-expanded:opacity-100',
      body: 'flex min-w-0 items-center gap-2',
      icon: 'flex size-4 shrink-0 items-center justify-center **:[svg]:size-4 **:[svg]:shrink-0',
      message: 'flex min-w-0 flex-1 flex-col gap-0.5',
      title: 'text-sm leading-snug font-medium empty:hidden',
      description: 'text-sm leading-snug text-fg-muted empty:hidden',
      actions: 'ml-2 flex shrink-0 items-center gap-1',
      action:
        'inline-flex h-7 max-w-32 items-center justify-center rounded-md bg-neutral px-2.5 text-xs font-medium text-fg-on-neutral focus-reset transition-colors empty:hidden hover:bg-neutral-hover focus-visible:focus-ring active:bg-neutral-active **:[span]:truncate',
    },
    variants: {
      position: {
        'top-left': {},
        'top-center': {},
        'top-right': {},
        'bottom-left': {},
        'bottom-center': {},
        'bottom-right': {},
      },
      variant: {
        neutral: {
          toast: 'border-border',
        },
        success: {
          toast: 'border-border-success',
          icon: 'text-fg-success',
        },
        warning: {
          toast: 'border-border-warning',
          icon: 'text-fg-warning',
        },
        danger: {
          toast: 'border-border-danger',
          icon: 'text-fg-danger',
        },
        error: {
          toast: 'border-border-danger',
          icon: 'text-fg-danger',
        },
        info: {
          toast: 'border-border-info',
          icon: 'text-fg-info',
        },
        loading: {
          icon: 'animate-spin text-fg-muted',
        },
      },
    },
    defaultVariants: {
      position: 'bottom-right',
      variant: 'neutral',
    },
  },
  density: {
    compact: {
      slots: {
        content: 'min-h-10 px-3 py-2.5',
        title: 'text-[0.8125rem]',
        description: 'text-xs',
      },
    },
    default: {},
    comfortable: {
      slots: {
        content: 'min-h-16 px-4 py-3.5',
      },
    },
  },
})

export type ToastStyles = typeof styles

export { useStyles }
