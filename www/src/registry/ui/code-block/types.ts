import type { ComponentProps } from 'react'

/**
 * A code block highlights a snippet with Shiki using dual light/dark themes,
 * with an optional filename header and a copy-to-clipboard button.
 */
export interface CodeBlockProps extends Omit<
  ComponentProps<'figure'>,
  'children'
> {
  /** The source code to display. */
  code: string
  /** The language to highlight. @default 'tsx' */
  lang?: string
  /** Optional filename shown in the header. */
  title?: string
  /** Show a line-number gutter. */
  showLineNumbers?: boolean
}
