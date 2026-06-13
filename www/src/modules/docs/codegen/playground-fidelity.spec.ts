/**
 * Playground ↔ oxfmt fidelity.
 *
 * For EVERY `<InteractiveDemo>` declared in the docs MDX, build its code
 * template exactly like the production build does (same control derivation,
 * same overlay, same oxfmt options), render the displayed code for an
 * adversarial matrix of control values, and assert:
 *
 *  1. EXPANDED code is a fixed point of oxfmt — formatting what we display
 *     changes nothing. This is the "exactly what our formatter would emit"
 *     contract.
 *  2. COLLAPSED code is the expanded body verbatim, dedented to column 0,
 *     prefixed with placeholders for the consts the expanded view includes.
 *  3. Icons referenced by the rendered code are actually imported.
 *
 * Failures print the demo name and the control values that produced the
 * mismatching render.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { format } from 'oxfmt'
import { describe, expect, it } from 'vitest'

import { getDefaultControlValue } from '../interactive-demo/control-defaults'
import {
  buildControlsFromReference,
  toControlSelections,
} from '../interactive-demo/process-controls'
import type { Control, ControlInput } from '../interactive-demo/types'
import {
  collectTemplateHoles,
  renderCode,
  type CodeTemplate,
} from './code-template'
import { buildSourceOverlay, OXFMT_OPTIONS } from './source-overlay'

const WWW_DIR = fileURLToPath(new URL('../../../../', import.meta.url))
const DOCS_DIR = path.join(WWW_DIR, 'content/docs')
const REGISTRY_UI_DIR = path.join(WWW_DIR, 'src/registry/ui')

// ---------------------------------------------------------------------------
// Discovery: every <InteractiveDemo> in the docs content
// ---------------------------------------------------------------------------

interface DiscoveredDemo {
  /** Registry item name, e.g. "button". */
  name: string
  /** Demo file slug under demos/ (default "playground"). */
  file: string
  controls: ControlInput[]
  mdxPath: string
}

async function discoverInteractiveDemos(): Promise<DiscoveredDemo[]> {
  const entries = await fs.readdir(DOCS_DIR, {
    recursive: true,
    withFileTypes: true,
  })
  const demos: DiscoveredDemo[] = []
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue
    const mdxPath = path.join(entry.parentPath, entry.name)
    const text = await fs.readFile(mdxPath, 'utf-8')
    for (const tag of extractTags(text, 'InteractiveDemo')) {
      const name = /\bname="([^"]+)"/.exec(tag)?.[1]
      if (!name) continue
      const file = /\bfile="([^"]+)"/.exec(tag)?.[1] ?? 'playground'
      demos.push({ name, file, controls: parseControlsAttr(tag), mdxPath })
    }
  }
  return demos
}

/** Self-closing `<TagName … />` occurrences, full tag text. */
function extractTags(text: string, tagName: string): string[] {
  const out: string[] = []
  const re = new RegExp(`<${tagName}\\b`, 'g')
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const end = text.indexOf('/>', m.index)
    if (end < 0) break
    out.push(text.slice(m.index, end))
  }
  return out
}

