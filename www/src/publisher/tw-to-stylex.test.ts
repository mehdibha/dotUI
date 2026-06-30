/**
 * Tests for the Tailwind → StyleX translation core. Pins the property mapping
 * and the same-element/descendant split that the parity system depends on.
 */

import { describe, expect, test } from 'vitest'

import { translateClasses, translateUtility } from './tw-to-stylex'

describe('translateUtility — static utilities', () => {
  test('layout keywords', () => {
    expect(translateUtility('relative')).toEqual({ position: 'relative' })
    expect(translateUtility('inline-flex')).toEqual({ display: 'inline-flex' })
    expect(translateUtility('shrink-0')).toEqual({ flexShrink: 0 })
    expect(translateUtility('items-center')).toEqual({ alignItems: 'center' })
    expect(translateUtility('select-none')).toEqual({ userSelect: 'none' })
  })

  test('border keyword expands style+width (no preflight in StyleX)', () => {
    expect(translateUtility('border')).toEqual({
      borderStyle: 'solid',
      borderWidth: '1px',
    })
    expect(translateUtility('border-0')).toEqual({ borderWidth: '0' })
  })

  test('spacing maps to the density-aware --spacing calc', () => {
    expect(translateUtility('px-2')).toEqual({
      paddingInline: 'calc(var(--spacing) * 2)',
    })
    // `p`/`m` emit logical longhands so a later `px-*` overrides per-property.
    expect(translateUtility('p-0')).toEqual({
      paddingInline: '0',
      paddingBlock: '0',
    })
    expect(translateUtility('-mx-2')).toEqual({
      marginInline: 'calc(calc(var(--spacing) * 2) * -1)',
    })
    expect(translateUtility('gap-1.5')).toEqual({
      gap: 'calc(var(--spacing) * 1.5)',
    })
    expect(translateUtility('h-7')).toEqual({
      height: 'calc(var(--spacing) * 7)',
    })
    expect(translateUtility('size-7')).toEqual({
      width: 'calc(var(--spacing) * 7)',
      height: 'calc(var(--spacing) * 7)',
    })
  })

  test('radius: scale, full, none, and arbitrary var', () => {
    expect(translateUtility('rounded-sm')).toEqual({
      borderRadius: 'var(--radius-sm)',
    })
    // `rounded-full` has no `--radius-full` var in Tailwind or dotUI; Tailwind
    // emits the literal, so parity needs the literal (not an undefined var → 0).
    expect(translateUtility('rounded-full')).toEqual({
      borderRadius: 'calc(infinity * 1px)',
    })
    expect(translateUtility('rounded-(--btn-radius)')).toEqual({
      borderRadius: 'var(--btn-radius)',
    })
  })

  test('line-height: leading keyword, none→1, numeric, modifier form', () => {
    expect(translateUtility('leading-snug')).toEqual({
      lineHeight: 'var(--leading-snug)',
    })
    expect(translateUtility('leading-none')).toEqual({ lineHeight: '1' })
    expect(translateUtility('leading-6')).toEqual({
      lineHeight: 'calc(var(--spacing) * 6)',
    })
    // `text-<size>/<leading>` sets both font-size and the explicit line-height.
    expect(translateUtility('text-xs/relaxed')).toEqual({
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--leading-relaxed)',
    })
  })

  test('arbitrary CSS property maps 1:1 (camelCased)', () => {
    expect(translateUtility('[transform:translateY(2px)]')).toEqual({
      transform: 'translateY(2px)',
    })
    expect(translateUtility('[margin-bottom:calc(0px_-_2px)]')).toEqual({
      marginBottom: 'calc(0px - 2px)',
    })
  })

  test('font weight keyword + arbitrary var', () => {
    expect(translateUtility('font-medium')).toEqual({ fontWeight: 500 })
    expect(translateUtility('font-(--btn-font-weight)')).toEqual({
      fontWeight: 'var(--btn-font-weight)',
    })
  })

  test('text size sets font-size + line-height; arbitrary numeric → size', () => {
    expect(translateUtility('text-xs')).toEqual({
      fontSize: 'var(--text-xs)',
      lineHeight: 'var(--text-xs--line-height)',
    })
    expect(translateUtility('text-[0.625rem]')).toEqual({
      fontSize: '0.625rem',
    })
  })

  test('cursor: dotUI var vs raw keyword', () => {
    expect(translateUtility('cursor-interactive')).toEqual({
      cursor: 'var(--cursor-interactive)',
    })
    expect(translateUtility('cursor-default')).toEqual({ cursor: 'default' })
  })

  test('arbitrary custom property', () => {
    expect(translateUtility('[--color-disabled:var(--neutral-500)]')).toEqual({
      '--color-disabled': 'var(--neutral-500)',
    })
  })

  test('unknown utility → null', () => {
    expect(translateUtility('focus-ring')).toBeNull()
    expect(translateUtility('totally-made-up')).toBeNull()
  })
})

