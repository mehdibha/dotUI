import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { type ColorProducer, hasProducer, registerProducer } from './producer'
import { registerBuiltins } from './producers'
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
})
