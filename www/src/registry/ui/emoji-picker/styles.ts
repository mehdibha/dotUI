import { createStyles } from '@/lib/styles'

import emojiPickerMeta from './meta'

const { useStyles, styles } = createStyles(emojiPickerMeta, {
  base: {
    slots: {
      root: 'flex h-[342px] w-72 flex-col p-1 text-fg',
      search:
        'mb-1 h-9 w-full rounded-(--emoji-picker-radius) border bg-bg px-2.5 text-sm outline-hidden placeholder:text-fg-muted focus-visible:focus-ring',
      viewport: 'relative flex-1 outline-hidden',
      list: 'pb-1 select-none',
      categoryHeader:
        'sticky top-0 z-10 bg-popover px-1.5 pt-2 pb-1 text-xs font-medium text-fg-muted',
      row: 'scroll-my-1 px-1',
      emoji:
        'flex size-8 items-center justify-center rounded-(--emoji-picker-radius) text-lg data-[active]:bg-muted',
      message:
        'absolute inset-0 flex items-center justify-center text-sm text-fg-muted',
    },
  },
})

export type EmojiPickerStyles = typeof styles

export { useStyles }
