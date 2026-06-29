import { createStyles } from '@/lib/styles'

import messageMeta from './meta'

const { useStyles, styles } = createStyles(messageMeta, {
  base: {
    slots: {
      // Row: avatar + body, laid out per author. `group/message` lets the
      // hover-revealed actions and author-aware children hook off the row.
      root: 'group/message flex w-full gap-2.5',
      avatar: 'mt-0.5 shrink-0',
      body: 'flex max-w-[80%] min-w-0 flex-col gap-1',
      header: 'flex items-center gap-2 px-0.5 text-xs text-fg-muted',
      // The bubble surface — colors + tightened tail corner resolve from `from`.
      bubble: [
        'w-fit max-w-full rounded-(--message-radius) px-3.5 py-2 text-sm break-words whitespace-pre-wrap',
        '[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2',
        '[&_:where(p):not(:first-child)]:mt-2',
      ],
      // Per-message controls (copy, retry…) — revealed on row hover/focus.
      actions: [
        'flex items-center gap-0.5 px-0.5 text-fg-muted opacity-0 transition-opacity',
        'group-focus-within/message:opacity-100 group-hover/message:opacity-100',
        '[@media(hover:none)]:opacity-100',
      ],
      // Consecutive turns from one author, tightened together.
      group: 'flex flex-col gap-1',
      // Centered status / separator row between turns.
      marker:
        'relative flex w-full items-center justify-center gap-3 py-2 text-xs text-fg-muted select-none',
      markerLabel: 'shrink-0',
      shimmer:
        'animate-[dotui-message-shimmer_2.5s_linear_infinite] [background-image:linear-gradient(100deg,var(--color-fg-muted)_35%,var(--color-fg)_50%,var(--color-fg-muted)_65%)] [background-size:200%_100%] bg-clip-text text-transparent motion-reduce:animate-none motion-reduce:text-fg-muted',
      // File / image attachment card.
      attachment:
        'group/attachment relative flex max-w-full items-center gap-2.5 overflow-hidden rounded-(--message-radius) border bg-card p-2 pr-3 text-left',
      attachmentMedia:
        'flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted text-fg-muted *:[svg]:size-4.5 [&>img]:size-full [&>img]:object-cover',
      attachmentInfo: 'flex min-w-0 flex-col',
      attachmentName: 'truncate text-sm font-medium',
      attachmentMeta: 'truncate text-xs text-fg-muted',
    },
    variants: {
      from: {
        user: {
          root: 'flex-row-reverse',
          body: 'items-end',
          bubble: 'rounded-br-sm bg-primary text-fg-on-primary',
        },
        assistant: {
          bubble: 'rounded-bl-sm bg-muted text-fg',
        },
      },
      variant: {
        separator: {
          marker:
            'before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border',
        },
        note: {
          markerLabel: 'rounded-full bg-muted px-2.5 py-1',
        },
        status: {
          marker: 'justify-start',
        },
      },
    },
    defaultVariants: {
      from: 'assistant',
      variant: 'separator',
    },
  },
  density: {
    compact: {
      slots: {
        root: 'gap-2',
        body: 'gap-0.5',
        header: 'text-[0.6875rem]',
        bubble: 'px-3 py-1.5 text-xs',
      },
    },
    default: {
      slots: {
        bubble: 'px-3.5 py-2 text-sm',
      },
    },
    comfortable: {
      slots: {
        root: 'gap-3',
        body: 'gap-1.5',
        bubble: 'px-4 py-2.5 text-sm',
      },
    },
  },
})

export type MessageStyles = typeof styles

export { useStyles }
