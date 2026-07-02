'use client'

import * as React from 'react'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
} from 'lucide-react'
import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { createContext } from '@/registry/lib/context'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'
import { ToggleButton } from '@/registry/ui/toggle-button'

import { useStyles } from './styles'

// MARK: markdownEditorStyles

interface MarkdownEditorContextValue {
  value: string
  setValue: (value: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const [MarkdownEditorProvider, useMarkdownEditorContext] =
  createContext<MarkdownEditorContextValue>({
    name: 'MarkdownEditorContext',
  })

// MARK: Selection transforms

type TransformKind = 'wrap' | 'line-prefix' | 'link'

interface SelectionTransform {
  kind: TransformKind
  /** Text inserted on each side for `wrap`. */
  marker?: string
  /** Prefix prepended to the selected line(s) for `line-prefix`. */
  prefix?: string
  /** Fallback text inserted when nothing is selected. */
  placeholder?: string
}

interface TransformResult {
  next: string
  selectionStart: number
  selectionEnd: number
}

function applyTransform(
  value: string,
  start: number,
  end: number,
  transform: SelectionTransform,
): TransformResult {
  const selected = value.slice(start, end)
  const before = value.slice(0, start)
  const after = value.slice(end)
  const placeholder = transform.placeholder ?? ''

  if (transform.kind === 'wrap') {
    const marker = transform.marker ?? ''
    const inner = selected || placeholder
    const next = `${before}${marker}${inner}${marker}${after}`
    const innerStart = start + marker.length
    return {
      next,
      selectionStart: innerStart,
      selectionEnd: innerStart + inner.length,
    }
  }

  if (transform.kind === 'link') {
    const label = selected || placeholder || 'text'
    const snippet = `[${label}](url)`
    const next = `${before}${snippet}${after}`
    // Place the caret around the `url` placeholder so the user can type it.
    const urlStart = start + label.length + 3
    return {
      next,
      selectionStart: urlStart,
      selectionEnd: urlStart + 3,
    }
  }

  // line-prefix
  const prefix = transform.prefix ?? ''
  const lineStart = before.lastIndexOf('\n') + 1
  const head = value.slice(0, lineStart)
  const block = value.slice(lineStart, end)
  const prefixed = block
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')
  const next = `${head}${prefixed}${after}`
  return {
    next,
    selectionStart: lineStart,
    selectionEnd: lineStart + prefixed.length,
  }
}

const TRANSFORMS: Record<string, SelectionTransform> = {
  bold: { kind: 'wrap', marker: '**', placeholder: 'bold text' },
  italic: { kind: 'wrap', marker: '_', placeholder: 'italic text' },
  list: { kind: 'line-prefix', prefix: '- ' },
  link: { kind: 'link', placeholder: 'link text' },
  code: { kind: 'wrap', marker: '`', placeholder: 'code' },
}

// MARK: MarkdownEditor

interface MarkdownEditorProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  /** The current markdown source. Controlled. */
  value: string
  /** Called with the next markdown source whenever it changes. */
  onChange: (value: string) => void
}

const MarkdownEditor = ({
  value,
  onChange,
  className,
  children,
  ...props
}: MarkdownEditorProps) => {
  const { root } = useStyles()()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const ctx = React.useMemo<MarkdownEditorContextValue>(
    () => ({ value, setValue: onChange, textareaRef }),
    [value, onChange],
  )

  return (
    <MarkdownEditorProvider value={ctx}>
      <Tabs>
        <div data-markdown-editor="" className={root({ className })} {...props}>
          {children}
        </div>
      </Tabs>
    </MarkdownEditorProvider>
  )
}

// MARK: MarkdownEditorToolbar

interface MarkdownEditorToolbarProps extends React.ComponentProps<'div'> {}

const MarkdownEditorToolbar = ({
  className,
  children,
  ...props
}: MarkdownEditorToolbarProps) => {
  const { toolbar, toolbarGroup, tabList } = useStyles()()
  return (
    <div
      data-markdown-editor-toolbar=""
      role="toolbar"
      className={toolbar({ className })}
      {...props}
    >
      <div className={toolbarGroup()}>
        {children ?? (
          <>
            <MarkdownEditorAction transform="bold" aria-label="Bold">
              <BoldIcon />
            </MarkdownEditorAction>
            <MarkdownEditorAction transform="italic" aria-label="Italic">
              <ItalicIcon />
            </MarkdownEditorAction>
            <MarkdownEditorAction transform="list" aria-label="Bulleted list">
              <ListIcon />
            </MarkdownEditorAction>
            <MarkdownEditorAction transform="link" aria-label="Link">
              <LinkIcon />
            </MarkdownEditorAction>
            <MarkdownEditorAction transform="code" aria-label="Inline code">
              <CodeIcon />
            </MarkdownEditorAction>
          </>
        )}
      </div>
      <TabList className={tabList()}>
        <Tab id="write">Write</Tab>
        <Tab id="preview">Preview</Tab>
      </TabList>
    </div>
  )
}

// MARK: MarkdownEditorAction

interface MarkdownEditorActionProps extends React.ComponentProps<
  typeof ToggleButton
> {
  /** Which built-in markdown transform this button applies to the selection. */
  transform: keyof typeof TRANSFORMS
}

const MarkdownEditorAction = ({
  transform,
  ...props
}: MarkdownEditorActionProps) => {
  const { value, setValue, textareaRef } = useMarkdownEditorContext(
    'MarkdownEditorAction',
  )

  const onPress = () => {
    const el = textareaRef.current
    const def = TRANSFORMS[transform]
    if (!def) return
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const result = applyTransform(value, start, end, def)
    setValue(result.next)
    // Restore selection after React commits the new value.
    requestAnimationFrame(() => {
      const node = textareaRef.current
      if (!node) return
      node.focus()
      node.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  return (
    <ToggleButton
      variant="quiet"
      size="sm"
      isIconOnly
      onPress={onPress}
      {...props}
    />
  )
}

// MARK: MarkdownEditorWrite

interface MarkdownEditorWriteProps extends Omit<
  React.ComponentProps<'textarea'>,
  'value' | 'onChange'
> {}

const MarkdownEditorWrite = ({
  className,
  ...props
}: MarkdownEditorWriteProps) => {
  const { textarea } = useStyles()()
  const { value, setValue, textareaRef } = useMarkdownEditorContext(
    'MarkdownEditorWrite',
  )
  return (
    <TabPanel id="write">
      <textarea
        ref={textareaRef}
        data-markdown-editor-textarea=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck
        className={textarea({ className })}
        {...props}
      />
    </TabPanel>
  )
}

// MARK: MarkdownEditorPreview

interface MarkdownEditorPreviewProps extends React.ComponentProps<'div'> {
  /** Override the react-markdown component map for custom rendering. */
  components?: Components
  /** Placeholder shown when there is nothing to preview. */
  placeholder?: string
}

const MarkdownEditorPreview = ({
  className,
  components,
  placeholder = 'Nothing to preview.',
  ...props
}: MarkdownEditorPreviewProps) => {
  const { preview } = useStyles()()
  const { value } = useMarkdownEditorContext('MarkdownEditorPreview')
  const trimmed = value.trim()
  return (
    <TabPanel id="preview">
      <div
        data-markdown-editor-preview=""
        className={preview({ className })}
        {...props}
      >
        {trimmed ? (
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {value}
          </Markdown>
        ) : (
          placeholder
        )}
      </div>
    </TabPanel>
  )
}

// MARK: Separator

export type {
  MarkdownEditorActionProps,
  MarkdownEditorPreviewProps,
  MarkdownEditorProps,
  MarkdownEditorToolbarProps,
  MarkdownEditorWriteProps,
}
export {
  MarkdownEditor,
  MarkdownEditorAction,
  MarkdownEditorPreview,
  MarkdownEditorToolbar,
  MarkdownEditorWrite,
}
