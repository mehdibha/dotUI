// shadcn/ui pipeline config. Snapshot vendors the canonical color sources at a
// pinned SHA; extract parses ONLY those vendored files into a ColorsFile.
//
// Colour model: semantic CSS custom properties in OKLCH, resolved per theme.
// 24 themes (7 base-neutral + 17 accent). Scales are borrowed Tailwind v4 plus
// shadcn's own neutrals; component code reaches semantic tokens directly and
// derives point-of-use colours (opacity modifiers, color-mix, relative oklch).
import fs from 'node:fs'
import path from 'node:path'

import type {
  ColorsFile,
  DerivedColor,
  Layer,
  Note,
  Ramp,
  SpecEntry,
  Token,
  TokenGroup,
} from '../../src/data/schema'
import {
  isPureBlack,
  isPureWhite,
  matchRampStep,
  parseOklch,
  sortByKey,
} from '../lib/extract'
import type { RampStep } from '../lib/extract'
import type { SystemConfig } from '../lib/system'

const REPO = 'https://github.com/shadcn-ui/ui'
const REF = 'dd6ce77cf1606eee2839368a97cc35417f763232'
const COLORS_URL = 'https://ui.shadcn.com/colors'
const THEMING_URL = 'https://ui.shadcn.com/docs/theming'

const MODES = ['light', 'dark'] as const

// The 7 base-neutral themes ship full token sets; the default base is neutral.
const NEUTRAL_THEMES = new Set([
  'neutral',
  'stone',
  'zinc',
  'mauve',
  'olive',
  'mist',
  'taupe',
])
// Families that read as neutral in the ramp grid (includes Tailwind's own
// greys that shadcn borrows for its base themes).
const NEUTRAL_FAMILIES = new Set([
  'neutral',
  'stone',
  'zinc',
  'slate',
  'gray',
  'mauve',
  'olive',
  'mist',
  'taupe',
])

// ── Snapshot inventory ───────────────────────────────────────────────────────
// Only style-nova is vendored: it's shadcn's default style, and the other
// styles repeat the same colour derivations.
const STYLE_FILES = [
  {
    upstreamPath: 'apps/v4/registry/styles/style-nova.css',
    as: 'style-nova.css',
  },
]

const SOURCE: SystemConfig['source'] = {
  kind: 'repo',
  repo: REPO,
  ref: REF,
  files: [
    { upstreamPath: 'apps/v4/registry/themes.ts', as: 'themes.ts' },
    {
      upstreamPath: 'apps/v4/registry/_legacy-base-colors.ts',
      as: '_legacy-base-colors.ts',
    },
    {
      upstreamPath: 'apps/v4/registry/_legacy-colors.ts',
      as: '_legacy-colors.ts',
    },
    ...STYLE_FILES,
  ],
}

// ── themes.ts parsing ────────────────────────────────────────────────────────
interface Theme {
  name: string
  light: Record<string, string>
  dark: Record<string, string>
}

/** Read THEMES from the vendored themes.ts by walking its object literal. The
    file is machine-generated and stable, so a scoped brace-matched parse of
    each theme's cssVars.{light,dark} is enough — no TS eval. */
function parseThemes(src: string): Theme[] {
  const themes: Theme[] = []
  const nameRe = /name:\s*"([^"]+)"/g
  const names: { name: string; index: number }[] = []
  for (const m of src.matchAll(nameRe)) {
    names.push({ name: m[1]!, index: m.index! })
  }
  for (let i = 0; i < names.length; i++) {
    const start = names[i]!.index
    const end = i + 1 < names.length ? names[i + 1]!.index : src.length
    const block = src.slice(start, end)
    themes.push({
      name: names[i]!.name,
      light: parseModeVars(block, 'light'),
      dark: parseModeVars(block, 'dark'),
    })
  }
  return themes
}

/** Pull the `light:` / `dark:` object out of a theme block and read its
    string entries. Skips `radius` and any non-oklch/non-var value. */
