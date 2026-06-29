import { createStyles } from '@/lib/styles'

import conversationMeta from './meta'

const { useStyles, styles } = createStyles(conversationMeta, {
  base: {
    slots: {
      // Relative shell that clips the scroller and anchors the fades + button.
      // `--conversation-fade` is the color the edges fade to — override it when
      // the conversation sits on a non-default surface (e.g. a card).
      root: 'group/conversation relative flex h-full min-h-0 flex-col overflow-hidden [--conversation-fade:var(--color-bg)]',
      content:
        'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain',
      // Scroll-aware edge fades — top appears once scrolled, bottom hides at the
      // end of the thread (a hint that more sits below).
      fadeTop:
        'pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-[var(--conversation-fade)] to-transparent opacity-0 transition-opacity duration-200 group-data-[scrolled]/conversation:opacity-100',
      fadeBottom:
        'pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-[var(--conversation-fade)] to-transparent opacity-100 transition-opacity duration-200 group-data-[at-bottom]/conversation:opacity-0',
      scrollButton:
        'pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded-full opacity-0 shadow-md transition duration-200 data-[visible]:pointer-events-auto data-[visible]:translate-y-0 data-[visible]:opacity-100',
      empty:
        'flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center',
      emptyIcon:
        'flex size-11 items-center justify-center rounded-full bg-muted text-fg-muted *:[svg]:size-5',
      emptyTitle: 'text-base font-medium text-fg',
      emptyDescription: 'max-w-sm text-sm text-pretty text-fg-muted',
    },
  },
  density: {
    compact: { slots: { content: 'gap-3 p-3' } },
    default: { slots: { content: 'gap-5 p-4' } },
    comfortable: { slots: { content: 'gap-6 p-5' } },
  },
})

export type ConversationStyles = typeof styles

export { useStyles }
