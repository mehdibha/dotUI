import { createStyles } from '@/lib/styles'

import aiAssistantMeta from './meta'

const { useStyles, styles } = createStyles(aiAssistantMeta, {
  base: {
    slots: {
      root: 'group/ai-assistant flex flex-col overflow-hidden rounded-(--ai-assistant-radius) border bg-card',
      messages: 'flex flex-1 flex-col gap-4 overflow-y-auto p-4',
      message: 'flex w-full items-end gap-2 data-[role=user]:flex-row-reverse',
      avatar: 'mb-0.5 shrink-0',
      bubble: [
        'max-w-[75%] rounded-(--ai-assistant-radius) px-3 py-2 text-sm whitespace-pre-wrap',
        'data-[role=assistant]:bg-muted data-[role=assistant]:text-fg',
        'data-[role=user]:bg-primary data-[role=user]:text-fg-on-primary',
      ],
      input: 'flex items-end gap-2 border-t p-3',
      field: 'flex-1',
    },
  },
  density: {
    compact: {
      slots: {
        messages: 'gap-3 p-3',
      },
    },
    default: {
      slots: {},
    },
    comfortable: {
      slots: {
        messages: 'gap-5 p-5',
      },
    },
  },
})

export type AiAssistantStyles = typeof styles

export { useStyles }
