import { createStyles } from '@/lib/styles'

import attachmentMeta from './meta'

const { useStyles, styles } = createStyles(attachmentMeta, {
  base: {
    slots: {
      root: 'group/attachment relative flex max-w-full items-center gap-2.5 overflow-hidden rounded-(--attachment-radius) border bg-card p-2 text-left',
      media:
        'flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted text-fg-muted *:[svg]:size-[1.15rem] [&>img]:size-full [&>img]:object-cover',
      content: 'flex min-w-0 flex-1 flex-col',
      title: 'truncate text-sm font-medium text-fg',
      description: 'truncate text-xs text-fg-muted',
      // Sits above the full-card trigger so its buttons stay clickable.
      actions: 'relative z-20 flex shrink-0 items-center gap-0.5',
      action: '',
      // Transparent overlay that makes the whole card one click target.
      trigger:
        'focus-visible:outline-focus absolute inset-0 z-10 cursor-pointer rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2',
      group: 'flex flex-wrap gap-2',
    },
    variants: {
      orientation: {
        horizontal: { root: 'items-center', media: 'size-9' },
        vertical: {
          root: 'w-48 flex-col items-stretch p-0',
          media: 'aspect-video w-full rounded-none',
          content: 'p-2',
        },
      },
      size: {
        sm: { root: 'gap-2 p-1.5', media: 'size-8', title: 'text-xs' },
        md: { root: 'gap-2.5 p-2' },
      },
      state: {
        idle: {},
        uploading: {
          root: 'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-3/5 after:rounded-full after:bg-accent after:content-[""]',
        },
        error: { root: 'border-danger', title: 'text-fg-danger' },
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      size: 'md',
      state: 'idle',
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type AttachmentStyles = typeof styles

export { useStyles }
