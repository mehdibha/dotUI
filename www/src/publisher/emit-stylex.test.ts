/**
 * StyleX emitter tests. Proves the dual backend end-to-end: the SAME button
 * publishable + IR, published with `styleEngine: 'stylex'`, yields a valid
 * StyleX component — drop-in `buttonVariants` resolver, untouched JSX body — and
 * surfaces the descendant classes StyleX can't express as PARITY-TODO.
 */

import { describe, expect, test } from 'vitest'

import { buttonPublishable } from './__fixtures__/button-publishable'
import { DEFAULT_CODE_OPTIONS } from './code-options'
import { emitStylexComponent } from './emit-stylex'
import { publish, TV_CONFIG_PLACEHOLDER } from './publish'

const STYLEX_PRESET = {
  density: 'default' as const,
  componentParams: {},
  codeOptions: { ...DEFAULT_CODE_OPTIONS, styleEngine: 'stylex' as const },
}

describe('publish + styleEngine: stylex', () => {
  const { rawContent } = publish({
    publishable: buttonPublishable,
    preset: STYLEX_PRESET,
  })

  test('swaps tailwind-variants for StyleX', () => {
    expect(rawContent).toContain('import * as stylex from "@stylexjs/stylex";')
    expect(rawContent).not.toContain('tailwind-variants')
    expect(rawContent).not.toMatch(/\btv\(/)
    expect(rawContent).not.toContain(TV_CONFIG_PLACEHOLDER)
  })

  test('emits stylex.create namespaces from the IR', () => {
    expect(rawContent).toContain('const styles = stylex.create(')
    expect(rawContent).toContain('const variantStyles = stylex.create(')
    expect(rawContent).toContain('const sizeStyles = stylex.create(')
  })

  test('themes via the same CSS vars as the Tailwind backend', () => {
    // primary variant background flips on hover, both via --color-* vars.
    expect(rawContent).toContain('"var(--color-primary)"')
    expect(rawContent).toContain('"var(--color-primary-hover)"')
    expect(rawContent).toContain('backgroundColor')
  })

  test('resolver keeps the tv() call signature so the JSX body is untouched', () => {
    expect(rawContent).toContain('function buttonVariants(')
    expect(rawContent).toContain('stylex.props(')
    // the original render-prop composition still calls buttonVariants({...})
    expect(rawContent).toContain(
      'buttonVariants({ variant, size, isIconOnly, className: cn })',
    )
    expect(rawContent).toContain('composeRenderProps')
    expect(rawContent).toContain('data-slot="spinner"')
  })

  test('replaces VariantProps with an explicit variant-props type', () => {
    expect(rawContent).not.toContain('VariantProps')
    expect(rawContent).toContain('type ButtonVariants = {')
    expect(rawContent).toContain(
      'variant?: "default" | "primary" | "quiet" | "link" | "warning" | "danger";',
    )
    expect(rawContent).toContain('size?: "xs" | "sm" | "md" | "lg";')
    expect(rawContent).toContain('isIconOnly?: boolean;')
  })

  test('keys interactive states off RAC data attributes, not native pseudo', () => {
    // dotUI styles RAC roots → the Tailwind backend uses [data-hovered]/[data-disabled];
    // the StyleX export must match, or it diverges on touch and on non-form roots.
    expect(rawContent).toContain('[data-hovered]')
    expect(rawContent).toContain('[data-pressed]')
    expect(rawContent).toContain('[data-disabled]')
    expect(rawContent).not.toMatch(/"\s*:hover\s*"|"\s*:disabled\s*"/)
  })

  test('passes dotUI composite utilities through as literal classNames', () => {
    // focus-ring / focus-reset have no same-element StyleX form but ship in base.css,
    // so they're kept as classes (the focus ring survives) — not dropped to PARITY-TODO.
    expect(rawContent).toContain('focus-reset focus-visible:focus-ring')
    expect(rawContent).toMatch(
      /return \[sx, "[^"]*focus-reset[^"]*", className\]/,
    )
  })

  test('surfaces only genuine descendant classes as a PARITY-TODO work-list', () => {
    expect(rawContent).toContain('PARITY-TODO')
    expect(rawContent).toContain('**:[svg]:pointer-events-none')
    expect(rawContent).toMatch(/has-data-icon-(end|start)/)
    // composites are handled (passthrough), so they are NOT on the TODO list.
    const todoBlock = rawContent.slice(0, rawContent.indexOf('"use client"'))
    expect(todoBlock).not.toContain('focus-reset')
  })

  test('declares @stylexjs/stylex as a dependency to install', () => {
    const { item } = publish({
      publishable: buttonPublishable,
      preset: STYLEX_PRESET,
    })
    expect((item as { dependencies?: string[] }).dependencies).toContain(
      '@stylexjs/stylex',
    )
  })
})

describe('emitStylexComponent — scope gating', () => {
  test('slotted IR is not handled (caller keeps Tailwind)', () => {
    const res = emitStylexComponent({
      template: `const xVariants = tv(${TV_CONFIG_PLACEHOLDER});`,
      flat: { slots: { root: 'flex', label: 'text-sm' } },
      meta: { name: 'x', type: 'registry:ui' },
      placeholder: TV_CONFIG_PLACEHOLDER,
    })
    expect(res.handled).toBe(false)
  })

  test('compound variants are not handled yet', () => {
    const res = emitStylexComponent({
      template: `const xVariants = tv(${TV_CONFIG_PLACEHOLDER});`,
      flat: {
        base: 'flex',
        compoundVariants: [{ variant: 'primary', size: 'lg', class: 'gap-2' }],
      },
      meta: { name: 'x', type: 'registry:ui' },
      placeholder: TV_CONFIG_PLACEHOLDER,
    })
    expect(res.handled).toBe(false)
  })
})

describe('publish + styleEngine: tailwind (unchanged default)', () => {
  test('default still emits a tv() config', () => {
    const { rawContent } = publish({
      publishable: buttonPublishable,
      preset: { density: 'default', componentParams: {} },
    })
    expect(rawContent).toMatch(/\btv\(/)
    expect(rawContent).not.toContain('@stylexjs/stylex')
  })
})