function parseModeVars(
  block: string,
  mode: 'light' | 'dark',
): Record<string, string> {
  const start = block.indexOf(`${mode}: {`)
  if (start === -1) return {}
  let depth = 0
  let end = -1
  for (let i = start + `${mode}: `.length; i < block.length; i++) {
    const ch = block[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  const body = block.slice(start, end === -1 ? undefined : end)
  const vars: Record<string, string> = {}
  for (const m of body.matchAll(/"?([\w-]+)"?:\s*"([^"]+)"/g)) {
    const key = m[1]!
    const value = m[2]!
    if (key === 'radius') continue
    vars[key] = value
  }
  return vars
}

// ── _legacy-colors.ts parsing (the full scale palette) ──────────────────────
// The generated public/r/colors/index.json is a stale subset (it omits the
// four custom neutrals), so ramps come from the palette source itself.
const EXPECTED_SCALES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
// Every family the extraction depends on. Upstream may ADD families (they'll
// flow through); if any of these go missing the file was reshaped — throw.
const REQUIRED_FAMILIES = [
  ...NEUTRAL_FAMILIES,
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

/** `oklch(0.98,0.00,310)` (nonstandard comma syntax) → `oklch(0.98 0.00 310)`. */
function normalizeOklch(value: string): string {
  return value.replace(
    /oklch\(([^)]+)\)/,
    (_, body: string) =>
      `oklch(${body
        .split(',')
        .map((s) => s.trim())
        .join(' ')})`,
  )
}

interface LegacyPalette {
  /** family → 11 steps, oklch already normalized to space-separated form. */
  families: Map<string, { scale: number; oklch: string }[]>
  /** black/white single values, normalized. */
  statics: Map<string, string>
}

/** Strict parse of the vendored _legacy-colors.ts `colors` object. Validates
    shape hard — a reshaped upstream file must throw, never emit partial ramps.
    Skips the pseudo-entries (inherit/current/transparent). */
function parseLegacyColors(src: string): LegacyPalette {
  const start = src.indexOf('export const colors = {')
  if (start === -1)
    throw new Error('_legacy-colors.ts: `export const colors` not found')
  const end = src.indexOf('\nexport const', start + 1)
  const block = src.slice(start, end === -1 ? undefined : end)

  const families = new Map<string, { scale: number; oklch: string }[]>()
  for (const m of block.matchAll(/\n {2}([a-zA-Z]+): \[/g)) {
    const family = m[1]!
    const arrStart = m.index! + m[0].length
    const arrEnd = block.indexOf('\n  ],', arrStart)
    if (arrEnd === -1)
      throw new Error(`_legacy-colors.ts: unterminated array for "${family}"`)
    const body = block.slice(arrStart, arrEnd)
    const steps: { scale: number; oklch: string }[] = []
    for (const step of body.matchAll(/\{[^{}]*\}/g)) {
      const scale = step[0].match(/scale:\s*(\d+)/)
      const oklch = step[0].match(/oklch:\s*"([^"]+)"/)
      if (!scale || !oklch) {
        throw new Error(
          `_legacy-colors.ts: step without scale/oklch in "${family}"`,
        )
      }
      const normalized = normalizeOklch(oklch[1]!)
      if (!parseOklch(normalized)) {
        throw new Error(
          `_legacy-colors.ts: unparseable oklch in "${family}": ${oklch[1]}`,
        )
      }
      steps.push({ scale: Number(scale[1]), oklch: normalized })
    }
    const scales = steps.map((s) => s.scale)
    if (JSON.stringify(scales) !== JSON.stringify(EXPECTED_SCALES)) {
      throw new Error(
        `_legacy-colors.ts: family "${family}" has scales [${scales.join(',')}], expected 50→950`,
      )
    }
    families.set(family, steps)
  }

  const statics = new Map<string, string>()
  for (const name of ['black', 'white']) {
    const sm = block.match(
      new RegExp(`\\n {2}${name}: \\{[^}]*oklch:\\s*"([^"]+)"`),
    )
    if (!sm) throw new Error(`_legacy-colors.ts: static "${name}" not found`)
    statics.set(name, normalizeOklch(sm[1]!))
  }

  const missing = REQUIRED_FAMILIES.filter((f) => !families.has(f))
  if (missing.length > 0) {
    throw new Error(
      `_legacy-colors.ts: missing expected families: ${missing.join(', ')}`,
    )
  }
  return { families, statics }
}

function buildRampStepIndex(palette: LegacyPalette): RampStep[] {
  const steps: RampStep[] = []
  for (const [family, arr] of palette.families) {
    for (const s of arr) {
      steps.push({ family, step: String(s.scale), oklch: s.oklch })
    }
  }
  return steps
}

// ── legacy comment mapping ───────────────────────────────────────────────────
/** shadcn annotates baseColorsOKLCH tokens with `// --color-<family>-<step>`.
    Keyed by (theme,mode,token) — value-keyed maps collapse identical colours
    across families. Themes covered: default(=neutral), neutral, zinc, red,
    rose, orange, green, blue, yellow, violet. */
function parseCommentMap(src: string): Map<string, string> {
  const map = new Map<string, string>()
  const block = src.slice(src.indexOf('export const baseColorsOKLCH'))
  const themeRe = /\n {2}([a-z]+): \{/g
  const themeStarts: { name: string; index: number }[] = []
  for (const m of block.matchAll(themeRe)) {
    themeStarts.push({ name: m[1]!, index: m.index! })
  }
  for (let i = 0; i < themeStarts.length; i++) {
    const name = themeStarts[i]!.name
    const start = themeStarts[i]!.index
    const end =
      i + 1 < themeStarts.length ? themeStarts[i + 1]!.index : block.length
    const themeBlock = block.slice(start, end)
    for (const mode of MODES) {
      const mStart = themeBlock.indexOf(`${mode}: {`)
      if (mStart === -1) continue
      const mEnd = themeBlock.indexOf('    }', mStart)
      const seg = themeBlock.slice(mStart, mEnd === -1 ? undefined : mEnd)
      for (const m of seg.matchAll(
        /"?([\w-]+)"?:\s*"oklch\([^"]+\)",\s*\/\/\s*--color-([a-z]+-\d+)/g,
      )) {
        map.set(`${name}|${mode}|${m[1]!}`, m[2]!)
      }
    }
  }
  return map
}

