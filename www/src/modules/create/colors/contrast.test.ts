import { describe, expect, it } from 'vitest'

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'

describe('default theme guarantees', () => {
  const { report } = resolveColorConfig(DEFAULT_COLOR_CONFIG)

  it('audits every palette in both modes', () => {
    const scales = new Set(report.guarantees.map((g) => g.scale))
    expect([...scales].sort()).toEqual([
      'accent',
      'danger',
      'info',
      'neutral',
      'success',
      'warning',
    ])
    for (const mode of ['light', 'dark'] as const) {
      expect(report.guarantees.some((g) => g.mode === mode)).toBe(true)
    }
  })

  it('passes every guarantee pairing', () => {
    expect(report.guarantees.every((g) => g.passes)).toBe(true)
    expect(report.ok).toBe(true)
  })
})
