/**
 * `CodeOptions` — the user-configurable STYLE of the exported code.
 *
 * The design-system axes (colors, density, per-component styles…) decide what
 * the components LOOK like. `codeOptions` is the second customization layer: it
 * decides how the exported source READS, so it lands in the user's codebase
 * looking like the user wrote it, not like we generated it.
 *
 * Every option is a mechanical transform over the one canonical authoring style
 * of the registry source. There are three kinds:
 *
 *   1. oxfmt pass-through — mapped onto the `oxfmt` `format()` call that already
 *      runs on every export (`codeOptionsToFormatConfig`). Quotes, semicolons,
 *      indentation, line width, trailing commas, arrow parens, bracket spacing,
 *      JSX layout, import + class sorting. Cheap and lossless — oxfmt re-prints
 *      the whole file, so the build-time ts-morph pins (quote/indent/semi) never
 *      reach the consumer; these are genuinely the final authority.
 *   2. serialize-shape — changes how the resolved `tv(...)` config literal is
 *      rendered (`flattenClassArrays`). Grouped arrays (one concern per line)
 *      vs. a single class string per slot/variant.
 *   3. comment / directive transforms — add/strip text in the emitted source
 *      (`stripSectionComments`, `stripUseClient`, `applyFileHeader`).
 *
 * Structural axes (arrow↔function, interface↔type, named↔default export, RAC
 * barrel imports, JS output…) are intentionally NOT here: they require a
 * structural rewrite of the component body, which means normalizing the
 * registry source to one canonical form and doing the transform at build time
 * (ts-morph). That belongs with the planned publisher rewrite, not the
 * request-time path — see docs and the `codeOptions` notes.
 *
 * Pure JS, no external imports — safe to import from anywhere: the request-time
 * route bundle, the `/create` client bundle, AND the "Open in v0" showcase
 * bundle (the create codec pulls this in transitively). The oxfmt-typed mapping
 * lives in `./format-config` so `oxfmt` never reaches those bundles.
 */

import type { ClassValue, TvLayer, VariantSliceValue } from './types'

/* --------------------------------- types --------------------------------- */

export interface CodeOptions {
  /* -- formatting (oxfmt) -- */
  /** Print semicolons at the ends of statements. */
  semicolons: boolean
  /** Quote style for JS/TS strings (oxfmt keeps whichever avoids escaping). */
  quoteStyle: 'single' | 'double'
  /** Quote style for JSX attribute values, independent of JS strings. */
  jsxQuoteStyle: 'single' | 'double'
  /** Indent with tabs or spaces. */
  indentStyle: 'tab' | 'space'
  /** Spaces per indent level (also the rendered width of a tab). */
  indentWidth: number
  /** Wrap lines that exceed this many columns. */
  printWidth: number
  /** Where to print trailing commas in multi-line constructs. */
  trailingComma: 'all' | 'es5' | 'none'
  /** Parentheses around single-argument arrow functions. */
  arrowParens: 'always' | 'avoid'
  /** Spaces just inside object braces / destructuring: `{ foo }` vs `{foo}`. */
  bracketSpacing: boolean
  /** Keep a one-line object expanded when authored multi-line, or collapse it. */
  objectWrap: 'preserve' | 'collapse'
  /** When object keys get quoted. */
  quoteProps: 'as-needed' | 'consistent' | 'preserve'
  /** Line-ending sequence written to files. */
  endOfLine: 'lf' | 'crlf'

  /* -- JSX (oxfmt) -- */
  /** Put the closing `>` of a multi-line tag on the last prop's line. */
  jsxBracketSameLine: boolean
  /** Force every JSX attribute onto its own line. */
  singleAttributePerLine: boolean

  /* -- imports & classes -- */
  /** Sort + group `import` statements. */
  sortImports: boolean
  /** Sort Tailwind classes (className attributes + `cn`/`tv` calls). */
  sortClasses: boolean
  /**
   * How multi-group class values render inside the `tv(...)` config:
   *   - `true`  → an array of strings, one authored group per line (grouped).
   *   - `false` → a single space-joined string per slot/variant (compact).
   */
  classArrays: boolean

