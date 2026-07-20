/**
 * The typography axis' shared font infrastructure: the curated catalog the
 * builder offers, and the helpers that turn a family name into a CSS stack,
 * a Google Fonts stylesheet URL, and an idempotent <link> injection.
 *
 * Fonts are stored in the design system as plain global tokens (full CSS
 * font-family stacks) so they ride the existing codec → provider → publisher
 * pipeline unchanged:
 *   --font-sans     body font (Tailwind's `font-sans`, applied on <body>)
 *   --font-heading  heading font (defaults to var(--font-sans) in the theme)
 *   --font-mono     monospace font (`font-mono`)
 *
 * Pure JS — no React. Safe to import from the publisher.
 */

export const FONT_SANS_VAR = '--font-sans'
export const FONT_HEADING_VAR = '--font-heading'
export const FONT_MONO_VAR = '--font-mono'

export const FONT_TOKEN_VARS = [
  FONT_SANS_VAR,
  FONT_HEADING_VAR,
  FONT_MONO_VAR,
] as const

/** Families the app self-hosts (fontsource) — the no-token defaults. */
export const DEFAULT_BODY_FAMILY = 'Geist'
export const DEFAULT_MONO_FAMILY = 'Geist Mono'

export type FontCategory = 'sans-serif' | 'serif' | 'display' | 'mono'

export interface FontOption {
  family: string
  category: FontCategory
}

/**
 * Curated Google Fonts catalog — the 20% of families that cover 80% of design
 * systems, not the full directory. Every entry is verified to resolve on the
 * css2 endpoint; unavailable weights in the shared 400–700 request are
 * silently dropped by Google, so no per-font weight data is needed.
 */
export const FONT_CATALOG: FontOption[] = [
  // Sans serif
  { family: 'Geist', category: 'sans-serif' },
  { family: 'Inter', category: 'sans-serif' },
  { family: 'Roboto', category: 'sans-serif' },
  { family: 'Open Sans', category: 'sans-serif' },
  { family: 'Lato', category: 'sans-serif' },
  { family: 'Montserrat', category: 'sans-serif' },
  { family: 'Poppins', category: 'sans-serif' },
  { family: 'Nunito', category: 'sans-serif' },
  { family: 'Nunito Sans', category: 'sans-serif' },
  { family: 'Work Sans', category: 'sans-serif' },
  { family: 'DM Sans', category: 'sans-serif' },
  { family: 'Manrope', category: 'sans-serif' },
  { family: 'Rubik', category: 'sans-serif' },
  { family: 'Karla', category: 'sans-serif' },
  { family: 'Mulish', category: 'sans-serif' },
  { family: 'Figtree', category: 'sans-serif' },
  { family: 'Outfit', category: 'sans-serif' },
  { family: 'Sora', category: 'sans-serif' },
  { family: 'Space Grotesk', category: 'sans-serif' },
  { family: 'Plus Jakarta Sans', category: 'sans-serif' },
  { family: 'Urbanist', category: 'sans-serif' },
  { family: 'Lexend', category: 'sans-serif' },
  { family: 'Public Sans', category: 'sans-serif' },
  { family: 'Source Sans 3', category: 'sans-serif' },
  { family: 'IBM Plex Sans', category: 'sans-serif' },
  { family: 'Barlow', category: 'sans-serif' },
  { family: 'Archivo', category: 'sans-serif' },
  { family: 'Onest', category: 'sans-serif' },
  { family: 'Hanken Grotesk', category: 'sans-serif' },
  { family: 'Schibsted Grotesk', category: 'sans-serif' },
  { family: 'Instrument Sans', category: 'sans-serif' },
  { family: 'Albert Sans', category: 'sans-serif' },
  { family: 'Be Vietnam Pro', category: 'sans-serif' },
  { family: 'Atkinson Hyperlegible', category: 'sans-serif' },
  { family: 'Mona Sans', category: 'sans-serif' },
  { family: 'Josefin Sans', category: 'sans-serif' },

  // Serif
  { family: 'Playfair Display', category: 'serif' },
  { family: 'Lora', category: 'serif' },
  { family: 'Merriweather', category: 'serif' },
  { family: 'Source Serif 4', category: 'serif' },
  { family: 'Libre Baskerville', category: 'serif' },
  { family: 'EB Garamond', category: 'serif' },
  { family: 'Cormorant Garamond', category: 'serif' },
  { family: 'Crimson Pro', category: 'serif' },
  { family: 'Fraunces', category: 'serif' },
  { family: 'Newsreader', category: 'serif' },
  { family: 'Literata', category: 'serif' },
  { family: 'Spectral', category: 'serif' },
  { family: 'Bitter', category: 'serif' },
  { family: 'Zilla Slab', category: 'serif' },
  { family: 'Roboto Slab', category: 'serif' },
  { family: 'IBM Plex Serif', category: 'serif' },
  { family: 'Instrument Serif', category: 'serif' },
  { family: 'DM Serif Display', category: 'serif' },

  // Display
  { family: 'Anton', category: 'display' },
  { family: 'Bebas Neue', category: 'display' },
  { family: 'Abril Fatface', category: 'display' },
  { family: 'Alfa Slab One', category: 'display' },
  { family: 'Righteous', category: 'display' },
  { family: 'Unbounded', category: 'display' },
  { family: 'Syne', category: 'display' },
  { family: 'Archivo Black', category: 'display' },
  { family: 'Bricolage Grotesque', category: 'display' },
  { family: 'Lobster', category: 'display' },
  { family: 'Pacifico', category: 'display' },
  { family: 'Caveat', category: 'display' },

  // Monospace
  { family: 'Geist Mono', category: 'mono' },
  { family: 'JetBrains Mono', category: 'mono' },
  { family: 'Fira Code', category: 'mono' },
  { family: 'IBM Plex Mono', category: 'mono' },
  { family: 'Source Code Pro', category: 'mono' },
  { family: 'Space Mono', category: 'mono' },
  { family: 'Roboto Mono', category: 'mono' },
  { family: 'Inconsolata', category: 'mono' },
  { family: 'DM Mono', category: 'mono' },
  { family: 'Ubuntu Mono', category: 'mono' },
  { family: 'Martian Mono', category: 'mono' },
  { family: 'Courier Prime', category: 'mono' },
]

