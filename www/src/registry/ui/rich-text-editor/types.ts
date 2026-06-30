import type * as React from 'react'

/**
 * A WYSIWYG rich-text editor built on Tiptap. `RichTextEditor` owns the editor
 * instance and shares it through context, so the toolbar and content area are
 * composed: drop in `RichTextEditorToolbar` (or your own controls built with
 * `RichTextEditorButton`) and `RichTextEditorContent`.
 */
export interface RichTextEditorProps extends React.ComponentProps<'div'> {
  /** Initial HTML content of the editor (uncontrolled). */
  content?: string
  /** Placeholder shown while the editor is empty. */
  placeholder?: string
  /**
   * Whether the editor is read-only.
   * @default false
   */
  isReadOnly?: boolean
  /** Handler called with the editor's HTML whenever the content changes. */
  onContentChange?: (html: string) => void
}

/**
 * The default formatting toolbar — bold, italic, strikethrough, heading,
 * bullet/ordered lists, blockquote, and inline code. Pass `children` to replace
 * the default controls with your own `RichTextEditorButton`s.
 */
export interface RichTextEditorToolbarProps extends React.ComponentProps<'div'> {}

/** The formatting command a `RichTextEditorButton` toggles. */
export type RichTextEditorFormat =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'code'

/**
 * A single toolbar control that reflects whether `format` is active on the
 * editor and toggles it when pressed. Reads the editor from context.
 */
export interface RichTextEditorButtonProps {
  /** Which formatting command the button toggles. */
  format: RichTextEditorFormat
  /** Icon component rendered inside the button. */
  icon: React.ComponentType<React.ComponentProps<'svg'>>
  /** Accessible label for the icon-only button. */
  label: string
}

/**
 * Renders the editable surface (`EditorContent`). Reads the editor from context
 * and renders nothing until it is mounted.
 */
export interface RichTextEditorContentProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {}
