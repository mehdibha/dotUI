/**
 * Tests for the parity coverage analyzer — the bucketing that turns the
 * translator's untranslated report into an actionable, sized work-list.
 */

import { describe, expect, test } from 'vitest'

import { buttonPublishable } from './__fixtures__/button-publishable'
import { analyzeParity, classifyUntranslated } from './parity'

describe('classifyUntranslated — strategy bucketing', () => {
  test('group/peer marker tokens', () => {
    expect(classifyUntranslated('group/button')).toBe('marker')
    expect(classifyUntranslated('peer')).toBe('marker')
  })

  test('genuine descendant selectors → refactor bucket', () => {
    expect(classifyUntranslated('**:[svg]:size-4')).toBe('descendant')
    expect(classifyUntranslated('*:[svg]:not-with-[size]:size-4')).toBe(
      'descendant',
    )
  })

  test('has-* → :has() descendant condition', () => {
    expect(classifyUntranslated('has-data-icon-end:pr-1.5')).toBe('has')
  })

  test('group-*/peer-*/in-* → ancestor marker plumbing', () => {
    expect(classifyUntranslated('group-hover:bg-primary')).toBe('ancestor')
    expect(classifyUntranslated('peer-focus:text-fg')).toBe('ancestor')
  })

  test('dotUI composite utilities → className passthrough', () => {
    expect(classifyUntranslated('focus-reset')).toBe('composite')
    expect(classifyUntranslated('focus-visible:focus-ring')).toBe('composite')
  })

  test('uncovered same-element utility → extend-the-table bucket', () => {
    expect(classifyUntranslated('backdrop-blur-md')).toBe('unknown')
  })
})

describe('analyzeParity — Button', () => {
  const report = analyzeParity(buttonPublishable.stylesConfig)

  test('translates the bulk of Button’s same-element vocabulary', () => {
    expect(report.translated).toBeGreaterThan(20)
  })

  test('buckets the at-a-distance remainder by resolution strategy', () => {
    expect(report.buckets.marker).toContain('group/button')
    expect(report.buckets.descendant.length).toBeGreaterThan(0)
    expect(report.buckets.has.length).toBeGreaterThan(0)
    // focus-ring / focus-reset resolve via className passthrough, not refactor.
    expect(report.buckets.composite).toEqual(
      expect.arrayContaining(['focus-reset']),
    )
  })

  test('Button needs descendant refactoring (its hardest bucket)', () => {
    expect(report.difficulty).toBe('descendant')
    expect(report.trivial).toBe(false)
  })

  test('no same-element utility is silently stranded in `unknown`', () => {
    // Everything Button uses is either translated, a known composite, or a
    // genuine at-a-distance selector — nothing should fall through as an
    // uncovered same-element utility (that would be a translator gap).
    expect(report.buckets.unknown).toEqual([])
  })
})
