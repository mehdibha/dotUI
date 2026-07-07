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
 * highlighting is synchronous once this module loads. Only import it from the
 * lazy dynamic-pre-impl chunk — a static import from shared code would put
 * shiki back in the entry bundle on every page.
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