const CATEGORY_BY_FAMILY = new Map(
  FONT_CATALOG.map((font) => [font.family, font.category]),
)

const FALLBACK_STACKS: Record<FontCategory, string> = {
  'sans-serif': 'ui-sans-serif, system-ui, sans-serif',
  serif: 'ui-serif, Georgia, serif',
  display: 'system-ui, sans-serif',
  mono: "ui-monospace, 'SF Mono', monospace",
}

/** `'Inter', ui-sans-serif, system-ui, sans-serif` — the token value. */
export function fontStack(family: string): string {
  const category = CATEGORY_BY_FAMILY.get(family) ?? 'sans-serif'
  return `'${family}', ${FALLBACK_STACKS[category]}`
}

/** First family of a stack, unquoted — the display name / load target. */
export function familyFromStack(stack: string): string {
  const first = stack.split(',')[0] ?? stack
  return first.trim().replace(/^['"]|['"]$/g, '')
}

/** Google-hosted families referenced by a token record, load order stable. */
export function fontFamiliesFromTokens(
  tokens: Record<string, string>,
): string[] {
  const families: string[] = []
  for (const varName of FONT_TOKEN_VARS) {
    const stack = tokens[varName]
    if (!stack) continue
    const family = familyFromStack(stack)
    if (family && !families.includes(family)) families.push(family)
  }
  return families
}

/**
 * One css2 stylesheet URL for the given families. The shared 400–700 weight
 * request covers UI text; css2 drops weights a family doesn't ship rather
 * than erroring (verified against the live endpoint).
 */
export function googleFontsUrl(
  families: string[],
  opts: { text?: string; weights?: string } = {},
): string {
  const weights = opts.weights ?? '400;500;600;700'
  const params = families
    .map((family) => `family=${family.replaceAll(' ', '+')}:wght@${weights}`)
    .join('&')
  const text = opts.text ? `&text=${encodeURIComponent(opts.text)}` : ''
  return `https://fonts.googleapis.com/css2?${params}&display=swap${text}`
}

/**
 * One stylesheet covering EVERY catalog family, subset (`text=`) to the glyphs
 * of the family names — so picker items can render each name in its own font.
 * The CSS is one request; the browser downloads a face only when a visible
 * item actually renders in it, which the virtualized list keeps to a handful.
 */
export function ensureFontPreviewStylesheet(doc: Document): void {
  const id = 'dotui-font-previews'
  if (doc.getElementById(id)) return
  const text = [...new Set(FONT_CATALOG.flatMap((f) => [...f.family]))].join('')
  const link = doc.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = googleFontsUrl(
    FONT_CATALOG.map((f) => f.family),
    { text, weights: '400' },
  )
  doc.head.append(link)
}

/**
 * Idempotently inject one stylesheet <link> per family into `doc`. Per-family
 * links (not one combined) so switching fonts never re-fetches already-loaded
 * ones. Links are never removed — a font once loaded stays usable.
 */
export function ensureFontStylesheets(doc: Document, families: string[]): void {
  for (const family of families) {
    const id = `dotui-font-${family.replaceAll(' ', '-').toLowerCase()}`
    if (doc.getElementById(id)) continue
    const link = doc.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = googleFontsUrl([family])
    doc.head.append(link)
  }
}