// ── ref resolution ───────────────────────────────────────────────────────────
interface RefResolution {
  ref: string | null
  /** For reporting: how the ref was found and whether the comment disagreed. */
  method: 'white' | 'black' | 'comment' | 'numeric' | 'none'
  disagreement?: string
}

/** Resolve a token value to a ramp reference against the vendored index.
    Priority: pure white/black, then a numeric match against the index ramps
    (the shipped themes.ts value is the source of truth). The stale
    _legacy-base-colors.ts comment annotations are used only as a cross-check —
    themes.ts has since diverged from them, so they can't be authoritative — and
    every comment/numeric disagreement is reported. `preferFamily` breaks ties
    among identical greys toward the theme's own base family. */
function resolveRef(
  value: string,
  themeName: string,
  mode: string,
  token: string,
  steps: RampStep[],
  commentMap: Map<string, string>,
  preferFamily: string | null,
): RefResolution {
  if (isPureWhite(value)) return { ref: '{white}', method: 'white' }
  if (isPureBlack(value)) return { ref: '{black}', method: 'black' }

  const numeric = matchRampStep(value, steps, preferFamily)
  const numericStep = numeric ? `${numeric.family}-${numeric.step}` : null
  const commentStep = commentMap.get(`${themeName}|${mode}|${token}`)

  // The legacy comment map is stale: themes.ts has since re-tinted tokens
  // (charts to the neutral ramp, "green" to green not lime, primaries a step
  // darker), so numeric against the current value wins. The one place the
  // comment is authoritative: achromatic values, where several grey families
  // collide at 2 dp and the comment is shadcn's own labelled intent (e.g.
  // 0.967 0.001 286 is exactly zinc-100, not the numerically-tied neutral-100).
  const commentFamily = commentStep?.replace(/-\d+$/, '') ?? null
  const numericFamily = numeric?.family ?? null
  const achromatic = (parseOklch(value)?.c ?? 0) < 0.02
  const commentAuthoritative =
    !!commentStep &&
    achromatic &&
    NEUTRAL_FAMILIES.has(commentFamily!) &&
    (numericFamily === null || NEUTRAL_FAMILIES.has(numericFamily))

  const chosen = commentAuthoritative ? commentStep : numericStep
  const method: RefResolution['method'] = commentAuthoritative
    ? 'comment'
    : numericStep
      ? 'numeric'
      : 'none'
  const disagreement =
    commentStep && numericStep && commentStep !== numericStep
      ? `${themeName}.${mode}.${token}: chose=${chosen} numeric=${numericStep} legacy-comment=${commentStep}`
      : undefined

  if (chosen) return { ref: `{${chosen}}`, method, disagreement }
  return { ref: null, method: 'none', disagreement }
}

