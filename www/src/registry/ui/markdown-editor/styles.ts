import { createStyles } from '@/lib/styles'

import markdownEditorMeta from './meta'

const { useStyles, styles } = createStyles(markdownEditorMeta, {
  base: {
    slots: {
      root: [
        'flex w-full flex-col overflow-hidden rounded-(--markdown-editor-radius) border border-border-field bg-field',
        'focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus-muted',
        'transition-[box-shadow,border-color]',
      ],
      toolbar: [
        'flex items-center gap-2 border-b border-border-field px-2 py-1.5',
      ],
      toolbarGroup: 'flex items-center gap-0.5',
      tabList: 'ml-auto',
      textarea: [
        'min-h-40 w-full resize-y bg-transparent! px-3 py-2.5 font-mono text-fg outline-none',
        'placeholder:text-fg-muted disabled:cursor-disabled disabled:text-fg-disabled',
      ],
      preview: [
        'min-h-40 px-3 py-2.5 text-fg',
        // Prose-like rendering of the parsed markdown.
        'space-y-3 leading-relaxed break-words',
        '[&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold',
        '[&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-fg-muted',
        '[&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-fg-muted',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]',
        '[&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre_code]:bg-transparent! [&_pre_code]:p-0',
        '[&_hr]:border-border [&_table]:w-full [&_table]:border-collapse',
        '[&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:font-medium',
        '[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1',
        'empty:text-fg-muted',
      ],
    },
  },
  density: {
    compact: {
      slots: {
        textarea: 'text-xs/relaxed',
        preview: 'text-xs/relaxed',
      },
    },
    default: {
      slots: {
        textarea: 'text-sm',
        preview: 'text-sm',
      },
    },
    comfortable: {
      slots: {
        textarea: 'text-sm',
        preview: 'text-sm',
      },
    },
  },
})

export type MarkdownEditorStyles = typeof styles

export { useStyles }
