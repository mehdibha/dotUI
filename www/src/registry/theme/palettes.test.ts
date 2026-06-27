import { describe, expect, it } from 'vitest'

import {
  fromKernelPaletteName,
  PALETTE_ORDER,
  STATUS_PALETTES,
  toKernelPaletteName,
} from './palettes'

describe('palette identity (SSOT)', () => {
  it('orders the six palettes with the neutral backbone + accent first', () => {
    expect(PALETTE_ORDER).toEqual([
      'neutral',
      'accent',
      'success',
      'warning',
      'danger',
      'info',
    ])
  })

  it('lists the four status palettes (PALETTE_ORDER minus neutral + accent)', () => {
    expect([...STATUS_PALETTES]).toEqual(
      PALETTE_ORDER.filter((p) => p !== 'neutral' && p !== 'accent'),
    )
  })

  it("maps dotUI's `accent` to the kernel's `primary` and back", () => {
    expect(toKernelPaletteName('accent')).toBe('primary')
    expect(fromKernelPaletteName('primary')).toBe('accent')
  })

  it('passes through every non-accent palette name unchanged', () => {
    for (const name of ['neutral', 'success', 'warning', 'danger', 'info']) {
      expect(toKernelPaletteName(name)).toBe(name)
      expect(fromKernelPaletteName(name)).toBe(name)
    }
  })
})
