import { createStyles } from '@/lib/styles'

import codeEditorMeta from './meta'

const { useStyles, styles } = createStyles(codeEditorMeta, {
  base: {
    slots: {
      root: 'flex flex-col overflow-hidden rounded-(--code-editor-radius) border bg-card text-fg',
      header:
        'flex items-center justify-between gap-2 border-b px-3 py-1.5 text-fg-muted',
      filename: 'truncate font-mono',
      language: 'shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono uppercase',
      editor:
        'min-h-0 flex-1 [&_.cm-editor]:bg-transparent! [&_.cm-editor.cm-focused]:outline-none [&_.cm-gutters]:border-none [&_.cm-gutters]:bg-transparent! [&_.cm-scroller]:font-mono',
    },
  },
  density: {
    compact: {
      slots: {
        header: 'text-xs',
        language: 'text-[0.625rem]',
        editor: '[&_.cm-scroller]:text-xs',
      },
    },
    default: {
      slots: {
        header: 'text-xs',
        language: 'text-[0.625rem]',
        editor: '[&_.cm-scroller]:text-sm',
      },
    },
    comfortable: {
      slots: {
        header: 'text-sm',
        language: 'text-xs',
        editor: '[&_.cm-scroller]:text-sm',
      },
    },
  },
})

export type CodeEditorStyles = typeof styles

export { useStyles }
