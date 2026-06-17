// ============================================================================
// SourceFirst playground — template model + formatter-faithful renderer.
//
// `source-overlay.ts` (build, Node) formats the real demo source ONCE with
// oxfmt and lifts it into this JSON-serializable template: verbatim formatted
// text for everything static, structured nodes for every part a control can
// change. `renderCode` (runtime, browser) re-renders the dynamic parts for the
// current control values, re-making exactly the layout decisions oxfmt would
// make — so the displayed code is always a fixed point of the formatter
// (enforced across every playground by playground-fidelity.test.ts):
//
//  - an element with a single text/expression child joins onto one line iff
//    it has at most one attribute and the joined line fits PRINT_WIDTH;
//    element children always sit on their own lines
//  - an open tag that exceeds PRINT_WIDTH breaks to one attribute per line
//  - JSX text fill-wraps greedily at PRINT_WIDTH
//  - when every child drops, the element self-closes
//  - a single-line body inlines into `return …;`, otherwise wraps in parens
//  - string literals pick the quote that needs fewer escapes (ties → double)
// ============================================================================

export type ValueKind =
  | 'boolean'
  | 'string'
  | 'number'
  | 'enum'
  | 'icon'
  | 'node'
export type SerializedDefault = string | number | boolean | null

export const PRINT_WIDTH = 120

/** A controllable attribute on a dynamic element. Dropped at its default. */
export interface AttrHole {
  part: 'attr'
  control: string
  attrName: string
  kind: ValueKind
  default: SerializedDefault
  /** Derived attr (progress-bar): drop entirely when this boolean control is truthy. */
  dropWhen?: string
}

export type AttrPart = { part: 'static'; text: string } | AttrHole

/** A `{param}` child slot: plain text, or an icon element. Dropped when falsy. */
export interface TextHole {
  part: 'text'
  control: string
  kind: ValueKind
}

export type ChildPart =
  /** Verbatim formatted lines, dedented so the block's first column is 0. */
  | { part: 'static'; lines: string[] }
  /** Static JSX text, whitespace-collapsed; refilled at render time. */
  | { part: 'static-text'; text: string }
  | TextHole
  /** A nested element; with `showWhen` it came from `{cond && <El>…</El>}`. */
  | { part: 'element'; el: TemplateElement; showWhen?: string }

export interface TemplateElement {
  tag: string
  attrs: AttrPart[]
  children: ChildPart[]
}

export interface ImportDecl {
  /** Already path-rewritten (@/registry → @/components etc.). */
  source: string
  /** Verbatim oxfmt line(s) for the FULL symbol set (fast path). */
  text: string
  symbols: { name: string; local?: string }[]
  kind: 'named' | 'default'
}

export interface ConstDecl {
  name: string
  /** Verbatim oxfmt decl, e.g. `const items = [ ... ];`. */
  real: string
  /** Collapsed placeholder, e.g. `const items = /* ... *​/;`. */
  placeholder: string
}

export interface CodeTemplate {
  root: TemplateElement
  consts: ConstDecl[]
  imports: ImportDecl[]
  /** Column the root tag sits at inside `return (…)` (oxfmt emits 4). */
  bodyIndent: number
}

/** All holes in a template subtree (attr holes, text holes, conditional guards). */
export function collectTemplateHoles(
  el: TemplateElement,
): (AttrHole | TextHole)[] {
  const holes: (AttrHole | TextHole)[] = []
  for (const attr of el.attrs) {
    if (attr.part === 'attr') holes.push(attr)
  }
  for (const child of el.children) {
    if (child.part === 'text') holes.push(child)
    else if (child.part === 'element')
      holes.push(...collectTemplateHoles(child.el))
  }
  return holes
}

// ---------------------------------------------------------------------------
// RUNTIME
// ---------------------------------------------------------------------------

export interface RenderOptions {
  expanded: boolean
}

export function renderCode(
  template: CodeTemplate,
  values: Record<string, unknown>,
  { expanded }: RenderOptions,
): string {
  // Lucide icons referenced by icon fills; they need an import in expanded view.
  const icons = new Set<string>()
  const bodyLines = renderElement(
    template.root,
    values,
    template.bodyIndent,
    icons,
  )
  const body = bodyLines.join('\n')
  const used = collectUsedSymbols(template, body)

  if (!expanded) {
    const placeholders = template.consts
      .filter((c) => used.consts.has(c.name))
      .map((c) => c.placeholder)
      .join('\n')
    const dedented = bodyLines
      .map((l) => (l.trim() === '' ? '' : l.slice(template.bodyIndent)))
      .join('\n')
    return placeholders ? `${placeholders}\n\n${dedented}` : dedented
  }

  const importLines = renderImports(template.imports, used.symbols, icons)
  const realConsts = template.consts
    .filter((c) => used.consts.has(c.name))
    .map((c) => c.real)
    .join('\n\n')

  // oxfmt inlines a single-line JSX return; parens only for multiline bodies.
  const inlineReturn = `  return ${body.trim()};`
  const fn =
    bodyLines.length === 1 && inlineReturn.length <= PRINT_WIDTH
      ? `export function Demo() {\n${inlineReturn}\n}`
      : `export function Demo() {\n  return (\n${body}\n  );\n}`

  const parts: string[] = []
  if (importLines) parts.push(importLines)
  if (realConsts) parts.push(realConsts)
  parts.push(fn)
  return parts.join('\n\n')
}

