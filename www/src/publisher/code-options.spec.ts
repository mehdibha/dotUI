/**
 * Tests for the `codeOptions` transforms — the non-formatter customization
 * layer that shapes the STYLE of exported code.
 *
 * Coverage:
 *   - sanitizeCodeOptions   : robust coercion of stale/crafted presets
 *   - flattenClassArrays    : grouped arrays → single string per slot/variant
 *   - stripSectionComments  : // MARK: removal
 *   - stripUseClient        : "use client" removal
 *   - applyFileHeader       : banner/license block
 *   - publish (integration) : the options flow through the request-time path
 */

import { describe, expect, test } from 'vitest'

import { buttonPublishable } from './__fixtures__/button-publishable'
import {
  applyFileHeader,
  DEFAULT_CODE_OPTIONS,
  flattenClassArrays,
  sanitizeCodeOptions,
  stripSectionComments,
  stripUseClient,
} from './code-options'
import { publish, TV_CONFIG_PLACEHOLDER } from './publish'
import type { TvLayer } from './types'

/* ============================================================ */
/* sanitizeCodeOptions                                          */
/* ============================================================ */

describe('sanitizeCodeOptions', () => {
  test('non-object input returns a full default copy', () => {
    expect(sanitizeCodeOptions(undefined)).toEqual(DEFAULT_CODE_OPTIONS)
    expect(sanitizeCodeOptions('nope')).toEqual(DEFAULT_CODE_OPTIONS)
    expect(sanitizeCodeOptions(42)).toEqual(DEFAULT_CODE_OPTIONS)
    // a fresh copy, not the shared default object
    expect(sanitizeCodeOptions(null)).not.toBe(DEFAULT_CODE_OPTIONS)
  })

  test('keeps valid fields and falls back per-field for invalid ones', () => {
    const out = sanitizeCodeOptions({
      classArrays: false,
      useClient: 'strip',
      sectionComments: 'nope', // not a boolean → default
      extra: 'ignored',
    })
    expect(out.classArrays).toBe(false)
    expect(out.useClient).toBe('strip')
    expect(out.sectionComments).toBe(DEFAULT_CODE_OPTIONS.sectionComments)
  })

  test('invalid enum value falls back to default', () => {
    expect(sanitizeCodeOptions({ useClient: 'banana' }).useClient).toBe(
      DEFAULT_CODE_OPTIONS.useClient,
    )
  })

  test('non-string fileHeader falls back to default', () => {
    expect(sanitizeCodeOptions({ fileHeader: 123 }).fileHeader).toBe('')
    expect(sanitizeCodeOptions({ fileHeader: '© Me' }).fileHeader).toBe('© Me')
  })
})

/* ============================================================ */
/* flattenClassArrays                                           */
/* ============================================================ */

describe('flattenClassArrays', () => {
  test('joins a grouped base array into a single string', () => {
    const out = flattenClassArrays({ base: ['a b', 'c', 'd e'] })
    expect(out.base).toBe('a b c d e')
  })

  test('collapses slot arrays, drops empties, keeps strings', () => {
    const layer: TvLayer = {
      slots: {
        root: ['px-4', 'rounded-md'],
        title: 'font-medium',
        empty: ['', ''],
      },
    }
    const out = flattenClassArrays(layer)
    expect(out.slots?.root).toBe('px-4 rounded-md')
    expect(out.slots?.title).toBe('font-medium')
    expect(out.slots?.empty).toBeUndefined()
  })

  test('joins arrays inside variant slot maps', () => {
    const layer: TvLayer = {
      variants: {
        variant: {
          danger: { root: ['border', 'border-danger'], title: 'text-danger' },
        },
      },
    }
    const out = flattenClassArrays(layer)
    const danger = out.variants?.variant?.danger as Record<string, unknown>
    expect(danger.root).toBe('border border-danger')
    expect(danger.title).toBe('text-danger')
  })

  test('joins flat (slotless) variant arrays', () => {
    const out = flattenClassArrays({
      variants: { size: { lg: ['h-9', 'px-4'] } },
    })
    expect(out.variants?.size?.lg).toBe('h-9 px-4')
  })

  test('joins compoundVariants class, preserves selector keys', () => {
    const out = flattenClassArrays({
      compoundVariants: [{ variant: 'primary', size: 'lg', class: ['a', 'b'] }],
    })
    expect(out.compoundVariants?.[0]).toEqual({
      variant: 'primary',
      size: 'lg',
      class: 'a b',
    })
  })
})

/* ============================================================ */
/* stripSectionComments                                         */
/* ============================================================ */

