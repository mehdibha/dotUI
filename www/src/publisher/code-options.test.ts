/**
 * Tests for the `codeOptions` transforms — the non-formatter customization
 * layer that shapes the STYLE of exported code.
 *
 * Coverage:
 *   - sanitizeCodeOptions   : robust coercion of stale/crafted presets
 *   - flattenClassArrays    : grouped arrays → single string per slot/variant
 *   - applySectionComments  : // MARK: → section separators (or removal)
 *   - publish (integration) : the options flow through the request-time path
 */

import { describe, expect, test } from 'vitest'

import { buttonPublishable } from './__fixtures__/button-publishable'
import {
  applySectionComments,
  DEFAULT_CODE_OPTIONS,
  flattenClassArrays,
  sanitizeCodeOptions,
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
      sectionComments: 'nope', // not a boolean → default
      extra: 'ignored',
    })
    expect(out.classArrays).toBe(false)
    expect(out.sectionComments).toBe(DEFAULT_CODE_OPTIONS.sectionComments)
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
/* applySectionComments                                         */
/* ============================================================ */

describe('applySectionComments', () => {
  test('always drops the internal <name>Styles marker (disabled)', () => {
    const out = applySectionComments(
      '// MARK: buttonStyles\nconst x = 1\n',
      false,
    )
    expect(out).not.toContain('MARK')
    expect(out).toContain('const x = 1')
  })

  test('always drops the <name>Styles marker even when enabled', () => {
    const out = applySectionComments(
      '// MARK: buttonStyles\nconst x = 1\n',
      true,
    )
    expect(out).not.toContain('MARK')
    expect(out).not.toContain('buttonStyles')
    expect(out).toContain('const x = 1')
  })

  test('disabled: strips section markers, adds no separators', () => {
    const src = 'const a = 1\n\n// MARK: Separator\n\nconst b = 2\n'
    const out = applySectionComments(src, false)
    expect(out).not.toContain('MARK')
    expect(out).not.toContain('/*')
    expect(out).toContain('const a = 1')
    expect(out).toContain('const b = 2')
  })

  test('enabled: turns section markers into comment-rule separators', () => {
    const src = 'const a = 1\n\n// MARK: Separator\n\nconst b = 2\n'
    const out = applySectionComments(src, true)
    expect(out).not.toContain('MARK')
    expect(out).toContain('/* ---') // a real separator rule
    expect(out).toContain('const a = 1')
    expect(out).toContain('const b = 2')
  })

  test('enabled: drops the Styles marker but keeps other separators', () => {
    const src =
      '// MARK: fooStyles\nconst v = tv()\n\n// MARK: Separator\n\nexport { v }\n'
    const out = applySectionComments(src, true)
    expect(out).not.toContain('fooStyles')
    expect(out).toContain('/* ---')
    expect(out).toContain('const v = tv()')
  })

  test('leaves ordinary comments alone', () => {
    const src = '// a normal comment\nconst x = 1\n'
    expect(applySectionComments(src, true)).toBe(src)
    expect(applySectionComments(src, false)).toBe(src)
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

  test('drops the internal Styles marker; section separators follow the flag', () => {
    const publishable = {
      template: `// MARK: fooStyles\nconst foo = tv(${TV_CONFIG_PLACEHOLDER})\n\n// MARK: Separator\n\nexport { foo }\n`,
      stylesConfig: { base: {} },
      meta: { name: 'foo', type: 'registry:ui' as const },
    }

    // default (sectionComments off): every MARK gone, no separators added.
    const off = publish({
      publishable,
      preset: { density: 'default', componentParams: {} },
    })
    expect(off.rawContent).not.toContain('MARK')
    expect(off.rawContent).not.toContain('/* ---')

    // enabled: the Styles marker is still dropped, Separator → a rule.
    const on = publish({
      publishable,
      preset: {
        density: 'default',
        componentParams: {},
        codeOptions: { ...DEFAULT_CODE_OPTIONS, sectionComments: true },
      },
    })
    expect(on.rawContent).not.toContain('fooStyles')
    expect(on.rawContent).not.toContain('MARK')
    expect(on.rawContent).toContain('/* ---')
  })
})
