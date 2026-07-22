/**
 * Per-token remapping (T5 `overrides`, #457): the semantic resolver applies
 * config remaps, delta re-emits carry them, and migration salvages them.
 */

import { describe, expect, test } from 'vitest'

import {
  applyTokenOverrides,
  DEFAULT_COLOR_CONFIG,
  DEFAULT_SEMANTICS,
  emitCss,
  emitDarkOverridesCss,
  migrateColorConfig,
  semanticDelta,
  semanticsFor,
} from '@/registry/theme'

describe('applyTokenOverrides', () => {
  test('a mode-agnostic remap re-points the token ref', () => {
    const vocab = applyTokenOverrides(DEFAULT_SEMANTICS, {
      'color-card': { palette: 'neutral', job: 'app-bg' },
    })
    expect(vocab['color-card']!.target).toEqual({
      ref: { palette: 'neutral', step: '25' },
    })
    // Category and picker pool survive the remap.
    expect(vocab['color-card']!.category).toBe('background')
    expect(vocab['color-card']!.scales).toEqual(
      DEFAULT_SEMANTICS['color-card']!.scales,
    )
  })

  test('a per-mode remap keeps the default target on the other mode', () => {
    // The Geist case: dark collapses the subtle background onto the app bg.
    const vocab = applyTokenOverrides(DEFAULT_SEMANTICS, {
      'color-card': { dark: { palette: 'neutral', job: 'app-bg' } },
    })
    expect(vocab['color-card']!.target).toEqual({
      light: DEFAULT_SEMANTICS['color-card']!.target,
      dark: { ref: { palette: 'neutral', step: '25' } },
    })
    const darkCss = emitDarkOverridesCss({ 'color-card': vocab['color-card']! })
    expect(darkCss).toContain('--color-card: var(--neutral-25);')
  })

  test('unknown token names are inert', () => {
    const vocab = applyTokenOverrides(DEFAULT_SEMANTICS, {
      'color-does-not-exist': { palette: 'neutral', job: 'solid' },
    })
    expect(vocab).toEqual(DEFAULT_SEMANTICS)
  })

  test('remapped tokens emit the new var reference', () => {
    const css = emitCss(
      semanticsFor({
        overrides: {
          'color-border': { palette: 'accent', job: 'border-emphasized' },
        },
      }),
    )
    expect(css).toContain('--color-border: var(--accent-600);')
  })
})

describe('semanticDelta', () => {
  test('empty for the untouched default config', () => {
    expect(semanticDelta(undefined)).toEqual({})
    expect(semanticDelta(DEFAULT_COLOR_CONFIG)).toEqual({})
  })

  test('an accent primary yields the diverging primary + selection clusters', () => {
    // With no `selection` seed the selection cluster mirrors primary, so it
    // diverges alongside it when the primary source flips.
    const delta = semanticDelta({ primary: 'accent' })
    expect(Object.keys(delta).length).toBeGreaterThan(0)
    for (const name of Object.keys(delta))
      expect(
        name.startsWith('color-primary') ||
          name.startsWith('color-selection') ||
          name === 'color-fg-on-primary' ||
          name === 'color-fg-on-selection' ||
          name === 'color-fg-primary-disabled',
        name,
      ).toBe(true)
  })

  test('an override yields exactly that token', () => {
    const delta = semanticDelta({
      overrides: { 'color-card': { palette: 'neutral', job: 'app-bg' } },
    })
    expect(Object.keys(delta)).toEqual(['color-card'])
  })
})

describe('migrateColorConfig overrides salvage', () => {
  test('valid overrides survive, junk entries drop field-by-field', () => {
    const config = migrateColorConfig({
      v: 2,
      seeds: { accent: '#0070f7' },
      overrides: {
        'color-card': { palette: 'neutral', job: 'app-bg' },
        'color-popover': { dark: { palette: 'neutral', job: 'app-bg' } },
        'color-bad-job': { palette: 'neutral', job: 'nope' },
        'color-bad-shape': 'neutral-25',
        'color-empty': { light: { palette: '', job: 'solid' } },
      },
    })
    expect(config.overrides).toEqual({
      'color-card': { palette: 'neutral', job: 'app-bg' },
      'color-popover': { dark: { palette: 'neutral', job: 'app-bg' } },
    })
  })

  test('an all-junk table drops to undefined (default encoding)', () => {
    const config = migrateColorConfig({
      v: 2,
      seeds: { accent: '#0070f7' },
      overrides: { 'color-card': { job: 'app-bg' } },
    })
    expect(config.overrides).toBeUndefined()
  })
})
