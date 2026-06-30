import type { Language } from './base'

export type { Language }

/**
 * A controlled code editor built on CodeMirror 6 (via `@uiw/react-codemirror`).
 * Renders in a bordered, rounded container with an optional header bar showing a
 * filename and the active language. Pass `value` and `onChange` to control it.
 */
export interface CodeEditorProps {
  /** The current source. Controlled. */
  value: string

  /** Called with the next source whenever the user edits. */
  onChange?: (value: string) => void

  /**
   * Language grammar used for syntax highlighting.
   * @default "javascript"
   */
  language?: Language

  /**
   * Render the contents but block edits.
   * @default false
   */
  readOnly?: boolean

  /** Filename shown in the header bar. Defaults to "untitled" when the header shows. */
  filename?: string

  /**
   * Hide the header bar (filename + language label).
   * @default false
   */
  hideHeader?: boolean

  /** Extra CodeMirror extensions appended after the language grammar. */
  extensions?: unknown[]

  className?: string
}
