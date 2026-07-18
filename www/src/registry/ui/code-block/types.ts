import type { ButtonProps } from '@/registry/ui/button'

/**
 * A code block displays code with optional syntax highlighting, a title bar,
 * and a copy action.
 */
export interface CodeBlockProps extends React.ComponentProps<'figure'> {}

/**
 * The header of the code block. Contains the title and actions such as the copy button.
 */
export interface CodeBlockHeaderProps extends React.ComponentProps<'div'> {}

/**
 * The title of the code block, typically a file name.
 */
export interface CodeBlockTitleProps extends React.ComponentProps<'figcaption'> {}

/**
 * The scrollable body of the code block. Renders pre-highlighted HTML, plain
 * code, or custom children.
 */
export interface CodeBlockContentProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /**
   * Raw code, rendered as plain (unhighlighted) text when no `html` is given.
   */
  code?: string
  /**
   * Pre-highlighted HTML from `highlightCode` — takes precedence over `code`.
   */
  html?: string
  /**
   * Show line numbers in the gutter.
   */
  showLineNumbers?: boolean
  /**
   * Wrap long lines instead of scrolling horizontally.
   */
  wrap?: boolean
  /**
   * Custom-rendered code (e.g. a server-rendered HAST tree) — takes precedence over `html`.
   */
  children?: React.ReactNode
}

/**
 * A button that copies the block's code to the clipboard.
 */
export interface CodeBlockCopyButtonProps extends ButtonProps {
  /**
   * Text to copy. Defaults to the text content of the block's `<pre>`.
   */
  text?: string
  /**
   * How long the copied state is shown, in milliseconds.
   *
   * @default 2000
   */
  timeout?: number
}