// ---------------------------------------------------------------------------
// Element rendering — mirrors oxfmt's JSX layout decisions
// ---------------------------------------------------------------------------

/** A rendered child: fillable text, an atomic `{…}` expression, or block lines. */
type Kid =
  | { type: 'text'; text: string }
  | { type: 'expr'; code: string }
  | { type: 'block'; lines: string[] }

function renderElement(
  el: TemplateElement,
  values: Record<string, unknown>,
  indent: number,
  icons: Set<string>,
): string[] {
  const pad = ' '.repeat(indent)

  const attrs: string[] = []
  for (const attr of el.attrs) {
    const text =
      attr.part === 'static' ? attr.text : renderAttrHole(attr, values, icons)
    if (text !== null) attrs.push(text)
  }

  const kids: Kid[] = []
  for (const child of el.children) {
    const kid = renderChild(child, values, indent + 2, icons)
    if (kid) kids.push(kid)
  }

  const openInline = `<${el.tag}${attrs.map((a) => ` ${a}`).join('')}`
  // oxfmt never breaks an open tag whose only attribute is a plain string
  // literal, no matter how long the line gets.
  const neverBreakOpen =
    attrs.length === 1 && /^[\w-]+="[^"]*"$/.test(attrs[0] ?? '')

  // Every child dropped → self-close.
  if (kids.length === 0) {
    if (neverBreakOpen || indent + openInline.length + 3 <= PRINT_WIDTH) {
      return [`${pad}${openInline} />`]
    }
    return [`${pad}<${el.tag}`, ...attrLines(attrs, indent + 2), `${pad}/>`]
  }

  // Single text/expression child + at most one attribute → join when it fits.
  const only = kids.length === 1 ? kids[0] : undefined
  if (only && only.type !== 'block' && attrs.length <= 1) {
    const inner = only.type === 'text' ? only.text : only.code
    const joined = `${openInline}>${inner}</${el.tag}>`
    if (indent + joined.length <= PRINT_WIDTH) return [pad + joined]
  }

  const open =
    neverBreakOpen || indent + openInline.length + 1 <= PRINT_WIDTH
      ? [`${pad}${openInline}>`]
      : [`${pad}<${el.tag}`, ...attrLines(attrs, indent + 2), `${pad}>`]

  const childLines = kids.flatMap((kid) => {
    if (kid.type === 'text') return fillText(kid.text, indent + 2)
    if (kid.type === 'expr') return [`${' '.repeat(indent + 2)}${kid.code}`]
    return kid.lines
  })

  return [...open, ...childLines, `${pad}</${el.tag}>`]
}

function attrLines(attrs: string[], indent: number): string[] {
  const pad = ' '.repeat(indent)
  return attrs.map((a) => pad + a)
}

/** Greedy fill at PRINT_WIDTH — matches oxfmt's JSX text wrapping. */
function fillText(text: string, indent: number): string[] {
  const pad = ' '.repeat(indent)
  const budget = PRINT_WIDTH - indent
  const lines: string[] = []
  let current = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (current === '') current = word
    else if (current.length + 1 + word.length <= budget) current += ` ${word}`
    else {
      lines.push(pad + current)
      current = word
    }
  }
  if (current !== '') lines.push(pad + current)
  return lines
}

