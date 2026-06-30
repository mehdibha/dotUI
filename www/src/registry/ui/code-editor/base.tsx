'use client'

import * as React from 'react'
import { javascript } from '@codemirror/lang-javascript'
import CodeMirror from '@uiw/react-codemirror'
import type { Extension, ReactCodeMirrorProps } from '@uiw/react-codemirror'

import { useStyles } from './styles'

// MARK: constants

type Language = 'javascript' | 'jsx' | 'typescript' | 'tsx'

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: 'JS',
  jsx: 'JSX',
  typescript: 'TS',
  tsx: 'TSX',
}

function languageExtension(language: Language): Extension {
  switch (language) {
    case 'jsx':
      return javascript({ jsx: true })
    case 'typescript':
      return javascript({ typescript: true })
    case 'tsx':
      return javascript({ jsx: true, typescript: true })
    case 'javascript':
    default:
      return javascript()
  }
}

// MARK: CodeEditor

interface CodeEditorProps extends Omit<
  ReactCodeMirrorProps,
  'value' | 'onChange' | 'theme' | 'extensions'
> {
  /** The current source. Controlled. */
  value: string
  /** Called with the next source whenever the user edits. */
  onChange?: (value: string) => void
  /**
   * Language grammar to highlight with.
   * @default "javascript"
   */
  language?: Language
  /** When set, the editor renders its contents but blocks edits. */
  readOnly?: boolean
  /** Optional filename shown in the header bar. */
  filename?: string
  /** Hide the header bar (filename + language label). */
  hideHeader?: boolean
  /** Extra CodeMirror extensions appended after the language grammar. */
  extensions?: Extension[]
  className?: string
}

function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  filename,
  hideHeader = false,
  extensions,
  basicSetup,
  className,
  ...props
}: CodeEditorProps) {
  const styles = useStyles()()
  const {
    root,
    header,
    filename: filenameSlot,
    language: languageSlot,
    editor,
  } = styles

  const resolvedExtensions = React.useMemo<Extension[]>(
    () => [languageExtension(language), ...(extensions ?? [])],
    [language, extensions],
  )

  const showHeader = !hideHeader && (filename !== undefined || !readOnly)

  return (
    <div data-code-editor="" className={root({ className })}>
      {showHeader ? (
        <div data-code-editor-header="" className={header()}>
          <span className={filenameSlot()}>{filename ?? 'untitled'}</span>
          <span className={languageSlot()}>{LANGUAGE_LABELS[language]}</span>
        </div>
      ) : null}
      <CodeMirror
        value={value}
        readOnly={readOnly}
        editable={!readOnly}
        extensions={resolvedExtensions}
        basicSetup={basicSetup ?? true}
        onChange={onChange}
        className={editor()}
        {...props}
      />
    </div>
  )
}

// MARK: exports

export type { CodeEditorProps, Language }
export { CodeEditor }
