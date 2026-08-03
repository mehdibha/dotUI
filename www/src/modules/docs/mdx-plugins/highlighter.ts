import { renderNodesToHtml, renderTokens } from '@tanstack/highlight/core'
import { css } from '@tanstack/highlight/languages/css'
import { diff } from '@tanstack/highlight/languages/diff'
import { html } from '@tanstack/highlight/languages/html'
import { js } from '@tanstack/highlight/languages/js'
import { json } from '@tanstack/highlight/languages/json'
import { jsx } from '@tanstack/highlight/languages/jsx'
import { markdown } from '@tanstack/highlight/languages/markdown'
import { shell } from '@tanstack/highlight/languages/shell'
import { ts } from '@tanstack/highlight/languages/ts'
import { tsx } from '@tanstack/highlight/languages/tsx'

import { createRefinedHighlighter } from '../highlight-refine'

/**
 * Build-time highlighter for the docs MDX pipeline (fenced code blocks, demo
 * sources, API-reference type strings). Synchronous; unknown languages fall
 * back to plaintext; classification is post-processed by highlight-refine to
 * match the pre-migration shiki output. The client-side counterpart is
 * ../highlight.ts (tsx only).
 */
export const highlighter = createRefinedHighlighter({
  languages: [ts, tsx, js, jsx, html, css, json, shell, markdown, diff],
})

/** Highlight a TS snippet to inner `<code>` markup (escaped token spans). */
export function highlightTsHtml(code: string): string {
  if (!code) return ''
  const { tokens } = highlighter.tokenize(code, { lang: 'ts' })
  return renderNodesToHtml(renderTokens(tokens))
}
