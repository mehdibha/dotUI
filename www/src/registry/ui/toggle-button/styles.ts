import { createStyles } from '@/lib/styles'

import toggleButtonMeta from './meta'

const { useStyles, styles } = createStyles(toggleButtonMeta, {
  base: {
    base: [
      'group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) whitespace-nowrap shadow-[var(--shadow-control,none)] transition-[background-color,border-color,color,box-shadow] select-none',
      'focus-reset focus-visible:focus-ring',
      '**:[svg]:pointer-events-none **:[svg]:shrink-0',
      'selected:border-border-active selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active',
      'disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled',
    ],
    variants: {
      variant: {
        default:
          'border bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover pressed:border-border-active pressed:bg-neutral-active selected:not-data-disabled:border-border-active',
        primary:
          'bg-primary text-fg-on-primary [--color-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0 pressed:bg-primary-active',
        quiet:
          'bg-transparent text-fg hover:bg-inverse/10 pressed:bg-inverse/20',
      },
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
      },
      isIconOnly: {
        true: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
  density: {
    compact: {
      base: 'gap-1 text-xs/relaxed',
      variants: {
        size: {
          xs: 'h-5 rounded-sm px-2 text-[0.625rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-5 **:[svg]:not-with-[size]:size-2.5',
          sm: 'h-6 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3',
          md: 'h-7 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5',
          lg: 'h-8 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-4',
        },
      },
    },
    default: {
      base: 'text-sm *:[svg]:not-with-[size]:size-4',
      variants: {
        size: {
          xs: 'h-6 gap-1 px-2 text-xs has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3',
          sm: 'h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5',
          md: 'h-8 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-3.5',
          lg: 'h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9 **:[svg]:not-with-[size]:size-4',
        },
      },
    },
    comfortable: {
      base: 'text-sm *:[svg]:not-with-[size]:size-4',
      variants: {
        size: {
          xs: 'h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5',
          sm: 'h-8 gap-1 px-2.5 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-8',
          md: 'h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9',
          lg: 'h-10 gap-1.5 px-3 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-10',
        },
      },
    },
  },
})

export type ToggleButtonStyles = typeof styles

export { styles as toggleButtonStyles, useStyles }
