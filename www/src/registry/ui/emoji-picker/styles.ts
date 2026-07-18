import { createStyles } from '@/lib/styles'

import emojiPickerMeta from './meta'

const { useStyles, styles } = createStyles(emojiPickerMeta, {
  base: {
    slots: {
      root: ['flex max-h-[inherit] w-72 flex-col overflow-hidden text-fg'],
      search: ['m-2 mb-0'],
      content: [
        'h-72 w-full gap-x-0 overscroll-contain p-2',
        '[--grid-list-columns:repeat(auto-fill,minmax(var(--emoji-picker-cell-size),1fr))]',
        'data-empty:text-sm data-empty:text-fg-muted',
      ],
      placeholder: [
        'flex h-72 w-full items-center justify-center text-sm text-fg-muted',
      ],
      sectionHeader: [
        'sticky top-0 z-10 -mx-2 bg-card px-3 py-2 in-data-popover:bg-popover',
      ],
      cell: [
        'h-(--emoji-picker-cell-size) min-h-0 justify-center p-0',
        'rounded-(--emoji-picker-cell-radius)',
      ],
      skinToneSelector: ['w-auto shrink-0'],
      footer: ['flex min-w-0 items-center gap-2 border-t p-2'],
      footerEmoji: ['text-xl'],
      footerLabel: ['truncate text-sm'],
    },
  },
  density: {
    compact: {
      slots: {
        content: 'text-base [--emoji-picker-cell-size:--spacing(7)]',
      },
    },
    default: {
      slots: {
        content: 'text-lg [--emoji-picker-cell-size:--spacing(8)]',
      },
    },
    comfortable: {
      slots: {
        content: 'text-xl [--emoji-picker-cell-size:--spacing(9)]',
      },
    },
  },
})

export type EmojiPickerStyles = typeof styles

export { useStyles }
