import { createStyles } from '@/lib/styles'

import richTextEditorMeta from './meta'

const { useStyles, styles } = createStyles(richTextEditorMeta, {
  base: {
    slots: {
      root: 'group/rich-text-editor flex w-full flex-col overflow-hidden rounded-(--rich-text-editor-radius) border bg-bg',
      toolbar: 'flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1.5',
      separator: 'mx-1 h-5 w-px shrink-0 bg-border',
      content: [
        'min-h-40 overflow-y-auto px-3.5 py-3',
        '[&_.ProseMirror]:min-h-36 [&_.ProseMirror]:outline-none',
        '[&_.ProseMirror_p]:my-2 [&_.ProseMirror_p:first-child]:mt-0 [&_.ProseMirror_p:last-child]:mb-0',
        '[&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2:first-child]:mt-0',
        '[&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5',
        '[&_.ProseMirror_ol]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5',
        '[&_.ProseMirror_li]:my-0.5',
        '[&_.ProseMirror_blockquote]:my-2 [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:text-fg-muted',
        '[&_.ProseMirror_code]:rounded-sm [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[0.85em]',
        '[&_.ProseMirror_pre]:my-2 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:text-sm',
        '[&_.ProseMirror_pre_code]:bg-transparent! [&_.ProseMirror_pre_code]:p-0',
        '[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline',
        // Placeholder for the empty editor. The `data-placeholder` attribute is
        // set on the ProseMirror root; the `:empty` paragraph reveals it. Works
        // for the common single-empty-paragraph case without an extra extension.
        '[&_.ProseMirror[data-placeholder]_p:only-child:empty]:before:pointer-events-none [&_.ProseMirror[data-placeholder]_p:only-child:empty]:before:float-left [&_.ProseMirror[data-placeholder]_p:only-child:empty]:before:h-0 [&_.ProseMirror[data-placeholder]_p:only-child:empty]:before:text-fg-muted [&_.ProseMirror[data-placeholder]_p:only-child:empty]:before:content-[attr(data-placeholder)]',
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type RichTextEditorStyles = typeof styles

export { useStyles }
