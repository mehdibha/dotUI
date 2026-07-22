/**
 * Tests for the build-time AST passes (`extract-config.ts`, `transform-base.ts`)
 * against the actual `styles.ts` / `base.tsx` files in the registry.
 *
 * If these pass, the build-time emission step in `build-publishables.ts`
 * should produce drop-in equivalents to the hand-written fixtures used by
 * `publish.test.ts`.
 */

import path from 'node:path'
import { describe, expect, test } from 'vitest'

import { publish, TV_CONFIG_PLACEHOLDER } from '../publish'
import { extractStylesConfig } from './extract-config'
import { transformBase } from './transform-base'

const REGISTRY_UI = path.resolve(__dirname, '../../registry/ui')

/* ============================================================ */
/* extract-config                                                */
/* ============================================================ */

describe('extractStylesConfig', () => {
  test('button: extracts base and density layers', () => {
    const cfg = extractStylesConfig(path.join(REGISTRY_UI, 'button/styles.ts'))

    // `base.base` is the long class array.
    expect(Array.isArray(cfg.base.base)).toBe(true)
    expect((cfg.base.base as string[])[0]).toMatch(/group\/button/)

    // `base.variants.variant.primary` is a string.
    expect(typeof cfg.base.variants?.variant?.primary).toBe('string')
    expect(cfg.base.variants?.variant?.primary).toContain('bg-primary')

    // All three density entries exist.
    expect(cfg.density?.compact).toBeDefined()
    expect(cfg.density?.default).toBeDefined()
    expect(cfg.density?.comfortable).toBeDefined()
  })

  test('alert: extracts slots, params, scalar var references in classes', () => {
    const cfg = extractStylesConfig(path.join(REGISTRY_UI, 'alert/styles.ts'))

    // Slots present on base.
    expect(cfg.base.slots).toBeDefined()
    const root = cfg.base.slots?.root
    const rootStrs = Array.isArray(root) ? root : [root]
    expect(
      rootStrs.some(
        (s) => typeof s === 'string' && s.includes('rounded-(--alert-radius)'),
      ),
    ).toBe(true)

    // Both enum values for `style` extracted.
    expect(cfg.params?.style?.default).toBeDefined()
    expect(cfg.params?.style?.sousse).toBeDefined()
  })

  test('skeleton: extracts the animation enum (shimmer, pulse, none)', () => {
    const cfg = extractStylesConfig(
      path.join(REGISTRY_UI, 'skeleton/styles.ts'),
    )
    expect(cfg.params?.animation).toBeDefined()
    const animation = cfg.params?.animation
    expect(Object.keys(animation ?? {}).sort()).toEqual([
      'none',
      'pulse',
      'shimmer',
    ])
  })

  test('input: resolves module-level const string refs (compactText)', () => {
    const cfg = extractStylesConfig(path.join(REGISTRY_UI, 'input/styles.ts'))
    // `inputGroup: compactText` — the identifier resolves to its const literal.
    expect(cfg.density?.compact?.slots?.inputGroup).toBe(
      'text-base sm:text-xs/relaxed',
    )
  })

  test('input: resolves local tv() factory calls (tokens, outlineField)', () => {
    const cfg = extractStylesConfig(path.join(REGISTRY_UI, 'input/styles.ts'))
    // `tokens({ h: 6 })` in density.compact size.sm → the h=6 token string.
    const sm = cfg.density?.compact?.variants?.size?.sm as Record<
      string,
      string
    >
    expect(sm.input).toContain('[--input-h:--spacing(6)]')
    // `outlineField({ focus: 'self' })` in params.style.outline.
    const outline = cfg.params?.style?.outline?.slots?.input as string
    expect(outline).toContain('focus:ring-2')
    expect(outline).toContain('border-border-field')
  })

  test('otp-field: composes field styles via fieldStyles().field(...)', () => {
    const cfg = extractStylesConfig(
      path.join(REGISTRY_UI, 'otp-field/styles.ts'),
    )
    const root = cfg.base.slots?.root as string[]
    expect(Array.isArray(root)).toBe(true)
    // The composed field slot classes + the passed className, all merged by tv.
    expect(root[0]).toContain('group/otp-field')
    expect(root[0]).toContain('w-full flex-col gap-2')
  })

  test('slider: composes field styles via fieldStyles().field()', () => {
    const cfg = extractStylesConfig(path.join(REGISTRY_UI, 'slider/styles.ts'))
    // Same default-composed field slot the app renders (no className arg).
    expect(cfg.base.slots?.root).toBe(
      'flex invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden w-full flex-col gap-2',
    )
  })
})

/* ============================================================ */
/* transform-base                                                */
/* ============================================================ */