// ── derived colours from style CSS ───────────────────────────────────────────
const SEMANTIC_TOKENS = [
  'primary-foreground',
  'primary',
  'secondary-foreground',
  'secondary',
  'muted-foreground',
  'muted',
  'accent-foreground',
  'accent',
  'destructive-foreground',
  'destructive',
  'card-foreground',
  'card',
  'popover-foreground',
  'popover',
  'background',
  'foreground',
  'border',
  'input',
  'ring',
  'sidebar-primary-foreground',
  'sidebar-primary',
  'sidebar-accent-foreground',
  'sidebar-accent',
  'sidebar-foreground',
  'sidebar-border',
  'sidebar-ring',
  'sidebar',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
]
const COLOR_UTILS = [
  'bg',
  'text',
  'border',
  'ring',
  'fill',
  'stroke',
  'from',
  'to',
  'via',
  'outline',
  'shadow',
  'divide',
  'decoration',
  'caret',
  'accent',
  'placeholder',
]
const tokenAlt = [...SEMANTIC_TOKENS]
  .sort((a, b) => b.length - a.length)
  .join('|')
const utilAlt = COLOR_UTILS.join('|')

const OPACITY_RE = new RegExp(`^(?:${utilAlt})-(${tokenAlt})/(\\d+)$`)
const LITERAL_TOKEN_RE = new RegExp(
  `^(?:${utilAlt})-(black|white)(?:/(\\d+))?$`,
)
const ARBITRARY_RE = new RegExp(`^(?:${utilAlt})-\\[(.+)\\]$`)

interface RawUse {
  expression: string
  resolved: string | null
  kind: DerivedColor['kind']
  refs: string[]
  component: string
  /** The class as authored, variant prefixes intact (e.g. "hover:bg-primary/10"). */
  rawClass: string
  note: string | null
}

/** Strip Tailwind variant prefixes to the base utility. Variants are the
    `foo:` / `[&…]:` / `*:` segments before the utility; we take everything
    after the last top-level `:` that isn't inside `[]`. */
function baseUtility(cls: string): string {
  let depth = 0
  let lastColon = -1
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i]
    if (ch === '[') depth++
    else if (ch === ']') depth--
    else if (ch === ':' && depth === 0) lastColon = i
  }
  return cls.slice(lastColon + 1)
}

/** color-mix in oklab that Tailwind emits for a `<token>/<pct>` opacity
    modifier. Our resolution convention, stated in the note. */
function opacityResolved(token: string, pct: number): string {
  return `color-mix(in oklab, var(--${token}) ${pct}%, transparent)`
}

/** Tokens referenced by an arbitrary value like color-mix(...) or oklch(from …). */
function refsInArbitrary(body: string): string[] {
  const refs = new Set<string>()
  for (const m of body.matchAll(/var\(--([\w-]+)\)/g)) refs.add(m[1]!)
  return [...refs]
}

function parseStyleFile(css: string): RawUse[] {
  const uses: RawUse[] = []
  // Split by MARK comments so each utility gets its component name.
  const markRe = /\/\*\s*MARK:\s*([^*]+?)\s*\*\//g
  const marks: { component: string; index: number }[] = []
  for (const m of css.matchAll(markRe)) {
    marks.push({ component: m[1]!.trim(), index: m.index! })
  }
  for (let i = 0; i < marks.length; i++) {
    const component = marks[i]!.component
    const start = marks[i]!.index
    const end = i + 1 < marks.length ? marks[i + 1]!.index : css.length
    const segment = css.slice(start, end)
    for (const apply of segment.matchAll(/@apply\s+([^;]+);/g)) {
      for (const rawClass of apply[1]!.split(/\s+/).filter(Boolean)) {
        const use = classifyClass(rawClass, component)
        if (use) uses.push(use)
      }
    }
  }
  return uses
}

