/**
 * Tests for the descendant → scoped companion CSS emitter — the escape hatch
 * that renders StyleX-inexpressible at-a-distance styling.
 */

import { describe, expect, test } from 'vitest'

import { emitDescendantCss } from './descendant-css'

describe('emitDescendantCss', () => {
  test('descendant element rule (`**:[svg]`)', () => {
    const { css, handled } = emitDescendantCss('sx', ['**:[svg]:shrink-0'])
    expect(css).toBe('.sx svg { flex-shrink: 0; }')
    expect(handled).toEqual(['**:[svg]:shrink-0'])
  })

  test('child element rule (`*:[svg]`) with a real value', () => {
    const { css } = emitDescendantCss('sx', ['*:[svg]:size-4'])
    expect(css).toBe(
      '.sx > svg { width: calc(var(--spacing) * 4); height: calc(var(--spacing) * 4); }',
    )
  })

  test('`has-*` becomes `:has()` on the scope element', () => {
    const { css } = emitDescendantCss('sx', ['has-data-icon-end:pr-1.5'])
    expect(css).toBe(
      '.sx:has([data-icon-end]) { padding-right: calc(var(--spacing) * 1.5); }',
    )
  })

  test('a scope state prefix before the marker qualifies the scope', () => {
    const { css } = emitDescendantCss('sx', [
      'pending:**:data-[slot=spinner]:text-fg-muted',
    ])
    expect(css).toBe(
      '.sx[data-pending] [data-slot="spinner"] { color: var(--color-fg-muted); }',
    )
  })

  test('`[&_x]` / `[&>x]` explicit selectors', () => {
    expect(emitDescendantCss('sx', ['[&_svg]:opacity-0']).css).toBe(
      '.sx svg { opacity: 0; }',
    )
    expect(emitDescendantCss('sx', ['[&>svg]:shrink-0']).css).toBe(
      '.sx > svg { flex-shrink: 0; }',
    )
  })

  test('the whole Button descendant set is handled', () => {
    const tokens = [
      '**:[svg]:pointer-events-none',
      '**:[svg]:shrink-0',
      '**:[svg]:not-with-[size]:size-4',
      'has-data-icon-end:pr-1.5',
      'has-data-icon-start:pl-1.5',
      'pending:**:data-[slot=spinner]:text-fg-muted',
    ]
    const { handled, unhandled, css } = emitDescendantCss('sx', tokens)
    expect(unhandled).toEqual([])
    expect(handled).toHaveLength(tokens.length)
    // the icon-sizing rule drops the `not-with-[size]` optimization filter.
    expect(css).toContain(
      '.sx svg { width: calc(var(--spacing) * 4); height: calc(var(--spacing) * 4); }',
    )
    expect(css).toContain('.sx:has([data-icon-start])')
  })

  test('group-*/peer-*/in-* become prepended ancestor selectors', () => {
    expect(
      emitDescendantCss('sx', ['group-data-[loading]:opacity-0']).css,
    ).toBe('.group[data-loading] .sx { opacity: 0; }')
    // named group + a descendant part
    expect(
      emitDescendantCss('sx', ['group-data-[size=lg]/avatar:[&>svg]:size-2'])
        .css,
    ).toBe(
      '.group\\/avatar[data-size="lg"] .sx > svg { width: calc(var(--spacing) * 2); height: calc(var(--spacing) * 2); }',
    )
    expect(emitDescendantCss('sx', ['peer-focus:text-fg']).css).toBe(
      '.peer[data-focused] ~ .sx { color: var(--color-fg); }',
    )
    expect(emitDescendantCss('sx', ['in-data-calendar:rounded-sm']).css).toBe(
      '[data-calendar] .sx { border-radius: var(--radius-sm); }',
    )
  })

  test('custom-plugin (`with-*`) prefixes stay unhandled', () => {
    const { css, unhandled } = emitDescendantCss('sx', [
      'with-[left]:right-auto',
    ])
    expect(css).toBe('')
    expect(unhandled).toEqual(['with-[left]:right-auto'])
  })
})
