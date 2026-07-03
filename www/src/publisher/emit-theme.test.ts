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
    expect(item.cssVars).toEqual(baseRegistryCss.cssVars)
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
    expect(item.cssVars).toBeUndefined()
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

  test('a custom color recipe regenerates the :root + .dark palette ramps', () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: {
        density: 'compact',
        componentParams: {},
        color: {
          algorithm: 'oklch',
          seeds: {
            neutral: '#808080',
            accent: '#ef4444',
            success: '#22c55e',
            warning: '#eab308',
            danger: '#ef4444',
          },
        },
      },
      registryRoot: 'https://dotui.com',
    })

    const root = (item.css?.[':root'] ?? {}) as Record<string, string>
    const dark = (item.css?.['.dark'] ?? {}) as Record<string, string>
    expect(root['--accent-500']).toMatch(/^oklch\(/)
    expect(root['--neutral-50']).not.toBe('hsl(0, 0%, 98%)')
    // #ef4444 is red — hue far from the default blue (~250).
    const hue = Number(
      root['--accent-500']?.match(/oklch\([\d.]+ [\d.]+ ([\d.]+)\)/)?.[1],
    )
    expect(hue).toBeGreaterThan(0)
    expect(hue).toBeLessThan(60)
    expect(dark['--accent-50']).toMatch(/^oklch\(/)
    expect(dark['--neutral-950']).toMatch(/^oklch\(/)
  })
})
