'use client'

import * as React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  StrikethroughIcon,
  type LucideIcon,
} from 'lucide-react'

import { ToggleButton } from '@/registry/ui/toggle-button'

import { useStyles } from './styles'

// MARK: richTextEditorStyles

// MARK: RichTextEditorContext

interface RichTextEditorContextValue {
  editor: Editor | null
}

const RichTextEditorContext =
  React.createContext<RichTextEditorContextValue | null>(null)

/**
 * Reads the Tiptap editor instance from the nearest `RichTextEditor`. Use it to
 * build custom toolbar controls; returns `null` until the editor is mounted.
 */
function useRichTextEditor(): Editor | null {
  const context = React.useContext(RichTextEditorContext)
  if (!context) {
    throw new Error(
      'useRichTextEditor must be used within a <RichTextEditor />.',
    )
  }
  return context.editor
}

// MARK: RichTextEditor

interface RichTextEditorProps extends React.ComponentProps<'div'> {
  /** Initial HTML content of the editor (uncontrolled). */
  content?: string
  /** Placeholder shown while the editor is empty. */
  placeholder?: string
  /** Whether the editor is read-only. @default false */
  isReadOnly?: boolean
  /** Handler called with the editor's HTML whenever the content changes. */
  onContentChange?: (html: string) => void
}

/**
 * A WYSIWYG rich-text editor built on Tiptap. Owns the editor instance and
 * shares it with the toolbar and content area through context, so it can be
 * composed: drop in `RichTextEditorToolbar` (or your own controls) and
 * `RichTextEditorContent`.
 */
function RichTextEditor({
  content = '',
  placeholder,
  isReadOnly = false,
  onContentChange,
  className,
  children,
  ...props
}: RichTextEditorProps) {
  const { root } = useStyles()()

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: !isReadOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: placeholder ? { 'data-placeholder': placeholder } : {},
    },
    onUpdate: ({ editor: instance }) => {
      onContentChange?.(instance.getHTML())
    },
  })

  React.useEffect(() => {
    editor?.setEditable(!isReadOnly)
  }, [editor, isReadOnly])

  const value = React.useMemo<RichTextEditorContextValue>(
    () => ({ editor }),
    [editor],
  )

  return (
    <RichTextEditorContext.Provider value={value}>
      <div data-rich-text-editor="" className={root({ className })} {...props}>
        {children}
      </div>
    </RichTextEditorContext.Provider>
  )
}

// MARK: RichTextEditorToolbar

interface RichTextEditorToolbarProps extends React.ComponentProps<'div'> {}

/**
 * The default formatting toolbar: bold, italic, strikethrough, heading, lists,
 * blockquote, and inline code. Each control reflects and toggles the editor's
 * active marks. Compose your own with `RichTextEditorButton` instead.
 */
function RichTextEditorToolbar({
  className,
  children,
  ...props
}: RichTextEditorToolbarProps) {
  const { toolbar, separator } = useStyles()()
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      data-rich-text-editor-toolbar=""
      className={toolbar({ className })}
      {...props}
    >
      {children ?? (
        <>
          <RichTextEditorButton format="bold" icon={BoldIcon} label="Bold" />
          <RichTextEditorButton
            format="italic"
            icon={ItalicIcon}
            label="Italic"
          />
          <RichTextEditorButton
            format="strike"
            icon={StrikethroughIcon}
            label="Strikethrough"
          />
          <div className={separator()} aria-hidden="true" />
          <RichTextEditorButton
            format="heading"
            icon={Heading2Icon}
            label="Heading"
          />
          <div className={separator()} aria-hidden="true" />
          <RichTextEditorButton
            format="bulletList"
            icon={ListIcon}
            label="Bullet list"
          />
          <RichTextEditorButton
            format="orderedList"
            icon={ListOrderedIcon}
            label="Ordered list"
          />
          <RichTextEditorButton
            format="blockquote"
            icon={QuoteIcon}
            label="Blockquote"
          />
          <RichTextEditorButton format="code" icon={CodeIcon} label="Code" />
        </>
      )}
    </div>
  )
}

// MARK: RichTextEditorButton

type RichTextEditorFormat =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'code'

interface RichTextEditorButtonProps {
  /** Which formatting command the button toggles. */
  format: RichTextEditorFormat
  /** Icon rendered inside the button. */
  icon: LucideIcon
  /** Accessible label for the icon-only button. */
  label: string
}

/**
 * A single toolbar control that reflects whether `format` is active and toggles
 * it on the editor. Reads the editor from context.
 */
function RichTextEditorButton({
  format,
  icon: Icon,
  label,
}: RichTextEditorButtonProps) {
  const editor = useRichTextEditor()

  const isActive =
    format === 'heading'
      ? Boolean(editor?.isActive('heading', { level: 2 }))
      : Boolean(editor?.isActive(format))

  const toggle = () => {
    if (!editor) return
    const chain = editor.chain().focus()
    switch (format) {
      case 'bold':
        chain.toggleBold().run()
        break
      case 'italic':
        chain.toggleItalic().run()
        break
      case 'strike':
        chain.toggleStrike().run()
        break
      case 'heading':
        chain.toggleHeading({ level: 2 }).run()
        break
      case 'bulletList':
        chain.toggleBulletList().run()
        break
      case 'orderedList':
        chain.toggleOrderedList().run()
        break
      case 'blockquote':
        chain.toggleBlockquote().run()
        break
      case 'code':
        chain.toggleCode().run()
        break
    }
  }

  return (
    <ToggleButton
      variant="quiet"
      size="sm"
      isIconOnly
      aria-label={label}
      isSelected={isActive}
      isDisabled={!editor}
      onChange={toggle}
    >
      <Icon />
    </ToggleButton>
  )
}

// MARK: RichTextEditorContent

interface RichTextEditorContentProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {}

/**
 * Renders the editable surface. Reads the editor from context and guards against
 * the pre-mount `null` instance.
 */
function RichTextEditorContent({
  className,
  ...props
}: RichTextEditorContentProps) {
  const { content } = useStyles()()
  const editor = useRichTextEditor()

  if (!editor) {
    return null
  }

  return (
    <div
      data-rich-text-editor-content=""
      className={content({ className })}
      {...props}
    >
      <EditorContent editor={editor} />
    </div>
  )
}

// MARK: exports

export type {
  RichTextEditorProps,
  RichTextEditorToolbarProps,
  RichTextEditorButtonProps,
  RichTextEditorContentProps,
}
export {
  RichTextEditor,
  RichTextEditorToolbar,
  RichTextEditorButton,
  RichTextEditorContent,
  useRichTextEditor,
}
