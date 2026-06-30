'use client'

import { useEffect, useState } from 'react'
import type { ComponentProps } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { codeToHtml } from 'shiki'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: CodeBlock

interface CodeBlockProps extends Omit<ComponentProps<'figure'>, 'children'> {
  code: string
  lang?: string
  title?: string
  showLineNumbers?: boolean
}

const CodeBlock = ({
  code,
  lang = 'tsx',
  title,
  showLineNumbers,
  className,
  ...props
}: CodeBlockProps) => {
  const { root, header, title: titleStyle, body, content } = useStyles()()
  const html = useHighlightedCode(code, lang)
  return (
    <figure data-code-block="" className={root({ className })} {...props}>
      {title ? (
        <div data-code-block-header="" className={header()}>
          <figcaption className={titleStyle()}>{title}</figcaption>
          <CopyButton code={code} />
        </div>
      ) : null}
      <div data-code-block-body="" className={body()}>
        {html ? (
          <div
            data-line-numbers={showLineNumbers || undefined}
            className={content()}
            // oxlint-disable-next-line no-danger -- Shiki-generated markup; code content is escaped by the highlighter
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div
            data-line-numbers={showLineNumbers || undefined}
            className={content()}
          >
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        )}
        {title ? null : (
          <div className="absolute top-2 right-2">
            <CopyButton code={code} />
          </div>
        )}
      </div>
    </figure>
  )
}

// MARK: CopyButton

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <Button
      variant="quiet"
      size="xs"
      isIconOnly
      onPress={copy}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  )
}

// MARK: useHighlightedCode

const useHighlightedCode = (code: string, lang: string) => {
  const [html, setHtml] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    codeToHtml(code, {
      lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
      .then((result) => {
        if (active) setHtml(result)
      })
      .catch(() => {
        if (active) setHtml(null)
      })
    return () => {
      active = false
    }
  }, [code, lang])
  return html
}

// MARK: Separator

export type { CodeBlockProps }
export { CodeBlock }
