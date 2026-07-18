import type {
  BundledLanguage,
  BundledTheme,
  ShikiTransformer,
  SpecialLanguage,
} from 'shiki'

interface HighlightCodeOptions {
  lang?: BundledLanguage | SpecialLanguage
  themes?: { light: BundledTheme; dark: BundledTheme }
  transformers?: ShikiTransformer[]
}

/**
 * Highlight code to an HTML string with shiki's dual-theme output — token
 * colors land in `--shiki-light`/`--shiki-dark` CSS variables so light and
 * dark mode both work from a single render.
 *
 * Runs anywhere: await it in a React Server Component, at build time, in a
 * server loader, or on the client (the CodeBlock `useHighlightedCode` hook
 * wraps it). Shiki is imported lazily, so it stays out of client bundles
 * until code is actually highlighted.
 */
async function highlightCode(
  code: string,
  options: HighlightCodeOptions = {},
): Promise<string> {
  const {
    lang = 'tsx',
    themes = { light: 'github-light', dark: 'github-dark' },
    transformers,
  } = options
  const { codeToHtml } = await import('shiki')
  return codeToHtml(code, {
    lang,
    themes,
    defaultColor: false,
    transformers,
  })
}

export type { HighlightCodeOptions }
export { highlightCode }