function classifyClass(rawClass: string, component: string): RawUse | null {
  const base = baseUtility(rawClass)

  const arb = ARBITRARY_RE.exec(base)
  if (arb) {
    // Tailwind arbitrary values escape spaces as `_`; restore for readability.
    const body = arb[1]!.replace(/_/g, ' ')
    if (body.startsWith('color-mix(')) {
      const util = base.slice(0, base.indexOf('-['))
      return {
        expression: `${util}-[${body}]`,
        resolved: body,
        kind: 'color-mix',
        refs: refsInArbitrary(body),
        component,
        rawClass,
        note: null,
      }
    }
    if (/^oklch\(from /.test(body)) {
      const util = base.slice(0, base.indexOf('-['))
      return {
        expression: `${util}-[${body}]`,
        resolved: body,
        kind: 'literal',
        refs: refsInArbitrary(body),
        component,
        rawClass,
        note: 'Relative-oklch tint derived from --primary.',
      }
    }
    return null
  }

  const lit = LITERAL_TOKEN_RE.exec(base)
  if (lit) {
    const color = lit[1]!
    const pct = lit[2]
    const resolved = pct
      ? `color-mix(in oklab, ${color} ${pct}%, transparent)`
      : color
    return {
      expression: base,
      resolved: pct ? resolved : null,
      kind: 'literal',
      refs: [],
      component,
      rawClass,
      note: null,
    }
  }

  const op = OPACITY_RE.exec(base)
  if (op) {
    const token = op[1]!
    const pct = Number(op[2]!)
    return {
      expression: base,
      resolved: opacityResolved(token, pct),
      kind: 'opacity',
      refs: [token],
      component,
      rawClass,
      note: null,
    }
  }

  return null
}

/** Aggregate raw uses by unique expression, keeping full deterministic
    refs/usedBy lists (no truncation — the data must be complete). usedBy
    groups by component with a sorted, deduped set of raw classes. */
function aggregateDerived(uses: RawUse[]): DerivedColor[] {
  const byExpr = new Map<string, RawUse[]>()
  for (const use of uses) {
    const list = byExpr.get(use.expression) ?? []
    list.push(use)
    byExpr.set(use.expression, list)
  }
  const entries: DerivedColor[] = []
  for (const [expression, group] of byExpr) {
    const first = group[0]!
    const refs = [...new Set(group.flatMap((u) => u.refs))].sort()
    const classesByComponent = new Map<string, Set<string>>()
    for (const use of group) {
      const classes = classesByComponent.get(use.component) ?? new Set()
      classes.add(use.rawClass)
      classesByComponent.set(use.component, classes)
    }
    const usedBy = [...classesByComponent.entries()]
      .map(([component, classes]) => ({
        component,
        classes: [...classes].sort(),
      }))
      .sort((a, b) => a.component.localeCompare(b.component))
    const note = group.find((u) => u.note)?.note ?? null
    entries.push({
      expression,
      resolved: first.resolved,
      kind: first.kind,
      refs,
      usedBy,
      note,
    })
  }
  return sortByKey(entries, (e) => `${e.kind} ${e.expression}`)
}

// ── extract ──────────────────────────────────────────────────────────────────
function extract(sourcesDir: string): ColorsFile {
  const read = (name: string) =>
    fs.readFileSync(path.join(sourcesDir, name), 'utf8')

  const themes = parseThemes(read('themes.ts'))
  const palette = parseLegacyColors(read('_legacy-colors.ts'))
  const commentMap = parseCommentMap(read('_legacy-base-colors.ts'))
  const rampSteps = buildRampStepIndex(palette)

  // ── ramps ──────────────────────────────────────────────────────────────
  const ramps: Ramp[] = []
  for (const [family, arr] of palette.families) {
    const kind: Ramp['kind'] = NEUTRAL_FAMILIES.has(family)
      ? 'neutral'
      : 'chromatic'
    ramps.push({
      name: family,
      kind,
      note: 'Borrowed Tailwind v4 palette (with shadcn’s custom neutrals); mode-invariant — the same value paints in light and dark. oklch normalized from the source’s comma syntax.',
      steps: arr.map((s) => ({
        step: String(s.scale),
        values: { light: s.oklch, dark: s.oklch },
      })),
    })
  }
  // black/white are single static swatches, emitted as one-step ramps.
  for (const [family, oklch] of palette.statics) {
    ramps.push({
      name: family,
      kind: 'static',
      note: 'Pure static colour — mode-invariant.',
      steps: [{ step: family, values: { light: oklch, dark: oklch } }],
    })
  }
  ramps.sort((a, b) => a.name.localeCompare(b.name))

  // ── token groups (one per theme) ──────────────────────────────────────────
  const disagreements: string[] = []
  let refResolved = 0
  let refNull = 0

  const themeGroup = (theme: Theme): TokenGroup => {
    const isNeutralBase = NEUTRAL_THEMES.has(theme.name)
    const tokenNames = [
      ...new Set([...Object.keys(theme.light), ...Object.keys(theme.dark)]),
    ]
    const tokens: Token[] = tokenNames.map((name) => {
      const values: Record<string, string> = {}
      for (const mode of MODES) {
        const v = theme[mode][name]
        if (v) values[mode] = v
      }
      // A token's ref is resolved from whichever mode value is present (they
      // share a family); prefer light.
      const primaryMode = theme.light[name] ? 'light' : 'dark'
      const resolution = resolveRef(
        theme[primaryMode][name]!,
        theme.name,
        primaryMode,
        name,
        rampSteps,
        commentMap,
        theme.name,
      )
      if (resolution.disagreement) disagreements.push(resolution.disagreement)
      if (resolution.ref) refResolved++
      else refNull++
      return { name, ref: resolution.ref, values, note: null }
    })
    return {
      name: `Theme: ${theme.name}`,
      layer: 'semantic',
      note: isNeutralBase
        ? `Base theme (neutral). ${theme.name === 'neutral' ? 'The default base.' : ''}`.trim()
        : 'Accent theme — repaints primary/ring and their sidebar twins over a base neutral.',
      sources: [COLORS_URL, THEMING_URL],
      tokens,
    }
  }

  const neutralThemes = themes.filter((t) => NEUTRAL_THEMES.has(t.name))
  const accentThemes = themes.filter((t) => !NEUTRAL_THEMES.has(t.name))
  const tokenGroups: TokenGroup[] = [
    ...neutralThemes.map(themeGroup),
    ...accentThemes.map(themeGroup),
  ]

  // ── derived colours ───────────────────────────────────────────────────────
  const rawUses: RawUse[] = []
  for (const file of STYLE_FILES) rawUses.push(...parseStyleFile(read(file.as)))
  const derivedEntries = aggregateDerived(rawUses)

  // ── overview ──────────────────────────────────────────────────────────────
  const chromaticCount = ramps.filter((r) => r.kind === 'chromatic').length
  const neutralCount = ramps.filter((r) => r.kind === 'neutral').length
  const overview: SpecEntry[] = [
    {
      label: 'Token model',
      value: 'Semantic CSS custom properties, authored in OKLCH.',
      note: 'Components consume --primary, --muted, --border… directly; no primitive token tier is shipped.',
      sources: [THEMING_URL],
    },
    {
      label: 'Scale source',
      value: 'Borrowed Tailwind v4 palette plus shadcn’s custom neutrals.',
      note: `${ramps.length} ramps — ${neutralCount} neutral, ${chromaticCount} chromatic, and pure black/white.`,
      sources: [COLORS_URL],
    },
    {
      label: 'Themes',
      value: `${tokenGroups.length} themes — ${neutralThemes.length} base neutral + ${accentThemes.length} accent.`,
      note: 'The default base is neutral; accent themes repaint primary/ring and their sidebar twins.',
      sources: [COLORS_URL],
    },
    {
      label: 'Modes',
      value: 'Light and dark, per theme.',
      note: 'Scales are mode-invariant; only the semantic token map changes between modes.',
      sources: [THEMING_URL],
    },
    {
      label: 'Point-of-use colours',
      value: `${derivedEntries.length} derived expressions in component styles.`,
      note: 'Opacity modifiers, color-mix, and relative-oklch tints — never declared tokens.',
      sources: [],
    },
  ]

  // ── layers ────────────────────────────────────────────────────────────────
  const layers: Layer[] = [
    {
      name: 'Primitive scale',
      kind: 'primitive',
      example: 'blue-500',
      note: 'Borrowed Tailwind v4 palette (plus custom neutrals); referenced by tokens, not by components.',
    },
    {
      name: 'Semantic tokens',
      kind: 'semantic',
      example: '--primary',
      note: 'The CSS custom properties every component paints from.',
    },
    {
      name: 'Point-of-use derivations',
      kind: 'component',
      example: 'bg-primary/10',
      note: 'No component token tier — components consume semantic tokens directly plus in-class derivations (see the usage section).',
    },
  ]

  // ── focus ─────────────────────────────────────────────────────────────────
  const focus: SpecEntry[] = [
    {
      label: 'Focus ring',
      value: 'Drawn from the --ring token.',
      note: 'Components paint the ring at reduced opacity, e.g. ring-ring/50 (see the usage section).',
      sources: [THEMING_URL],
    },
  ]

  // ── notes ─────────────────────────────────────────────────────────────────
  const notes: Note[] = [
    {
      section: 'palette',
      text: 'Scales are the borrowed Tailwind v4 palette plus shadcn’s custom neutrals. They do not vary by colour scheme — the same value paints in light and dark.',
      sources: [COLORS_URL],
    },
    {
      section: 'tokens',
      text: 'One theme per token group. The seven base-neutral themes ship a full token set; accent themes override only primary/ring and their sidebar twins. References point at the Tailwind step shadcn resolves each value to.',
      sources: [THEMING_URL],
    },
    {
      section: 'usage',
      text: 'Point-of-use colours are extracted from style-nova, shadcn’s default style — the other styles derive colours the same way. Opacity modifiers resolve to the color-mix Tailwind emits; relative-oklch expressions are kept verbatim.',
      sources: [],
    },
  ]

  const colors: ColorsFile = {
    modes: [...MODES],
    overview,
    layers,
    ramps,
    tokenGroups,
    stepRoles: null,
    focus,
    focusRing: null,
    contrast: [],
    derivedColors: {
      note: 'Colours that exist only at point of use in component styles — opacity-modified tokens, color-mix, and relative-oklch tints. Extracted from style-nova, shadcn’s default style.',
      sources: [],
      entries: derivedEntries,
    },
    notes,
    sources: [REPO, COLORS_URL, THEMING_URL],
    provenance: {
      method: 'script',
      extractor: 'ds/scripts/systems/shadcn-ui.ts',
      sources: [
        {
          kind: 'repo',
          url: REPO,
          ref: REF,
          retrievedAt: null,
          snapshot: 'shadcn-ui',
        },
      ],
      notes:
        'Ramps come from _legacy-colors.ts (the palette source; the generated public/r/colors/index.json is a stale subset that omits the four custom neutrals). Its nonstandard comma oklch syntax is normalized to space-separated CSS on emit. Derived colours are extracted from style-nova only — shadcn’s default style; the other styles repeat the same derivations. The bases/{base,radix} component tsx carry a small number of additional opacity-modified token uses (~15 each, no color-mix) that are not vendored, so a handful of point-of-use colours may be missing from the usage section.',
    },
  }

  // Surface extraction stats on stderr for the runner/report (not part of data).
  if (disagreements.length > 0) {
    console.error(
      `[shadcn-ui] ${disagreements.length} comment/numeric ref disagreement(s):`,
    )
    for (const d of disagreements) console.error(`    ${d}`)
  }
  console.error(
    `[shadcn-ui] refs resolved=${refResolved} null=${refNull}; derived entries=${derivedEntries.length}`,
  )

  return colors
}

const config: SystemConfig = {
  slug: 'shadcn-ui',
  source: SOURCE,
  extract,
}

export default config
