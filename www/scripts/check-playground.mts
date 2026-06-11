/**
 * Build-time verification for a SourceFirst playground.
 *
 * Runs the EXACT rehype build path for one component:
 *   MDX controls={…}  ->  buildControlsFromReference(+demo param defaults)
 *                     ->  buildSourceOverlay  ->  renderCode (collapsed + expanded)
 *
 * Exits non-zero (and prints the error) if the overlay throws — i.e. a control
 * didn't resolve to a hole, or oxfmt rejected the template. This is the same
 * fail-loud guard the production build enforces, surfaced per-component.
 *
 * Usage:  tsx scripts/check-playground.mts <component> [fileSlug]
 */
import { readFileSync } from 'node:fs'

import { renderCode } from '../src/modules/docs/codegen/code-template.ts'
import {
  buildSourceOverlay,
  type ControlSelection,
} from '../src/modules/docs/codegen/source-overlay.ts'
import { buildControlsFromReference } from '../src/modules/docs/interactive-demo/process-controls.ts'

const name = process.argv[2]
const fileSlug = process.argv[3] ?? 'playground'
if (!name) {
  console.error(
    'usage: tsx scripts/check-playground.mts <component> [fileSlug]',
  )
  process.exit(2)
}

const demoPath = `src/registry/ui/${name}/demos/${fileSlug}.tsx`
const mdxPath = `content/docs/components/${name}.mdx`
const demoSource = readFileSync(demoPath, 'utf8')
const mdx = readFileSync(mdxPath, 'utf8')

/** Extract the `controls={ … }` expression source from the <InteractiveDemo> tag (brace-matched). */
function extractControls(src: string): string {
  const tag = src.indexOf('<InteractiveDemo')
  if (tag < 0) throw new Error('no <InteractiveDemo> in MDX')
  const at = src.indexOf('controls={', tag)
  if (at < 0) throw new Error('no controls={…} on <InteractiveDemo>')
  let i = at + 'controls='.length // points at '{'
  let depth = 0
  const start = i
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) return src.slice(start + 1, i) // inside the outer braces
    }
  }
  throw new Error('unbalanced controls={…}')
}

const controlsSrc = extractControls(mdx)
// oxlint-disable-next-line no-new-func -- build-time eval of authored MDX expression
const controlInput = new Function(`"use strict"; return (${controlsSrc});`)()

const controls = await buildControlsFromReference(
  name,
  controlInput,
  demoSource,
)
const selections: ControlSelection[] = controls.map((c) => ({
  name: c.name,
  kind: c.type,
  default:
    c.type === 'icon'
      ? null
      : (((c as { defaultValue?: unknown }).defaultValue as never) ?? null),
}))

const template = await buildSourceOverlay({
  source: demoSource,
  controls: selections,
  componentName: name,
})
const values = Object.fromEntries(
  controls.map((c) => [
    c.name,
    c.type === 'icon' ? null : (c as { defaultValue?: unknown }).defaultValue,
  ]),
)

console.log(
  `✓ ${name}: overlay OK (${controls.length} controls, ${template.holes.length} holes)`,
)
console.log('---------- COLLAPSED ----------')
console.log(renderCode(template, values, { expanded: false }))
console.log('---------- EXPANDED ----------')
console.log(renderCode(template, values, { expanded: true }))
