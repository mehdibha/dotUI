import type { Components } from 'react-markdown'

/**
 * A markdown editor with a formatting toolbar and Write/Preview tabs.
 * Composition-first: drop in a `MarkdownEditorToolbar`, `MarkdownEditorWrite`,
 * and `MarkdownEditorPreview` as children. The value is fully controlled.
 */
export interface MarkdownEditorProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  /**
   * The current markdown source.
   */
  value: string

  /**
   * Handler called with the next markdown source whenever it changes —
   * from typing in the Write panel or pressing a toolbar action.
   */
  onChange: (value: string) => void
}

/**
 * The formatting toolbar. Renders the built-in bold / italic / list / link /
 * code actions and the Write/Preview tab list by default; pass children to
 * supply your own set of `MarkdownEditorAction` buttons.
 */
export interface MarkdownEditorToolbarProps extends React.ComponentProps<'div'> {}

/**
 * A toolbar button that wraps or inserts markdown around the current textarea
 * selection.
 */
export interface MarkdownEditorActionProps {
  /**
   * Which built-in transform to apply to the selection.
   */
  transform: 'bold' | 'italic' | 'list' | 'link' | 'code'
}

/**
 * The Write tab panel: a monospace textarea bound to the editor value.
 */
export interface MarkdownEditorWriteProps extends Omit<
  React.ComponentProps<'textarea'>,
  'value' | 'onChange'
> {}

/**
 * The Preview tab panel: renders the markdown value with `react-markdown` and
 * `remark-gfm`, styled with a small prose-like set of classes.
 */
export interface MarkdownEditorPreviewProps extends React.ComponentProps<'div'> {
  /**
   * Override the `react-markdown` component map for custom element rendering.
   */
  components?: Components

  /**
   * Text shown when there is nothing to preview.
   *
   * @default "Nothing to preview."
   */
  placeholder?: string
}
