import { createStyles } from '@/lib/styles'

import switchMeta from './meta'

const { useStyles, styles } = createStyles(switchMeta, {
  base: {
    slots: {
      root: 'flex items-center has-data-description:items-start',
      control: [
        'relative flex items-center gap-2 rounded-(--switch-radius) focus-reset not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:focus-ring disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--switch-card-radius)',
        'transition-colors duration-75 has-data-label:w-full has-data-label:justify-between has-data-label:border has-data-label:p-2.5 has-data-label:selected:border-accent/25 has-data-label:selected:bg-accent-muted',
      ],
      indicator: [
        'inline-flex shrink-0 cursor-pointer items-center rounded-(--switch-radius) border border-transparent bg-neutral p-0.5 transition-[background-color,border-color,box-shadow] duration-200',
        'selected:bg-selection',
        'read-only:cursor-default disabled:cursor-disabled disabled:border-border-disabled disabled:bg-transparent disabled:selected:border-transparent disabled:selected:bg-disabled',
      ],
      thumb: [
        'pointer-events-none block rounded-(--switch-radius) bg-thumb shadow-sm transition-[background-color,margin,width] duration-200',
        'disabled:bg-fg-disabled',
      ],
    },
    variants: {
      size: {
        sm: {
          indicator: 'h-5 w-9',
          thumb: 'size-4 pressed:w-5 selected:ml-4 selected:pressed:ml-3',
        },
        md: {
          indicator: 'h-6 w-11',
          thumb: 'size-5 pressed:w-6 selected:ml-5 selected:pressed:ml-4',
        },
        lg: {
          indicator: 'h-7 w-13',
          thumb: 'size-6 pressed:w-7 selected:ml-6 selected:pressed:ml-5',
        },
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
  density: {
    compact: {
      slots: {
        root: 'gap-2',
      },
    },
    default: {
      slots: {
        root: 'gap-2',
      },
    },
    comfortable: {
      slots: {
        root: 'gap-3',
      },
    },
  },
})

export type SwitchStyles = typeof styles

export { useStyles }
