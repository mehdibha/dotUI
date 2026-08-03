import { renderNodesToHtml, renderTokens } from '@tanstack/highlight/core'
import { tsx } from '@tanstack/highlight/languages/tsx'

import { createRefinedHighlighter } from './highlight-refine'

/**
 * Synchronous TSX highlighter for code the client generates at runtime
 * (playground output). Static docs code is highlighted at build time by the
 * rehype pipeline — this module exists for code that doesn't exist until the
 * user moves a control.
 *
 * @tanstack/highlight is synchronous and isomorphic (core + tsx tokenizer
 * ≈ 4KB gzipped), so highlighting works during SSR and on the very first
 * render — no async highlighter load, no flash of unhighlighted code, ever.
 * Token colors come from the th-* classes in highlight.css; classification is
 * post-processed by highlight-refine to match the pre-migration shiki output.
 */
export const highlighter = createRefinedHighlighter({ languages: [tsx] })

/** Highlight TSX to inner `<code>` markup (escaped token spans). */
export function highlightTsxHtml(code: string): string {
  const { tokens } = highlighter.tokenize(code, { lang: 'tsx' })
  return renderNodesToHtml(renderTokens(tokens))
}
