'use client'

import * as React from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { highlightCode } from '@/registry/lib/highlight'
import type { HighlightCodeOptions } from '@/registry/lib/highlight'
import { Button } from '@/registry/ui/button'
import type { ButtonProps } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: codeBlockStyles

const CodeBlockContext =
  React.createContext<React.RefObject<HTMLElement | null> | null>(null)

// MARK: CodeBlock

interface CodeBlockProps extends React.ComponentProps<'figure'> {}

const CodeBlock = ({ className, ...props }: CodeBlockProps) => {
  const containerRef = React.useRef<HTMLElement>(null)
  const { root } = useStyles()()
  return (
    <CodeBlockContext.Provider value={containerRef}>
      <figure
        ref={containerRef}
        data-code-block=""
        className={root({ className })}
        {...props}
      />
    </CodeBlockContext.Provider>
  )
}

// MARK: CodeBlockHeader

interface CodeBlockHeaderProps extends React.ComponentProps<'div'> {}

const CodeBlockHeader = ({ className, ...props }: CodeBlockHeaderProps) => {
  const { header } = useStyles()()
  return (
    <div
      data-code-block-header=""
      className={header({ className })}
      {...props}
    />
  )
}

// MARK: CodeBlockTitle

interface CodeBlockTitleProps extends React.ComponentProps<'figcaption'> {}

const CodeBlockTitle = ({ className, ...props }: CodeBlockTitleProps) => {
  const { title } = useStyles()()
  return (
    <figcaption
      data-code-block-title=""
      className={title({ className })}
      {...props}
    />
  )
}

// MARK: CodeBlockContent

interface CodeBlockContentProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /** Raw code, rendered as plain (unhighlighted) text when no `html` is given. */
  code?: string
  /** Pre-highlighted HTML from `highlightCode` — takes precedence over `code`. */
  html?: string
  showLineNumbers?: boolean
  wrap?: boolean
  /** Custom-rendered code (e.g. a server-rendered HAST tree) — takes precedence over `html`. */
  children?: React.ReactNode
}

const CodeBlockContent = ({
  code,
  html,
  showLineNumbers,
  wrap,
  children,
  className,
  ...props
}: CodeBlockContentProps) => {
  const { content } = useStyles()()
  const contentClassName = content({ showLineNumbers, wrap, className })

  if (children !== undefined) {
    return (
      <div data-code-block-content="" className={contentClassName} {...props}>
        {children}
      </div>
    )
  }

  if (html !== undefined) {
    return (
      <div
        data-code-block-content=""
        className={contentClassName}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    )
  }

  const lines = (code ?? '').split('\n')
  return (
    <div data-code-block-content="" className={contentClassName} {...props}>
      <pre>
        <code>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              <span className="line">{line}</span>
              {index < lines.length - 1 ? '\n' : null}
            </React.Fragment>
          ))}
        </code>
      </pre>
    </div>
  )
}

// MARK: CodeBlockCopyButton

interface CodeBlockCopyButtonProps extends ButtonProps {
  /** Text to copy. Defaults to the text content of the block's `<pre>`. */
  text?: string
  /** How long the copied state is shown, in milliseconds. */
  timeout?: number
}

const CodeBlockCopyButton = ({
  text,
  timeout = 2000,
  onPress,
  children,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const containerRef = React.useContext(CodeBlockContext)

  React.useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <Button
      variant="quiet"
      size="xs"
      isIconOnly
      aria-label={isCopied ? 'Copied' : 'Copy code'}
      {...props}
      onPress={(e) => {
        const value =
          text ??
          containerRef?.current?.getElementsByTagName('pre').item(0)
            ?.textContent ??
          ''
        if (value) {
          void navigator.clipboard.writeText(value)
          setIsCopied(true)
          clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => setIsCopied(false), timeout)
        }
        onPress?.(e)
      }}
    >
      {children ?? (isCopied ? <CheckIcon /> : <CopyIcon />)}
    </Button>
  )
}

// MARK: useHighlightedCode

/**
 * Client-side highlighting: returns `null` until shiki (lazy-loaded) has
 * highlighted the code, then the HTML for `CodeBlockContent`'s `html` prop.
 */
function useHighlightedCode(
  code: string,
  lang?: HighlightCodeOptions['lang'],
): string | null {
  const [html, setHtml] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    void highlightCode(code, { lang }).then((result) => {
      if (!cancelled) setHtml(result)
    })
    return () => {
      cancelled = true
    }
  }, [code, lang])

  return html
}

// MARK: separator

export type {
  CodeBlockContentProps,
  CodeBlockCopyButtonProps,
  CodeBlockHeaderProps,
  CodeBlockProps,
  CodeBlockTitleProps,
}
export {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useHighlightedCode,
}
