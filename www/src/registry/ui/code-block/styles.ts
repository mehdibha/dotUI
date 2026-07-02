import { createStyles } from '@/lib/styles'

import codeBlockMeta from './meta'

const { useStyles, styles } = createStyles(codeBlockMeta, {
  base: {
    slots: {
      root: 'overflow-hidden rounded-(--code-block-radius) border bg-card text-fg',
      header:
        'flex items-center justify-between gap-2 border-b py-1.5 pr-1.5 pl-3 [&_[data-button]]:text-fg-muted',
      title: 'truncate font-mono text-[0.8125rem] text-fg-muted',
      body: 'relative [&_[data-button]]:text-fg-muted',
      content: [
        'overflow-x-auto py-3 font-mono text-[0.8125rem] leading-relaxed',
        '[&_pre]:bg-transparent! [&_pre]:[tab-size:2] [&_pre]:outline-hidden',
        '[&_code]:grid [&_code]:min-w-full',
        '[&_.line]:px-4',
        '[&_code_span]:text-(--shiki-light) dark:[&_code_span]:text-(--shiki-dark)',
        '[&[data-line-numbers]_code]:[counter-reset:line]',
        '[&[data-line-numbers]_.line]:before:mr-4 [&[data-line-numbers]_.line]:before:inline-block [&[data-line-numbers]_.line]:before:w-[1ch] [&[data-line-numbers]_.line]:before:text-right [&[data-line-numbers]_.line]:before:text-fg-muted [&[data-line-numbers]_.line]:before:content-[counter(line)] [&[data-line-numbers]_.line]:before:[counter-increment:line]',
        '[&_.highlighted]:bg-selected/60',
      ],
    },
  },
})

export type CodeBlockStyles = typeof styles

export { useStyles }