describe('stripSectionComments', () => {
  test('removes MARK lines and collapses the gap', () => {
    const src = [
      '// MARK: buttonStyles',
      'const styles = {}',
      '',
      '// MARK: Separator',
      '',
      'export { styles }',
      '',
    ].join('\n')
    const out = stripSectionComments(src)
    expect(out).not.toContain('MARK')
    expect(out).toContain('const styles = {}')
    expect(out).toContain('export { styles }')
    expect(out).not.toMatch(/\n{3,}/)
  })

  test('leaves ordinary comments alone', () => {
    const src = '// a normal comment\nconst x = 1\n'
    expect(stripSectionComments(src)).toBe(src)
  })

  test('strips indented MARK comments too', () => {
    expect(stripSectionComments('\t\t// MARK: nested\n\tcode\n')).toBe(
      '\tcode\n',
    )
  })
})

/* ============================================================ */
/* stripUseClient                                               */
/* ============================================================ */

describe('stripUseClient', () => {
  test('removes a leading double-quoted directive with semicolon', () => {
    expect(stripUseClient('"use client";\n\nimport x\n')).toBe('import x\n')
  })

  test('removes a single-quoted directive without semicolon', () => {
    expect(stripUseClient("'use client'\n\nconst x = 1\n")).toBe(
      'const x = 1\n',
    )
  })

  test('leaves files without the directive untouched', () => {
    expect(stripUseClient('import x\n')).toBe('import x\n')
  })

  test('does not touch a non-leading occurrence', () => {
    const src = 'const s = "use client"\n'
    expect(stripUseClient(src)).toBe(src)
  })
})

/* ============================================================ */
/* applyFileHeader                                              */
/* ============================================================ */

describe('applyFileHeader', () => {
  test('empty / whitespace header is a no-op', () => {
    expect(applyFileHeader('const x = 1\n', '')).toBe('const x = 1\n')
    expect(applyFileHeader('const x = 1\n', '   \n  ')).toBe('const x = 1\n')
  })

  test('wraps a single line in a JSDoc block at the top', () => {
    const out = applyFileHeader("'use client'\n", '© 2026 Acme')
    expect(out).toBe("/**\n * © 2026 Acme\n */\n\n'use client'\n")
    // the directive is still present, only preceded by a comment
    expect(out).toContain("'use client'")
  })

  test('prefixes every line of a multi-line header', () => {
    const out = applyFileHeader('code\n', 'Line one\nLine two')
    expect(out).toBe('/**\n * Line one\n * Line two\n */\n\ncode\n')
  })
})

/* ============================================================ */
/* publish (integration)                                        */
/* ============================================================ */

describe('publish + codeOptions', () => {
  test('default options preserve grouped class arrays as array elements', () => {
    const { rawContent } = publish({
      publishable: buttonPublishable,
      preset: { density: 'default', componentParams: {} },
    })
    // classArrays defaults to true → each group is its own quoted array entry.
    expect(rawContent).toContain('"focus-reset focus-visible:focus-ring",')
  })

  test('classArrays:false collapses grouped arrays to one string', () => {
    const { rawContent } = publish({
      publishable: buttonPublishable,
      preset: {
        density: 'default',
        componentParams: {},
        codeOptions: { ...DEFAULT_CODE_OPTIONS, classArrays: false },
      },
    })
    // base groups are joined inline (no array element boundary between them).
    expect(rawContent).toContain(
      'select-none focus-reset focus-visible:focus-ring',
    )
  })

  test('strips the "use client" directive when requested', () => {
    const base = publish({
      publishable: buttonPublishable,
      preset: { density: 'default', componentParams: {} },
    })
    expect(base.rawContent).toContain('use client')

    const stripped = publish({
      publishable: buttonPublishable,
      preset: {
        density: 'default',
        componentParams: {},
        codeOptions: { ...DEFAULT_CODE_OPTIONS, useClient: 'strip' },
      },
    })
    expect(stripped.rawContent).not.toContain('use client')
    // the rest of the file survives intact.
    expect(stripped.rawContent).toContain('const buttonVariants = tv(')
  })

  test('strips // MARK comments by default, keeps them when enabled', () => {
    const publishable = {
      template: `// MARK: fooStyles\nconst foo = tv(${TV_CONFIG_PLACEHOLDER})\n\n// MARK: Separator\n\nexport { foo }\n`,
      stylesConfig: { base: {} },
      meta: { name: 'foo', type: 'registry:ui' as const },
    }

    const stripped = publish({
      publishable,
      preset: { density: 'default', componentParams: {} },
    })
    expect(stripped.rawContent).not.toContain('MARK')

    const kept = publish({
      publishable,
      preset: {
        density: 'default',
        componentParams: {},
        codeOptions: { ...DEFAULT_CODE_OPTIONS, sectionComments: true },
      },
    })
    expect(kept.rawContent).toContain('// MARK: Separator')
  })
})
