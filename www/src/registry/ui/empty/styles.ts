import { createStyles } from '@/lib/styles'

import emptyMeta from './meta'

const { useStyles, styles } = createStyles(emptyMeta, {
  base: {
    slots: {
      base: [
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
        'border-dashed',
      ],
      header: 'flex max-w-sm flex-col items-center',
      title: 'font-heading text-lg font-medium tracking-tight',
      description:
        'text-sm/relaxed text-fg-muted [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
      content:
        'flex w-full max-w-sm min-w-0 flex-col items-center text-balance',
      media:
        'flex shrink-0 items-center justify-center **:[svg]:pointer-events-none **:[svg]:shrink-0',
    },
    variants: {
      variant: {
        default: {
          media: 'bg-transparent',
        },
        icon: {
          media: 'rounded-md bg-muted text-fg',
        },
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
  density: {
    compact: {
      slots: {
        base: 'gap-4 rounded-xl p-6',
        header: 'gap-1',
        title: 'text-sm',
        description: 'text-xs/relaxed',
        content: 'gap-2 text-xs/relaxed',
        media: 'mb-2',
      },
      variants: {
        variant: {
          icon: {
            media: 'size-8 **:[svg]:not-with-[size]:size-4',
          },
        },
      },
    },
    default: {
      slots: {
        base: 'gap-4 rounded-xl p-6',
        header: 'gap-2',
        title: 'text-base',
        description: 'text-sm/relaxed',
        content: 'gap-2.5 text-sm',
        media: 'mb-2',
      },
      variants: {
        variant: {
          icon: {
            media: 'size-9 **:[svg]:not-with-[size]:size-5',
          },
        },
      },
    },
    comfortable: {
      slots: {
        base: 'gap-4 rounded-lg p-12',
        title: 'text-lg',
        description: 'text-sm/relaxed',
        content: 'text-sm',
        media: 'mb-2',
      },
      variants: {
        variant: {
          icon: {
            media: 'size-10 **:[svg]:not-with-[size]:size-6',
          },
        },
      },
    },
  },
})

export type EmptyStyles = typeof styles

export { useStyles }