describe('transformBase', () => {
  test('button: strips ./styles import, inserts tv-variants decl, leaves placeholder', () => {
    const { template, variantIdent } = transformBase({
      baseTsxPath: path.join(REGISTRY_UI, 'button/base.tsx'),
      componentName: 'button',
    })

    expect(variantIdent).toBe('buttonVariants')
    expect(template).not.toMatch(/from\s+["']\.\/styles["']/)
    expect(template).toContain(
      `const buttonVariants = tv(${TV_CONFIG_PLACEHOLDER});`,
    )
    // `useStyles()` is gone, replaced with `buttonVariants`.
    expect(template).not.toContain('useStyles')
    expect(template).toContain('const styles = buttonVariants')
    // VariantProps reference is rewritten.
    expect(template).not.toContain('VariantProps<ButtonStyles>')
    expect(template).toContain('VariantProps<typeof buttonVariants>')
    // Loader import path rewritten.
    expect(template).toContain('@/components/ui/loader')
    expect(template).not.toContain('@/registry/ui/loader')
  })

  test('alert: handles `useStyles()()` double-call shape (slotted variant)', () => {
    const { template, variantIdent } = transformBase({
      baseTsxPath: path.join(REGISTRY_UI, 'alert/base.tsx'),
      componentName: 'alert',
    })

    expect(variantIdent).toBe('alertVariants')
    expect(template).not.toContain('useStyles')
    // `const { root } = useStyles()()` → `const { root } = alertVariants()`.
    expect(template).toMatch(/const\s*\{\s*root\s*\}\s*=\s*alertVariants\(\)/)
    expect(template).toContain(
      `const alertVariants = tv(${TV_CONFIG_PLACEHOLDER});`,
    )
  })

  test('loader spinner variant: transform works on variant base files', () => {
    const { template } = transformBase({
      baseTsxPath: path.join(REGISTRY_UI, 'loader/base.spinner.tsx'),
      componentName: 'loader',
    })
    expect(template).toContain('const loaderVariants = tv(')
    expect(template).not.toContain('useStyles')
  })
})

/* ============================================================ */
/* end-to-end: extract + transform → publish                     */
/* ============================================================ */

describe('end-to-end (extract + transform → publish)', () => {
  test('button: published content includes expected class for `default` density default variant', () => {
    const stylesConfig = extractStylesConfig(
      path.join(REGISTRY_UI, 'button/styles.ts'),
    )
    const { template } = transformBase({
      baseTsxPath: path.join(REGISTRY_UI, 'button/base.tsx'),
      componentName: 'button',
    })

    const { rawContent } = publish({
      publishable: {
        template,
        stylesConfig,
        meta: {
          name: 'button',
          type: 'registry:ui',
          files: [
            {
              type: 'registry:ui',
              path: 'ui/button/base.tsx',
              target: 'ui/button.tsx',
            },
          ],
          registryDependencies: ['loader', 'focus-styles'],
        },
      },
      preset: { density: 'default', componentParams: {} },
    })

    expect(rawContent).toContain('bg-primary') // primary variant
    expect(rawContent).toContain('h-8') // default density size md
    expect(rawContent).not.toContain(TV_CONFIG_PLACEHOLDER)
  })

  test('alert: scalar `radius` is resolved (publisher reads meta.params for the cssVar map)', () => {
    const stylesConfig = extractStylesConfig(
      path.join(REGISTRY_UI, 'alert/styles.ts'),
    )
    const { template } = transformBase({
      baseTsxPath: path.join(REGISTRY_UI, 'alert/base.tsx'),
      componentName: 'alert',
    })

    const { rawContent } = publish({
      publishable: {
        template,
        stylesConfig,
        meta: {
          name: 'alert',
          type: 'registry:ui',
          files: [
            {
              type: 'registry:ui',
              path: 'ui/alert/base.tsx',
              target: 'ui/alert.tsx',
            },
          ],
          params: {
            style: {
              kind: 'enum',
              default: 'default',
              values: ['default', 'sousse'] as const,
            },
            radius: {
              kind: 'scalar',
              type: 'radius',
              cssVar: '--alert-radius',
              default: '--radius-lg',
            },
          },
        },
      },
      preset: {
        density: 'default',
        componentParams: { alert: { radius: '--radius-md' } },
      },
    })

    expect(rawContent).toContain('rounded-md')
    expect(rawContent).not.toContain('rounded-(--alert-radius)')
  })

  test('field: declared-but-empty slots (fieldset/legend) survive to the emitted tv config', () => {
    const stylesConfig = extractStylesConfig(
      path.join(REGISTRY_UI, 'field/styles.ts'),
    )
    const { template } = transformBase({
      baseTsxPath: path.join(REGISTRY_UI, 'field/base.tsx'),
      componentName: 'field',
    })

    const { rawContent } = publish({
      publishable: {
        template,
        stylesConfig,
        meta: {
          name: 'field',
          type: 'registry:ui',
          files: [
            {
              type: 'registry:ui',
              path: 'ui/field/base.tsx',
              target: 'ui/field.tsx',
            },
          ],
        },
      },
      preset: { density: 'default', componentParams: {} },
    })

    // The base file destructures `fieldset` / `legend` from the tv slots — if
    // flatten drops the empty slot keys, those become undefined slot functions.
    expect(rawContent).toMatch(/fieldset:\s*""/)
    expect(rawContent).toMatch(/legend:\s*""/)
  })
})