function renderAttrHole(
  hole: AttrHole,
  values: Record<string, unknown>,
  icons: Set<string>,
): string | null {
  if (hole.dropWhen && isTruthy(values[hole.dropWhen])) return null
  const value = values[hole.control]
  if (serializeForCompare(value, hole.kind) === hole.default) return null

  switch (hole.kind) {
    case 'boolean':
      return value === true ? hole.attrName : `${hole.attrName}={false}`
    case 'number':
      return `${hole.attrName}={${Number(value)}}`
    case 'icon': {
      if (!value) return null
      const icon = String(value)
      icons.add(icon)
      return `${hole.attrName}={<${icon} />}`
    }
    default: {
      const s = String(value)
      // clean → plain quoted form; dirty → brace form (both oxfmt-stable)
      return /["\\\n\r]/.test(s)
        ? `${hole.attrName}={${quoteString(s)}}`
        : `${hole.attrName}="${s}"`
    }
  }
}

function renderChild(
  child: ChildPart,
  values: Record<string, unknown>,
  indent: number,
  icons: Set<string>,
): Kid | null {
  switch (child.part) {
    case 'static': {
      const pad = ' '.repeat(indent)
      return {
        type: 'block',
        lines: child.lines.map((l) => (l === '' ? '' : pad + l)),
      }
    }
    case 'static-text':
      return { type: 'text', text: child.text }
    case 'text': {
      const value = values[child.control]
      if (child.kind === 'icon') {
        if (!value) return null
        const icon = String(value)
        icons.add(icon)
        return { type: 'block', lines: [`${' '.repeat(indent)}<${icon} />`] }
      }
      if (isFalsy(value)) return null
      const s = String(value)
      // JSX text can't hold <>{} and collapses whitespace runs — use an
      // expression child for anything the text form couldn't represent.
      return /[<>{}\n\r]/.test(s) || /^\s|\s$/.test(s) || /\s{2,}/.test(s)
        ? { type: 'expr', code: `{${quoteString(s)}}` }
        : { type: 'text', text: s }
    }
    case 'element': {
      if (child.showWhen && isFalsy(values[child.showWhen])) return null
      return {
        type: 'block',
        lines: renderElement(child.el, values, indent, icons),
      }
    }
  }
}

/** Prettier's quote choice: single quotes iff they need fewer escapes. */
function quoteString(s: string): string {
  const doubles = (s.match(/"/g) ?? []).length
  const singles = (s.match(/'/g) ?? []).length
  const q = doubles > singles ? "'" : '"'
  const escaped = s
    .replaceAll('\\', '\\\\')
    .replaceAll(q, `\\${q}`)
    .replaceAll('\n', '\\n')
    .replaceAll('\r', '\\r')
  return q + escaped + q
}

function serializeForCompare(
  value: unknown,
  kind: ValueKind,
): SerializedDefault {
  if (value === undefined || value === null) return null
  switch (kind) {
    case 'boolean':
      return Boolean(value)
    case 'number':
      return Number(value)
    case 'icon':
      return value ? String(value) : null
    default:
      return String(value)
  }
}

function isFalsy(v: unknown): boolean {
  return v === undefined || v === null || v === '' || v === false
}
function isTruthy(v: unknown): boolean {
  return !isFalsy(v)
}

// ---------------------------------------------------------------------------
// IMPORT TREE-SHAKING (word-boundary scan: zero extra contract, never over-shakes)
// ---------------------------------------------------------------------------

function collectUsedSymbols(
  template: CodeTemplate,
  body: string,
): { symbols: Set<string>; consts: Set<string> } {
  const consts = new Set<string>()
  for (const c of template.consts)
    if (wordPresent(body, c.name)) consts.add(c.name)

  // Imports may be referenced from the body OR from a surviving const.
  const survivingConstText = template.consts
    .filter((c) => consts.has(c.name))
    .map((c) => c.real)
    .join('\n')
  const haystack = `${body}\n${survivingConstText}`
  const symbols = new Set<string>()
  for (const imp of template.imports) {
    for (const sym of imp.symbols) {
      if (wordPresent(haystack, sym.local ?? sym.name)) symbols.add(sym.name)
    }
  }
  return { symbols, consts }
}

function wordPresent(haystack: string, word: string): boolean {
  return new RegExp(
    `(^|[^A-Za-z0-9_$])${escapeRe(word)}([^A-Za-z0-9_$]|$)`,
  ).test(haystack)
}

function renderImports(
  imports: ImportDecl[],
  used: Set<string>,
  icons: Set<string>,
): string {
  // Icons not covered by any template import need their own lucide line.
  const declared = new Set(
    imports.flatMap((imp) => imp.symbols.map((s) => s.local ?? s.name)),
  )
  const missingIcons = [...icons].filter((i) => !declared.has(i)).sort()

  const lines: string[] = []
  for (const imp of imports) {
    if (imp.kind === 'default') {
      const sym = imp.symbols[0]
      if (sym && used.has(sym.name)) lines.push(imp.text)
      continue
    }
    const survivors = imp.symbols.filter((s) => used.has(s.name))
    let names = survivors.map((s) =>
      s.local && s.local !== s.name ? `${s.name} as ${s.local}` : s.name,
    )
    if (imp.source === 'lucide-react' && missingIcons.length > 0) {
      names = [...names, ...missingIcons.splice(0)]
    }
    if (names.length === 0) continue
    if (
      survivors.length === imp.symbols.length &&
      names.length === survivors.length
    ) {
      lines.push(imp.text) // verbatim oxfmt line (fast path)
      continue
    }
    lines.push(importLine(names, imp.source))
  }
  if (missingIcons.length > 0) {
    lines.unshift(importLine(missingIcons, 'lucide-react'))
  }
  return lines.join('\n')
}

function importLine(names: string[], source: string): string {
  const inline = `import { ${names.join(', ')} } from "${source}";`
  if (inline.length <= PRINT_WIDTH) return inline
  return `import {\n${names.map((n) => `  ${n},`).join('\n')}\n} from "${source}";`
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