  /* -- directives & comments -- */
  /** Keep or strip the leading `"use client"` directive (RSC vs SPA/Vite). */
  useClient: 'keep' | 'strip'
  /** Keep the `// MARK:` section/separator comments from the source. */
  sectionComments: boolean
  /**
   * A banner/license comment prepended to every exported file. Plain text
   * (one entry per line); rendered as a JSDoc block. Empty string = none.
   */
  fileHeader: string
}

/**
 * Defaults aim at the conventional, clean output a typical React + Tailwind
 * codebase would use (≈ Prettier/shadcn norms): 2-space indent, double quotes,
 * semicolons, sorted imports + classes, no internal section pragmas leaking to
 * the consumer. Two deliberate departures from today's raw publisher output
 * (which only pinned `printWidth:120, useTabs:true`): 2-space over tabs and an
 * 80-column width — both the more common React convention.
 *
 * Kept as a complete object (every field present) so the codec can diff the
 * whole recipe against this default — an untouched config encodes to nothing.
 */
export const DEFAULT_CODE_OPTIONS: CodeOptions = {
  semicolons: true,
  quoteStyle: 'double',
  jsxQuoteStyle: 'double',
  indentStyle: 'space',
  indentWidth: 2,
  printWidth: 80,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  objectWrap: 'preserve',
  quoteProps: 'as-needed',
  endOfLine: 'lf',
  jsxBracketSameLine: false,
  singleAttributePerLine: false,
  sortImports: true,
  sortClasses: true,
  classArrays: true,
  useClient: 'keep',
  sectionComments: false,
  fileHeader: '',
}

/* ------------------------------- validation ------------------------------- */

const QUOTE_STYLES = new Set<CodeOptions['quoteStyle']>(['single', 'double'])
const INDENT_STYLES = new Set<CodeOptions['indentStyle']>(['tab', 'space'])
const TRAILING_COMMAS = new Set<CodeOptions['trailingComma']>([
  'all',
  'es5',
  'none',
])
const ARROW_PARENS = new Set<CodeOptions['arrowParens']>(['always', 'avoid'])
const OBJECT_WRAPS = new Set<CodeOptions['objectWrap']>([
  'preserve',
  'collapse',
])
const QUOTE_PROPS = new Set<CodeOptions['quoteProps']>([
  'as-needed',
  'consistent',
  'preserve',
])
const END_OF_LINES = new Set<CodeOptions['endOfLine']>(['lf', 'crlf'])
const USE_CLIENT = new Set<CodeOptions['useClient']>(['keep', 'strip'])

function pickEnum<T extends string>(
  value: unknown,
  allowed: Set<T>,
  fallback: T,
): T {
  return typeof value === 'string' && allowed.has(value as T)
    ? (value as T)
    : fallback
}

function pickBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function pickInt(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.round(value)))
}

/**
 * Coerce an untouched / stale / crafted preset value into a complete, valid
 * `CodeOptions`. Mirrors `sanitizeColor` in the codec: never throws, always
 * returns something the publisher can act on.
 */
export function sanitizeCodeOptions(input: unknown): CodeOptions {
  if (typeof input !== 'object' || input === null) {
    return { ...DEFAULT_CODE_OPTIONS }
  }
  const raw = input as Partial<Record<keyof CodeOptions, unknown>>
  const d = DEFAULT_CODE_OPTIONS
  return {
    semicolons: pickBool(raw.semicolons, d.semicolons),
    quoteStyle: pickEnum(raw.quoteStyle, QUOTE_STYLES, d.quoteStyle),
    jsxQuoteStyle: pickEnum(raw.jsxQuoteStyle, QUOTE_STYLES, d.jsxQuoteStyle),
    indentStyle: pickEnum(raw.indentStyle, INDENT_STYLES, d.indentStyle),
    indentWidth: pickInt(raw.indentWidth, d.indentWidth, 1, 8),
    printWidth: pickInt(raw.printWidth, d.printWidth, 40, 200),
    trailingComma: pickEnum(
      raw.trailingComma,
      TRAILING_COMMAS,
      d.trailingComma,
    ),
    arrowParens: pickEnum(raw.arrowParens, ARROW_PARENS, d.arrowParens),
    bracketSpacing: pickBool(raw.bracketSpacing, d.bracketSpacing),
    objectWrap: pickEnum(raw.objectWrap, OBJECT_WRAPS, d.objectWrap),
    quoteProps: pickEnum(raw.quoteProps, QUOTE_PROPS, d.quoteProps),
    endOfLine: pickEnum(raw.endOfLine, END_OF_LINES, d.endOfLine),
    jsxBracketSameLine: pickBool(raw.jsxBracketSameLine, d.jsxBracketSameLine),
    singleAttributePerLine: pickBool(
      raw.singleAttributePerLine,
      d.singleAttributePerLine,
    ),
    sortImports: pickBool(raw.sortImports, d.sortImports),
    sortClasses: pickBool(raw.sortClasses, d.sortClasses),
    classArrays: pickBool(raw.classArrays, d.classArrays),
    useClient: pickEnum(raw.useClient, USE_CLIENT, d.useClient),
    sectionComments: pickBool(raw.sectionComments, d.sectionComments),
    fileHeader:
      typeof raw.fileHeader === 'string' ? raw.fileHeader : d.fileHeader,
  }
}

