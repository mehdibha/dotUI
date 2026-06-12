import type { Root } from 'hast'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import tsx from 'shiki/langs/tsx.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'

/**
 * Synchronous TSX highlighter for code the client generates at runtime
 * (playground output). Static docs code is highlighted at build time by the
 * rehype pipeline — this module exists for code that doesn't exist until the
 * user moves a control.
 *
 * Everything is statically imported (grammar + themes ≈ 35KB gzipped) so
 * highlighting works during SSR and on the very first render — no async
 * highlighter load, no flash of unhighlighted code, ever.
 */
const highlighter = createHighlighterCoreSync({
  langs: [tsx],
  themes: [githubLight, githubDark],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
})

/** Highlight TSX to HAST with the same dual-theme CSS variables the build uses. */
export function highlightTsx(code: string): Root {
  return highlighter.codeToHast(code, {
    lang: 'tsx',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })
}
