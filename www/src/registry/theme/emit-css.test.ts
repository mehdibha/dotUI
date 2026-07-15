import { describe, expect, it } from 'vitest'

import { baseRegistryCss } from '@/registry/__generated__/base-css'
import { cssToRegistryFields } from '@/publisher/build-time/css-to-registry-fields'

import { emitCss, resolveTarget } from './emit-css'
import {
  ACCENT_PRIMARY_SEMANTICS,
  DEFAULT_SEMANTICS,
  semanticsWithPrimary,
} from './semantics'
import type { SemanticVocabulary } from './types'

/** The `--color-*` subset of a cssVars.theme map (the part DEFAULT_SEMANTICS owns). */
function colorVars(vars: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(vars).filter(([key]) => key.startsWith('--color-')),
  )
}

describe('DEFAULT_SEMANTICS ↔ base/theme.css parity', () => {
  it("emitCss reproduces today's --color-* vocabulary exactly", () => {
    const emitted = cssToRegistryFields(emitCss(DEFAULT_SEMANTICS))
    const got = colorVars(emitted.cssVars?.theme ?? {})
    const want = colorVars(
      baseRegistryCss.cssVars.theme as Record<string, string>,
    )

    expect(got).toEqual(want)
  })

  it('covers every --color-* token the snapshot defines (no missing, no extra)', () => {
    const emitted = cssToRegistryFields(emitCss(DEFAULT_SEMANTICS))
    const gotKeys = Object.keys(colorVars(emitted.cssVars?.theme ?? {})).sort()
    const wantKeys = Object.keys(
      colorVars(baseRegistryCss.cssVars.theme as Record<string, string>),
    ).sort()

    expect(gotKeys).toEqual(wantKeys)
  })
})

describe('semanticsWithPrimary', () => {
  it('returns the baseline vocabulary for neutral / undefined', () => {
    expect(semanticsWithPrimary(undefined)).toBe(DEFAULT_SEMANTICS)
    expect(semanticsWithPrimary('neutral')).toBe(DEFAULT_SEMANTICS)
  })

  it('remaps exactly the primary cluster onto the accent ramp', () => {
    const vocab = semanticsWithPrimary('accent')
    const emitted = cssToRegistryFields(emitCss(vocab)).cssVars?.theme ?? {}
    expect(emitted['--color-primary']).toBe('var(--accent-500)')
    expect(emitted['--color-primary-hover']).toBe('var(--accent-600)')
    expect(emitted['--color-primary-active']).toBe('var(--accent-700)')
    expect(emitted['--color-primary-muted']).toBe('var(--accent-100)')
    expect(emitted['--color-fg-on-primary']).toBe('var(--on-accent-500)')
    // Everything outside the cluster is untouched, and no tokens are added or lost.
    const base =
      cssToRegistryFields(emitCss(DEFAULT_SEMANTICS)).cssVars?.theme ?? {}
    expect(Object.keys(emitted)).toEqual(Object.keys(base))
    for (const key of Object.keys(base)) {
      if (key.replace(/^--/, '') in ACCENT_PRIMARY_SEMANTICS) continue
      expect(emitted[key]).toBe(base[key])
    }
  })
})

describe('resolveTarget', () => {
  it('resolves a ref to a var()', () => {
    expect(resolveTarget({ ref: 'neutral-50' })).toBe('var(--neutral-50)')
  })

  it('resolves an onOf to its on-* var()', () => {
    expect(resolveTarget({ onOf: 'accent-500' })).toBe('var(--on-accent-500)')
  })

  it('passes a literal value through unchanged', () => {
    expect(resolveTarget({ value: 'oklch(1 0 0)' })).toBe('oklch(1 0 0)')
  })

  it('renders a mix as color-mix()', () => {
    expect(
      resolveTarget({
        mix: {
          space: 'oklab',
          stops: [{ ref: 'neutral-950' }, 15, { value: 'transparent' }],
        },
      }),
    ).toBe('color-mix(in oklab, var(--neutral-950) 15%, transparent)')
  })

  it('renders nested mixes recursively', () => {
    expect(
      resolveTarget({
        mix: {
          space: 'oklch',
          stops: [{ onOf: 'accent-500' }, 50, { ref: 'neutral-50' }],
        },
      }),
    ).toBe('color-mix(in oklch, var(--on-accent-500) 50%, var(--neutral-50))')
  })
})

describe('emitCss per-mode targets', () => {
  it('emits the light value for a per-mode target', () => {
    const vocab: SemanticVocabulary = {
      'color-bg': {
        target: { light: { ref: 'neutral-50' }, dark: { ref: 'neutral-950' } },
        category: 'background',
      },
    }
    const fields = cssToRegistryFields(emitCss(vocab))
    expect(fields.cssVars?.theme?.['--color-bg']).toBe('var(--neutral-50)')
  })

  it('falls back to the first mode when no light target is present', () => {
    const vocab: SemanticVocabulary = {
      'color-bg': {
        target: { dark: { ref: 'neutral-900' } },
        category: 'background',
      },
    }
    const fields = cssToRegistryFields(emitCss(vocab))
    expect(fields.cssVars?.theme?.['--color-bg']).toBe('var(--neutral-900)')
  })
})