/* --------------------------- serialize-shape ----------------------------- */

function joinClassValue(value: ClassValue): ClassValue {
  if (!Array.isArray(value)) return value
  const parts: string[] = []
  for (const part of value) {
    if (typeof part === 'string' && part !== '') parts.push(part)
  }
  if (parts.length === 0) return undefined
  if (parts.length === 1) return parts[0]
  return parts.join(' ')
}

function joinVariantSlice(value: VariantSliceValue): VariantSliceValue {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const out: Record<string, ClassValue> = {}
    for (const [slot, slotValue] of Object.entries(value)) {
      out[slot] = joinClassValue(slotValue)
    }
    return out
  }
  return joinClassValue(value as ClassValue)
}

/**
 * Collapse every grouped class array in a flat tv layer into a single
 * space-joined string. Used when `classArrays` is off so each slot/variant
 * renders as one line. No-op shape-wise when values are already strings.
 */
export function flattenClassArrays(layer: TvLayer): TvLayer {
  const out: TvLayer = {}

  if (layer.base !== undefined) out.base = joinClassValue(layer.base)

  if (layer.slots) {
    const slots: Record<string, ClassValue> = {}
    for (const [k, v] of Object.entries(layer.slots)) {
      slots[k] = joinClassValue(v)
    }
    out.slots = slots
  }

  if (layer.variants) {
    const variants: NonNullable<TvLayer['variants']> = {}
    for (const [variantName, values] of Object.entries(layer.variants)) {
      const valuesOut: Record<string, VariantSliceValue> = {}
      for (const [valueName, slice] of Object.entries(values)) {
        valuesOut[valueName] = joinVariantSlice(slice)
      }
      variants[variantName] = valuesOut
    }
    out.variants = variants
  }

  if (layer.defaultVariants) out.defaultVariants = layer.defaultVariants

  if (layer.compoundVariants) {
    out.compoundVariants = layer.compoundVariants.map((cv) => {
      const result: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(cv)) {
        result[k] =
          k === 'class' || k === 'className'
            ? joinClassValue(v as ClassValue)
            : v
      }
      return result
    })
  }

  return out
}

/* ----------------------------- text edits ----------------------------- */

/**
 * Strip the source's `// MARK:` section/separator comments (an Xcode authoring
 * convention) from emitted code. Leftover blank runs are collapsed; oxfmt
 * normalises the rest.
 */
export function stripSectionComments(source: string): string {
  return source
    .replace(/^[ \t]*\/\/ MARK:.*$\n?/gm, '')
    .replace(/\n{3,}/g, '\n\n')
}

/**
 * Strip a leading `"use client"` / `'use client'` directive (with optional
 * semicolon) from the head of the file. For SPA/Vite consumers who don't want
 * stray RSC directives.
 */
export function stripUseClient(source: string): string {
  return source.replace(/^\s*['"]use client['"];?[ \t]*\r?\n+/, '')
}

/**
 * Prepend a banner/license comment as a JSDoc block at the top of the file
 * (above any `"use client"` directive — comments before a directive are legal).
 * Applied after formatting so the formatter doesn't reflow the banner.
 */
export function applyFileHeader(source: string, header: string): string {
  const trimmed = header.trim()
  if (trimmed === '') return source
  const body = trimmed
    .split('\n')
    .map((line) => ` * ${line}`.trimEnd())
    .join('\n')
  return `/**\n${body}\n */\n\n${source}`
}
