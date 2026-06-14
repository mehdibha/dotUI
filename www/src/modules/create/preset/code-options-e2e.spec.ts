/**
 * End-to-end test of the codeOptions seam: a DesignSystem with custom code
 * options is encoded to a preset, decoded back, fed to the publisher, and
 * formatted — proving the choices a user makes in /create reach the exported
 * source. Exercises codec ↔ publish ↔ oxfmt together (the parts the unit
 * specs mock out).
 */

import { format } from 'oxfmt'
import { describe, expect, test } from 'vitest'

import { buttonPublishable } from '@/publisher/__fixtures__/button-publishable'
import { DEFAULT_CODE_OPTIONS } from '@/publisher/code-options'
import { codeOptionsToFormatConfig } from '@/publisher/format-config'
import { publish } from '@/publisher/publish'

import { decodePreset, encodePreset } from './codec'
import { DEFAULTS } from './defaults'

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
  const { code } = await format(
    'button.tsx',
    rawContent,
    codeOptionsToFormatConfig(ds.codeOptions ?? DEFAULT_CODE_OPTIONS),
  )
  return { decoded: ds.codeOptions, code }
}

describe('codeOptions end-to-end (preset → publish → format)', () => {
  test('single quotes + no semicolons + tabs reach the exported file', async () => {
    const { decoded, code } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      quoteStyle: 'single',
      semicolons: false,
      indentStyle: 'tab',
    })

    // codec round-trip preserved the options
    expect(decoded?.quoteStyle).toBe('single')
    expect(decoded?.semicolons).toBe(false)

    // formatter applied them to the real output
    expect(code).toContain("'use client'")
    expect(code).not.toContain('"use client"')
    expect(code).not.toContain("'use client';")
    expect(code).toContain('\t')
  })

  test('double quotes + semicolons + spaces reach the exported file', async () => {
    const { code } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      quoteStyle: 'double',
      semicolons: true,
      indentStyle: 'space',
      indentWidth: 2,
      printWidth: 100, // non-default so the preset actually encodes
    })

    expect(code).toContain('"use client";')
    expect(code).not.toContain('\t')
    expect(code).toContain('  ') // 2-space indent
  })

  test('file header is prepended and use-client can be stripped together', async () => {
    // (applyFileHeader runs in the route, after format — mirror that here.)
    const { applyFileHeader } = await import('@/publisher/code-options')
    const { code } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      useClient: 'strip',
    })
    expect(code).not.toContain('use client')
    const withHeader = applyFileHeader(code, '(c) 2026 Acme')
    expect(withHeader.startsWith('/**')).toBe(true)
    expect(withHeader).toContain('(c) 2026 Acme')
  })
})
