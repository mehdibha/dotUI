import { createStyles } from '@/lib/styles'

import codeBlockMeta from './meta'

const { useStyles, styles } = createStyles(codeBlockMeta, {
  base: {
    slots: {
      root: 'relative flex flex-col overflow-hidden rounded-(--code-block-radius) border bg-card text-fg',
      header:
        'flex items-center gap-2 border-b **:[svg]:shrink-0 **:[svg]:text-fg-muted',
      title: 'flex-1 truncate font-mono text-fg-muted',
      content: [
        'relative overflow-auto [counter-reset:line]',
        // pre — descendant selectors so shiki's own <pre> output styles the same
        // as the plain-code fallback
        '**:[pre]:w-max **:[pre]:min-w-full **:[pre]:bg-transparent **:[pre]:[tab-size:2]',
        // tokens: shiki dual-theme CSS variables
        '**:[code]:**:[span]:text-(--shiki-light) dark:**:[code]:**:[span]:text-(--shiki-dark)',
        // code
        '**:[code]:flex **:[code]:w-full **:[code]:flex-col',
        // line
        '**:[.line]:relative **:[.line]:min-h-lh',
        // line highlight (shiki transformers)
        "**:[.highlighted]:bg-selected/70! **:[.highlighted]:before:absolute **:[.highlighted]:before:inset-y-0 **:[.highlighted]:before:left-0 **:[.highlighted]:before:w-0.5 **:[.highlighted]:before:bg-fg/40 **:[.highlighted]:before:content-['']",
        // diff (shiki transformers)
        '**:[.diff]:before:absolute **:[.diff]:before:inset-y-0 **:[.diff]:before:left-0.5 **:[.diff]:before:w-0.5',
        "**:[.diff.add]:bg-success/15 **:[.diff.add]:before:text-success **:[.diff.add]:before:content-['+']",
        "**:[.diff.remove]:bg-danger/20 **:[.diff.remove]:before:text-danger **:[.diff.remove]:before:content-['-']",
      ],
    },
    variants: {
      showLineNumbers: {
        true: {
          content:
            '**:[.line]:pl-10! **:[.line]:[counter-increment:line] **:[.line]:after:absolute **:[.line]:after:left-2.5 **:[.line]:after:text-fg-muted/60 **:[.line]:after:content-[counter(line)]',
        },
      },
      wrap: {
        true: {
          content:
            '**:[.line]:break-words **:[pre]:w-full **:[pre]:whitespace-pre-wrap',
        },
      },
    },
  },
  density: {
    compact: {
      slots: {
        header: 'py-1 pr-1 pl-2 **:[svg]:size-3',
        title: 'text-xs',
        content:
          '**:[.line]:px-3 **:[.line]:after:text-[0.625rem] **:[code]:text-xs **:[pre]:py-2.5',
      },
    },
    default: {
      slots: {
        header: 'py-1.5 pr-1.5 pl-2.5 **:[svg]:size-3.5',
        title: 'text-[0.8125rem]',
        content:
          '**:[.line]:px-3.5 **:[.line]:after:text-xs **:[code]:text-[0.8125rem] **:[pre]:py-3',
      },
    },
    comfortable: {
      slots: {
        header: 'py-2 pr-2 pl-3 **:[svg]:size-4',
        title: 'text-sm',
        content:
          '**:[.line]:px-4 **:[.line]:after:text-xs **:[code]:text-sm **:[pre]:py-3.5',
      },
    },
  },
  params: {
    style: {
      default: {
        slots: {
          root: '',
          header: '',
          title: '',
          content: '',
        },
      },
      monastir: {
        slots: {
          root: 'border-transparent bg-muted',
          header: 'border-border/50',
          title: '',
          content: '',
        },
      },
    },
  },
})

export type CodeBlockStyles = typeof styles

export { useStyles }
