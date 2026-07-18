import { describe, expect, test } from 'vitest'

import type { RegistryItem } from '@/registry/types'

import { emitInitItem } from './emit-theme'

type InitItemConfig = {
  config?: {
    tailwind?: { cssVariables?: boolean }
    registries?: Record<string, unknown>
  }
}

const baseRegistryCss = {
  css: {
    '@import "tw-animate-css"': {},
    '@utility focus-ring': {
      '@apply ring-2 ring-border-focus': {},
    },
    ':root': {
      '--neutral-50': 'hsl(0, 0%, 98%)',
    },
    '.dark': {
      '--neutral-50': 'hsl(0, 6%, 4%)',
    },
  },
  cssVars: {
    theme: {
      '--color-bg': 'var(--neutral-50)',
    },
  },
} as const satisfies Pick<RegistryItem, 'css' | 'cssVars'>

describe('emitInitItem', () => {
  test('emits base CSS through registry fields instead of a CSS file', () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: { density: 'default', componentParams: {} },
      registryRoot: 'https://dotui.com',
    })

    expect(item.type).toBe('registry:base')
    expect(item.css).toEqual(baseRegistryCss.css)
    // The semantic block ships resolved from the vocabulary (neutral primary).
    expect(item.cssVars?.theme).toMatchObject({
      '--color-bg': 'var(--neutral-25)',
      '--color-primary': 'var(--neutral-950)',
      '--color-fg-on-primary': 'var(--neutral-25)',
    })
    expect(item.dependencies).not.toContain('tailwindcss-autocontrast')
    expect((item as InitItemConfig).config?.tailwind?.cssVariables).toBe(true)
    expect((item as InitItemConfig).config?.registries?.['@dotui']).toBe(
      'https://dotui.com/r/{name}?preset=',
    )
    expect(item.files?.map((file) => file.target)).toEqual(['src/lib/utils.ts'])
    expect(JSON.stringify(item)).not.toContain('dotui-base.css')
  })

  test('normalizes legacy light and dark cssVars into css rules', () => {
    const item = emitInitItem({
      baseRegistryCss: {
        cssVars: {
          light: { 'neutral-50': 'hsl(0, 0%, 98%)' },
          dark: { 'neutral-50': 'hsl(0, 6%, 4%)' },
        },
      },
      preset: { density: 'default', componentParams: {} },
      registryRoot: 'https://dotui.com',
    })

    expect(item.css).toMatchObject({
      ':root': { '--neutral-50': 'hsl(0, 0%, 98%)' },
      '.dark': { '--neutral-50': 'hsl(0, 6%, 4%)' },
    })
    expect(item.cssVars?.theme?.['--color-bg']).toBe('var(--neutral-25)')
  })

  test('writes the preset into the @dotui registry URL string', () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: { density: 'default', componentParams: {} },
      encodedPreset: 'abc123',
      registryRoot: 'https://dotui.com',
    })

    expect((item as InitItemConfig).config?.registries?.['@dotui']).toBe(
      'https://dotui.com/r/{name}?preset=abc123',
    )
  })

  test('adds non-default density as a root css var without mutating the base fields', () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: { density: 'compact', componentParams: {} },
      registryRoot: 'https://dotui.com',
    })

    expect(item.css?.[':root']).toMatchObject({ '--dotui-density': 'compact' })
    expect(baseRegistryCss.css[':root']).not.toHaveProperty('--dotui-density')
  })

  test('emits preset tokens as :root vars, wrapping token refs in var()', () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: {
        density: 'default',
        componentParams: {},
        tokens: {
          '--radius-factor': '0.5',
          '--btn-radius': '--radius-md',
        },
      },
      registryRoot: 'https://dotui.com',
    })

    expect(item.css?.[':root']).toMatchObject({
      '--radius-factor': '0.5',
      '--btn-radius': 'var(--radius-md)',
    })
    expect(baseRegistryCss.css[':root']).not.toHaveProperty('--radius-factor')
  })

  test('a custom color recipe regenerates the :root + .dark primitive layer', () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: {
        density: 'compact',
        componentParams: {},
        color: { v: 2, seeds: { accent: '#ef4444' } },
      },
      registryRoot: 'https://dotui.com',
    })

    const root = (item.css?.[':root'] ?? {}) as Record<string, string>
    const dark = (item.css?.['.dark'] ?? {}) as Record<string, string>
    expect(root['--accent-700']).toMatch(/^oklch\(/)
    expect(root['--neutral-50']).not.toBe('hsl(0, 0%, 98%)')
    // #ef4444 is red — hue far from the default blue (~250).
    const hue = Number(
      root['--accent-700']?.match(/oklch\([\d.]+ [\d.]+ ([\d.]+)\)/)?.[1],
    )
    expect(hue).toBeGreaterThan(0)
    expect(hue).toBeLessThan(60)
    // Alpha twins, solved on-* labels, and charts ship alongside the ramps.
    expect(root['--accent-a700']).toBeDefined()
    expect(root['--on-accent-700']).toBeDefined()
    expect(root['--chart-1']).toBeDefined()
    expect(dark['--accent-25']).toMatch(/^oklch\(/)
    expect(dark['--neutral-950']).toMatch(/^oklch\(/)
    expect(dark['--chart-1']).toBeDefined()
    // Per-mode palettes: at least one slot differs (slot 1 may legitimately
    // match when the accent's lightness snaps to the same rung in both).
    const chartSlots = Array.from({ length: 8 }, (_, i) => `--chart-${i + 1}`)
    expect(chartSlots.some((slot) => dark[slot] !== root[slot])).toBe(true)
  })

  test('an accent-sourced primary re-points the primary cluster in the theme vars', () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: {
        density: 'default',
        componentParams: {},
        color: { v: 2, seeds: { accent: '#3ecf8e' }, primary: 'accent' },
      },
      registryRoot: 'https://dotui.com',
    })

    expect(item.cssVars?.theme).toMatchObject({
      '--color-bg': 'var(--neutral-25)',
      '--color-primary': 'var(--accent-700)',
      '--color-primary-hover': 'var(--accent-800)',
      '--color-primary-active':
        'color-mix(in oklab, var(--accent-800) 88%, var(--neutral-950))',
      '--color-primary-muted': 'var(--accent-100)',
      '--color-fg-on-primary': 'var(--on-accent-700)',
    })
    // The base fixture stays untouched.
    expect(baseRegistryCss.cssVars.theme['--color-bg']).toBe(
      'var(--neutral-50)',
    )
  })
})
