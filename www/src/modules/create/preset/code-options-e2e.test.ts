/**
 * End-to-end test of the codeOptions seam: a DesignSystem with custom code
 * options is encoded to a preset, decoded back, fed to the publisher, and
 * formatted — proving the choices a user makes in /create reach the exported
 * source. Exercises codec ↔ publish ↔ oxfmt together (the parts the unit
 * specs cover in isolation).
 */

import { format } from 'oxfmt'
import { describe, expect, test } from 'vitest'

import { buttonPublishable } from '@/publisher/__fixtures__/button-publishable'
import { DEFAULT_CODE_OPTIONS } from '@/publisher/code-options'
import { publish } from '@/publisher/publish'

import { decodePreset, encodePreset } from './codec'
import { DEFAULTS } from './defaults'

// Mirrors the fixed baseline the /r/$name route uses (formatting isn't a
// codeOptions axis — the consumer reformats with their own rules).
const OUTPUT_FORMAT = { printWidth: 80 } as const

async function exportButton(codeOptions: typeof DEFAULT_CODE_OPTIONS) {
  // 1. Encode the user's design system (with code options) to a preset blob.
  const encoded = encodePreset({ ...DEFAULTS, codeOptions })
  expect(encoded, 'non-default code options must produce a preset').toBeTruthy()

  // 2. Decode it back the way a /r/* route does.
  const ds = decodePreset(encoded as string)

  // 3. Publish + format exactly like routes/r/$name.tsx.
  const { rawContent } = publish({
    publishable: buttonPublishable,
    preset: {
      density: ds.density,
      componentParams: ds.componentParams,
      codeOptions: ds.codeOptions,
    },
  })
  const { code } = await format('button.tsx', rawContent, OUTPUT_FORMAT)
  return { decoded: ds.codeOptions, code }
}

describe('codeOptions end-to-end (preset → publish → format)', () => {
  test('classArrays:false collapses tv class lists in the exported file', async () => {
    const { decoded, code } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      classArrays: false,
    })

    // codec round-trip preserved the option
    expect(decoded?.classArrays).toBe(false)

    // base groups are joined into one string (no array-element split)
    expect(code).toContain('select-none focus-reset focus-visible:focus-ring')
  })

  test('sectionComments survives the codec round-trip', async () => {
    const { decoded } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      sectionComments: true,
    })
    expect(decoded?.sectionComments).toBe(true)
  })

  test('styleEngine:stylex round-trips and yields a StyleX export', async () => {
    // The whole user flow: pick StyleX in /create → encode → decode → publish.
    const { decoded, code } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      styleEngine: 'stylex',
    })
    expect(decoded?.styleEngine).toBe('stylex')
    expect(code).toContain('import * as stylex from "@stylexjs/stylex";')
    expect(code).toContain('stylex.create(')
    expect(code).not.toMatch(/\btv\(/)
  })
})