describe('translateClasses — dotUI semantic colors', () => {
  test('semantic color tokens become var(--color-*)', () => {
    const { style, untranslated } = translateClasses(
      'bg-primary text-fg-on-primary',
    )
    expect(style).toEqual({
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-fg-on-primary)',
    })
    expect(untranslated).toEqual([])
  })

  test('transparent / current resolve to literals', () => {
    expect(translateClasses('bg-transparent').style).toEqual({
      backgroundColor: 'transparent',
    })
  })

  test('opacity modifier compiles to color-mix', () => {
    expect(translateClasses('hover:bg-inverse/10').style).toEqual({
      backgroundColor: {
        '[data-hovered]':
          'color-mix(in oklab, var(--color-inverse) 10%, transparent)',
      },
    })
  })
})

describe('translateClasses — state conditions (React-Aria data attributes)', () => {
  // dotUI styles RAC roots, so the RAC Tailwind plugin compiles hover:/disabled:/
  // focus-visible: to RAC data-* selectors — the StyleX export must match those,
  // not native pseudo-classes, or it diverges on touch + on non-form RAC roots.
  test('base + hover merge into one condition map with default', () => {
    expect(translateClasses('bg-primary hover:bg-primary-hover').style).toEqual(
      {
        backgroundColor: {
          default: 'var(--color-primary)',
          '[data-hovered]': 'var(--color-primary-hover)',
        },
      },
    )
  })

  test('react-aria pressed/pending → data-attribute conditions', () => {
    expect(translateClasses('pressed:bg-neutral-active').style).toEqual({
      backgroundColor: { '[data-pressed]': 'var(--color-neutral-active)' },
    })
    expect(translateClasses('pending:text-transparent').style).toEqual({
      color: { '[data-pending]': 'transparent' },
    })
  })

  test('disabled maps to [data-disabled] (matches non-form RAC roots too)', () => {
    expect(
      translateClasses('disabled:bg-disabled disabled:text-fg-disabled').style,
    ).toEqual({
      backgroundColor: { '[data-disabled]': 'var(--color-disabled)' },
      color: { '[data-disabled]': 'var(--color-fg-disabled)' },
    })
  })

  test('focus-visible maps to [data-focus-visible]', () => {
    expect(translateClasses('focus-visible:border-border-focus').style).toEqual(
      {
        borderColor: { '[data-focus-visible]': 'var(--color-border-focus)' },
      },
    )
  })

  test('same-element data-[…] attribute variant', () => {
    expect(translateClasses('data-icon-only:size-7').style).toEqual({
      width: { '[data-icon-only]': 'calc(var(--spacing) * 7)' },
      height: { '[data-icon-only]': 'calc(var(--spacing) * 7)' },
    })
  })
})

describe('translateClasses — the descendant wall', () => {
  test('descendant / group / has tokens are reported, not silently dropped', () => {
    const { untranslated, markers, style } = translateClasses(
      'group/button **:[svg]:size-4 has-data-icon-end:pr-1.5 bg-primary',
    )
    expect(markers).toEqual(['group/button'])
    expect(untranslated).toContain('**:[svg]:size-4')
    expect(untranslated).toContain('has-data-icon-end:pr-1.5')
    // the translatable token still lands
    expect(style.backgroundColor).toBe('var(--color-primary)')
  })

  test('stacked multi-state prefixes are deferred to the parity step', () => {
    const { untranslated } = translateClasses('hover:focus:bg-primary')
    expect(untranslated).toContain('hover:focus:bg-primary')
  })
})
