import { describe, expect, it } from 'vitest'

import { colorTokenNames } from './params'

describe('colorTokenNames', () => {
  it('returns the background pool the component color picker renders', () => {
    const bg = colorTokenNames('background')

    expect(bg.every((name) => name.startsWith('color-'))).toBe(true)
    // Options the picker already offered (via the retired COLOR_TOKENS).
    expect(bg).toEqual(
      expect.arrayContaining([
        'color-bg',
        'color-card',
        'color-popover',
        'color-muted',
        'color-primary',
        'color-accent',
      ]),
    )
    // Newly surfaced background options (the picker gains 10) — in theme.css but absent from the retired tokens.ts.
    expect(bg).toEqual(
      expect.arrayContaining([
        'color-field',
        'color-tooltip',
        'color-sidebar',
        'color-highlight',
        'color-selected',
      ]),
    )
  })

  it('does not leak foreground or border tokens into the background pool', () => {
    const bg = colorTokenNames('background')

    expect(bg).not.toContain('color-fg')
    expect(bg).not.toContain('color-border')
    expect(bg).not.toContain('color-fg-on-accent')
  })

  it('partitions tokens into disjoint category pools', () => {
    const bg = new Set(colorTokenNames('background'))
    const fg = colorTokenNames('foreground')
    const bd = colorTokenNames('border')

    expect(fg.some((name) => bg.has(name))).toBe(false)
    expect(bd.some((name) => bg.has(name))).toBe(false)
  })
})
