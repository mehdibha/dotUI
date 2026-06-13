import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { type ColorProducer, hasProducer, registerProducer } from './producer'
import { registerBuiltins } from './producers'
import type { BaseThemeOptions } from './schema'
import { createTheme } from './theme'

// Isolated file: vitest gives each test file its own module instance, so registering
// a fake producer here does not leak into the other suites.
describe('registry', () => {
  it('an override registered before the first createTheme wins (not clobbered by registerBuiltins)', () => {
    const fake: ColorProducer<{ seed: string }> = {
      id: 'oklch',
      schema: z.object({ seed: z.string() }),
      produce: () => ({
        scale: { '500': 'oklch(0.5 0.1 200)' },
        on: { '500': 'oklch(1 0 0)' },
      }),
    }
    registerProducer(fake)
    const theme = createTheme({
      algorithm: 'oklch',
      palettes: { primary: '#3b82f6' },
    })
    expect(theme.light!.scales.primary!['500']).toBe('oklch(0.5 0.1 200)')
  })

  it('registerBuiltins registers all builtins and is idempotent', () => {
    registerBuiltins()
    registerBuiltins()
    for (const id of ['oklch', 'contrast', 'material', 'fixed', 'tailwind'])
      expect(hasProducer(id)).toBe(true)
  })

  it('a registered NEW algorithm id works end-to-end through createTheme, knobs included', () => {
    const mono: ColorProducer<{ seed: string; lift?: number }> = {
      id: 'mono-test',
      schema: z.object({ seed: z.string(), lift: z.number().optional() }),
      produce: (opts) => ({
        scale: { '500': `oklch(${0.5 + (opts.lift ?? 0)} 0 0)` },
        on: { '500': 'oklch(1 0 0)' },
      }),
    }
    registerProducer(mono)
    const theme = createTheme({
      algorithm: 'mono-test',
      palettes: { primary: '#3b82f6' },
      lift: 0.2, // custom knob: must pass through the base schema's catchall to the producer
    } as BaseThemeOptions & { lift: number })
    expect(theme.light!.scales.primary!['500']).toBe('oklch(0.7 0 0)')
  })

  it('an UNREGISTERED id still fails loudly with the registered list', () => {
    expect(() =>
      createTheme({
        algorithm: 'not-a-thing',
        palettes: { primary: '#3b82f6' },
      }),
    ).toThrow(/Unknown color algorithm "not-a-thing"/)
  })

  it('builtin ids keep strict knob validation (not loosened by the custom path)', () => {
    expect(() =>
      createTheme({
        algorithm: 'oklch',
        palettes: { primary: '#3b82f6' },
        chromaMult: -1, // violates oklchArm's z.number().min(0)
      }),
    ).toThrow(/chromaMult/)
  })
})