/** Evaluate the `controls={…}` MDX expression the same way the rehype build does. */
function parseControlsAttr(tag: string): ControlInput[] {
  const at = tag.indexOf('controls={')
  if (at < 0) return []
  const start = at + 'controls='.length
  let depth = 0
  let end = start
  for (let i = start; i < tag.length; i++) {
    if (tag[i] === '{') depth++
    else if (tag[i] === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  const expr = tag.slice(start + 1, end)
  // oxlint-disable-next-line no-new-func -- build-time eval of trusted authored MDX, mirrors rehype-transform
  const value: unknown = new Function(`"use strict"; return (${expr});`)()
  if (!Array.isArray(value)) {
    throw new Error(`controls={…} did not evaluate to an array: ${expr}`)
  }
  return value as ControlInput[]
}

// ---------------------------------------------------------------------------
// Value matrix: defaults + one-hot variants + widest + emptiest
// ---------------------------------------------------------------------------

const LONG_TEXT =
  'This is a very long piece of text that a user could absolutely type into this control to stress the layout'
const TRICKY_TEXT = 'Says "hi" with {braces}, <angles> and a  double space'

function variantsFor(control: Control): unknown[] {
  const d = getDefaultControlValue(control)
  switch (control.type) {
    case 'boolean':
      return [!d]
    case 'enum':
      return control.options.filter((o) => o !== d)
    case 'string':
      return ['Hello world', '', LONG_TEXT, TRICKY_TEXT].filter((v) => v !== d)
    case 'number':
      return [(control.defaultValue ?? 0) + 37]
    case 'icon':
      return ['MailIcon', 'SettingsIcon']
    default:
      return []
  }
}

/** The variant that renders widest, to stress cumulative line width. */
function widestVariantFor(control: Control): unknown {
  switch (control.type) {
    case 'boolean':
      return true
    case 'enum': {
      let widest = getDefaultControlValue(control)
      for (const o of control.options) {
        if (o.length > String(widest).length) widest = o
      }
      return widest
    }
    case 'string':
      return LONG_TEXT
    case 'number':
      return 1234567.5
    case 'icon':
      return 'SettingsIcon'
    default:
      return undefined
  }
}

/** The variant that renders narrowest/emptiest, to stress drops + self-close. */
function emptiestVariantFor(control: Control): unknown {
  switch (control.type) {
    case 'boolean':
      return false
    case 'string':
      return ''
    case 'icon':
      return null
    default:
      return getDefaultControlValue(control)
  }
}

function valueMatrix(controls: Control[]): Record<string, unknown>[] {
  const defaults: Record<string, unknown> = {}
  for (const c of controls) defaults[c.name] = getDefaultControlValue(c)

  const combos = new Map<string, Record<string, unknown>>()
  const add = (combo: Record<string, unknown>) =>
    combos.set(JSON.stringify(combo), combo)

  add(defaults)
  for (const c of controls) {
    for (const v of variantsFor(c)) add({ ...defaults, [c.name]: v })
  }
  const widest: Record<string, unknown> = {}
  const emptiest: Record<string, unknown> = {}
  for (const c of controls) {
    widest[c.name] = widestVariantFor(c)
    emptiest[c.name] = emptiestVariantFor(c)
  }
  add(widest)
  add(emptiest)
  return [...combos.values()]
}

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

/** Extract the JSX body from the rendered expanded code, dedented to column 0. */
function bodyOfExpanded(expanded: string): string {
  const open = expanded.lastIndexOf('\n  return (\n')
  if (open >= 0) {
    const start = open + '\n  return (\n'.length
    const close = expanded.indexOf('\n  );', start)
    expect(close, 'expanded `return (` never closes').toBeGreaterThan(start)
    return expanded
      .slice(start, close)
      .split('\n')
      .map((l) => (l.trim() === '' ? '' : l.slice(4)))
      .join('\n')
  }
  const inline = /\n {2}return (.*);\n\}$/.exec(expanded)
  expect(inline, 'expanded code has no return statement').not.toBeNull()
  return inline?.[1] ?? ''
}

async function assertFidelity(
  demo: DiscoveredDemo,
  template: CodeTemplate,
  values: Record<string, unknown>,
): Promise<void> {
  const label = `${demo.name} ${JSON.stringify(values)}`
  const expanded = renderCode(template, values, { expanded: true })
  const collapsed = renderCode(template, values, { expanded: false })

  // 1. Expanded is an oxfmt fixed point (oxfmt only appends the final newline).
  const result = await format('demo.tsx', expanded, OXFMT_OPTIONS)
  expect(
    result.errors.map((e) => e.message),
    `${label}\n→ rendered expanded code does not parse:\n${expanded}`,
  ).toEqual([])
  expect(result.code, `${label}\n→ expanded code is not oxfmt-formatted`).toBe(
    `${expanded}\n`,
  )

  // 2. Collapsed = used-const placeholders + the expanded body at column 0.
  const placeholders = template.consts
    .filter((c) => expanded.includes(c.real))
    .map((c) => c.placeholder)
    .join('\n')
  const expectedCollapsed = placeholders
    ? `${placeholders}\n\n${bodyOfExpanded(expanded)}`
    : bodyOfExpanded(expanded)
  expect(collapsed, `${label}\n→ collapsed/expanded drift`).toBe(
    expectedCollapsed,
  )

  // 3. Every icon the values inject is imported in the expanded code.
  for (const hole of collectTemplateHoles(template.root)) {
    if (hole.kind !== 'icon') continue
    const icon = values[hole.control]
    if (!icon) continue
    expect(
      expanded,
      `${label}\n→ icon ${String(icon)} is rendered but never imported`,
    ).toMatch(new RegExp(`import \\{[^}]*\\b${String(icon)}\\b[^}]*\\} from`))
  }
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

const discovered = await discoverInteractiveDemos()

describe('playground code generation matches oxfmt', () => {
  it('discovers the docs playgrounds', () => {
    expect(discovered.length).toBeGreaterThanOrEqual(44)
    const names = new Set(discovered.map((d) => d.name))
    expect(names.has('button')).toBe(true)
    expect(names.has('select')).toBe(true)
  })

  for (const demo of discovered) {
    it(`${demo.name} playground`, async () => {
      const source = await fs.readFile(
        path.join(REGISTRY_UI_DIR, demo.name, 'demos', `${demo.file}.tsx`),
        'utf-8',
      )
      const controls = await buildControlsFromReference(
        demo.name,
        demo.controls,
        source,
      )
      const template = await buildSourceOverlay({
        source,
        controls: toControlSelections(controls),
        componentName: demo.name,
      })

      for (const values of valueMatrix(controls)) {
        await assertFidelity(demo, template, values)
      }
    })
  }
})
