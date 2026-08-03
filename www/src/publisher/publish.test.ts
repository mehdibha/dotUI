/**
 * End-to-end test of the request-time publish pipeline against hand-written
 * fixtures. Validates each stage individually, then the assembled output.
 *
 * Coverage:
 *   - button   : no slots, no params, multiple variants × densities
 *   - alert    : slots, enum param ("style") that merges variants per-slot,
 *                scalar param ("radius") whose var ref must be rewritten
 */

import { afterEach, describe, expect, test } from 'vitest'

import { alertPublishable } from './__fixtures__/alert-publishable'
import { buttonPublishable } from './__fixtures__/button-publishable'
import { flatten } from './flatten'
import {
  depsFromFileImports,
  publish,
  setDotuiDepResolver,
  setKnownDotuiNames,
  TV_CONFIG_PLACEHOLDER,
} from './publish'
import {
  buildScalarVarMap,
  buildStyleVarMap,
  pruneResolvedCssVars,
  resolveClasses,
  rewriteClassString,
} from './resolve-classes'
import { serializeTvConfig } from './serialize'
import type { ClassValue, TvLayer } from './types'

afterEach(() => {
  setKnownDotuiNames([])
  setDotuiDepResolver('')
})

/* ============================================================ */
/* flatten                                                       */
/* ============================================================ */

describe('flatten', () => {
  test("button: base + density 'compact' merges per-variant classes", () => {
    const layer = flatten({
      stylesConfig: buttonPublishable.stylesConfig,
      meta: buttonPublishable.meta,
      density: 'compact',
      paramSelections: {},
    })

    // `base` concatenates the base array with the density's `base` string.
    const base = layer.base
    expect(Array.isArray(base)).toBe(true)
    expect((base as string[]).at(-1)).toBe('gap-1 text-xs/relaxed')

    // `variants.size.xs` came from density only (base had empty string).
    const sizeXs = layer.variants?.size?.xs as ClassValue
    expect(typeof sizeXs).toBe('string')
    expect(sizeXs).toContain('h-5')

    // `variants.variant.primary` is unchanged (density has no `variant`).
    const primary = layer.variants?.variant?.primary as string
    expect(primary).toContain('bg-primary')

    // `defaultVariants` flows through.
    expect(layer.defaultVariants).toEqual({ variant: 'secondary', size: 'md' })
  })

  test("button: density 'default' uses the default-density classes", () => {
    const layer = flatten({
      stylesConfig: buttonPublishable.stylesConfig,
      meta: buttonPublishable.meta,
      density: 'default',
      paramSelections: {},
    })
    const sizeMd = layer.variants?.size?.md as string
    expect(sizeMd).toContain('h-8')
  })

  test("alert: enum param 'style' merges slot maps inside variants", () => {
    const layer = flatten({
      stylesConfig: alertPublishable.stylesConfig,
      meta: alertPublishable.meta,
      density: 'default',
      paramSelections: { style: 'sousse' },
    })

    // Slot `root` on base came from base, then the sousse override added
    // "border bg-card text-sm".
    const rootSlot = layer.slots?.root as ClassValue
    const rootArr = Array.isArray(rootSlot) ? rootSlot : [rootSlot]
    expect(
      rootArr.some(
        (v) => typeof v === 'string' && v.includes('border bg-card text-sm'),
      ),
    ).toBe(true)

    // variants.variant.danger.root should contain sousse-specific classes.
    const dangerSlots = layer.variants?.variant?.danger as Record<
      string,
      ClassValue
    >
    expect(dangerSlots.root).toMatch(/border-border-danger/)
  })

  test("alert: default 'style' selection still merges variant slot classes", () => {
    const layer = flatten({
      stylesConfig: alertPublishable.stylesConfig,
      meta: alertPublishable.meta,
      density: 'default',
      paramSelections: {},
    })
    const dangerSlots = layer.variants?.variant?.danger as Record<
      string,
      ClassValue
    >
    expect(dangerSlots.root).toMatch(/text-fg-danger/)
  })

  test('preserves declared-but-empty slots when a density layer merges', () => {
    // A slot declared empty in base (like field's `fieldset`/`legend`) must
    // survive the merge as "" — the shipped base file calls every declared slot.
    const layer = flatten({
      stylesConfig: {
        base: { slots: { fieldset: '', field: 'flex gap-2' } },
        density: { default: { slots: { field: 'text-sm' } } },
      },
      meta: { name: 'x', type: 'registry:ui' } as never,
      density: 'default',
      paramSelections: {},
    })
    expect(layer.slots).toHaveProperty('fieldset', '')
    expect(layer.slots?.field).toBeDefined()
  })

  test('alert: undefined density layer leaves base untouched', () => {
    // density compact entry is an empty object — should be a no-op.
    const compact = flatten({
      stylesConfig: alertPublishable.stylesConfig,
      meta: alertPublishable.meta,
      density: 'compact',
      paramSelections: {},
    })
    const def = flatten({
      stylesConfig: alertPublishable.stylesConfig,
      meta: alertPublishable.meta,
      density: 'default',
      paramSelections: {},
    })
    // Both should produce equal `slots.root` content since neither density adds anything.
    expect(compact.slots?.root).toEqual(def.slots?.root)
  })
})

/* ============================================================ */
/* resolve-classes                                               */
/* ============================================================ */

describe('resolve-classes', () => {
  test('rewriteClassString swaps a single var ref to its suffix', () => {
    const map = new Map([['--alert-radius', 'md']])
    expect(rewriteClassString('rounded-(--alert-radius) bg-card', map)).toBe(
      'rounded-md bg-card',
    )
  })

  test('rewriteClassString leaves unknown vars alone', () => {
    const map = new Map([['--alert-radius', 'md']])
    expect(rewriteClassString('rounded-(--btn-radius) p-2', map)).toBe(
      'rounded-(--btn-radius) p-2',
    )
  })

  test('buildScalarVarMap uses preset selection over default', () => {
    const map = buildScalarVarMap(alertPublishable.meta, {
      radius: '--radius-sm',
    })
    expect(map.get('--alert-radius')).toBe('sm')
  })

  test('buildScalarVarMap falls back to def.default', () => {
    const map = buildScalarVarMap(alertPublishable.meta, {})
    expect(map.get('--alert-radius')).toBe('lg')
  })

  test('resolveClasses rewrites within slot arrays', () => {
    const map = new Map([['--alert-radius', 'lg']])
    const layer: TvLayer = {
      slots: { root: ['px-4', 'rounded-(--alert-radius)'] },
    }
    const out = resolveClasses(layer, map)
    expect(out.slots?.root).toEqual(['px-4', 'rounded-lg'])
  })

  test('buildStyleVarMap resolves bare var refs across token pools', () => {
    const map = buildStyleVarMap({
      '--popover-radius': 'var(--radius-md)',
      '--slider-track-radius': 'var(--radius-full)',
      '--slider-cursor': 'var(--cursor-interactive)',
      '--modal-backdrop-blur': 'var(--blur-sm)',
      // literals and calc chains must NOT resolve
      '--checkbox-radius': '4px',
      '--switch-radius': '9999px',
      '--modal-backdrop-opacity': '40%',
      '--slider-thumb-size': 'calc(var(--spacing) * 3)',
      // var refs outside the static pools must NOT resolve
      '--modal-background': 'var(--color-popover)',
      '--btn-font-weight': 'var(--font-weight-medium)',
    })
    expect(map.get('--popover-radius')).toBe('md')
    expect(map.get('--slider-track-radius')).toBe('full')
    expect(map.get('--slider-cursor')).toBe('interactive')
    expect(map.get('--modal-backdrop-blur')).toBe('sm')
    expect(map.size).toBe(4)
  })
})

/* ============================================================ */
/* pruneResolvedCssVars                                          */
/* ============================================================ */

describe('pruneResolvedCssVars', () => {
  test('drops a resolved declaration nothing references', () => {
    const out = pruneResolvedCssVars(
      { ':root': { '--popover-radius': 'var(--radius-md)' } },
      new Set(['--popover-radius']),
      'className="rounded-md"',
    )
    expect(out).toBeUndefined()
  })

  test('keeps a resolved declaration still referenced in file content', () => {
    // input: the shorthand resolved, but calc() chains still read the var.
    const out = pruneResolvedCssVars(
      { ':root': { '--input-radius': 'var(--radius-md)' } },
      new Set(['--input-radius']),
      'rounded-md rounded-[calc(var(--input-radius)-1px)]',
    )
    expect(out).toEqual({ ':root': { '--input-radius': 'var(--radius-md)' } })
  })

  test('never touches unresolved declarations', () => {
    const css = {
      ':root': { '--btn-font-weight': 'var(--font-weight-medium)' },
    }
    const out = pruneResolvedCssVars(css, new Set(['--btn-radius']), '')
    expect(out).toEqual(css)
  })

  test('prunes chains to fixpoint and drops the emptied selector', () => {
    // --a references --b; once --a drops, --b has no referent either.
    const out = pruneResolvedCssVars(
      {
        ':root': { '--a': 'var(--b)', '--b': 'var(--radius-md)' },
        '@utility skeleton': { position: 'relative' },
      },
      new Set(['--a', '--b']),
      'rounded-md',
    )
    expect(out).toEqual({ '@utility skeleton': { position: 'relative' } })
  })

  test('var-name prefixes do not count as references', () => {
    // `--btn-radius-sm` in content must not keep `--btn-radius` alive.
    const out = pruneResolvedCssVars(
      { ':root': { '--btn-radius': 'var(--radius-md)' } },
      new Set(['--btn-radius']),
      'rounded-(--btn-radius-sm)',
    )
    expect(out).toBeUndefined()
  })

  test('keeps originally-empty objects (@plugin statements)', () => {
    const css = { '@plugin "tailwindcss-foo"': {} }
    const out = pruneResolvedCssVars(css, new Set(['--x']), '')
    expect(out).toEqual(css)
  })
})

/* ============================================================ */
/* serialize                                                     */
/* ============================================================ */

describe('serialize', () => {
  test('emits unquoted identifier keys', () => {
    const out = serializeTvConfig({ variant: { primary: 'bg-primary' } })
    expect(out).toContain('variant: {')
    expect(out).toContain('primary: ')
  })

  test('quotes non-identifier keys', () => {
    const out = serializeTvConfig({ 'data-foo': 'x' })
    expect(out).toContain('"data-foo":')
  })

  test('serializes arrays and skips undefined entries', () => {
    const out = serializeTvConfig({ base: ['a', 'b'], extra: undefined })
    expect(out).toContain('"a",')
    expect(out).toContain('"b",')
    expect(out).not.toContain('extra')
  })
})

/* ============================================================ */
/* publish (end-to-end)                                          */
/* ============================================================ */

describe('publish', () => {
  test('button: substitutes resolved config into template', () => {
    const { item, rawContent } = publish({
      publishable: buttonPublishable,
      preset: { density: 'default', componentParams: {} },
    })

    // Placeholder is gone, replaced with an object literal that includes tv keys.
    expect(rawContent).not.toContain(TV_CONFIG_PLACEHOLDER)
    expect(rawContent).toContain('tv({')
    expect(rawContent).toContain('variants: {')
    expect(rawContent).toContain('defaultVariants: {')

    // Shadcn item is shaped correctly.
    expect(item.name).toBe('button')
    expect(item.type).toBe('registry:ui')
    // `focus-styles` is bundled into the registry:base init item so it gets
    // dropped from per-component registryDependencies. `loader` stays as a
    // bare name — without a `setKnownDotuiNames` + `setDotuiDepResolver`
    // call there's no URL rewrite.
    expect(item.registryDependencies).toEqual(['loader'])
    const file = item.files?.[0]
    expect(file?.target).toBe('ui/button.tsx')
    expect(file?.content).toBe(rawContent)
  })

  test('button: rewrites known dotui deps to extensionless endpoint URLs', () => {
    setKnownDotuiNames(['loader'])
    setDotuiDepResolver('https://dotui.com', '?preset=abc')

    const { item } = publish({
      publishable: buttonPublishable,
      preset: { density: 'default', componentParams: {} },
    })

    expect(item.registryDependencies).toEqual([
      'https://dotui.com/r/loader?preset=abc',
    ])
  })

  test('text-field: rewrites BOTH deps (field + input) to absolute URLs, none bare', () => {
    // Regression for #477: `input` used to pass through bare (it had no
    // publishable), so `shadcn add` resolved it against shadcn's default
    // registry. With `input` publishable, both deps rewrite to dotui URLs.
    setKnownDotuiNames(['field', 'input'])
    setDotuiDepResolver('https://dotui.org')

    const { item } = publish({
      publishable: {
        template: TV_CONFIG_PLACEHOLDER,
        stylesConfig: { base: {} },
        meta: {
          name: 'text-field',
          type: 'registry:ui',
          registryDependencies: ['field', 'input'],
          files: [
            {
              type: 'registry:ui',
              path: 'ui/text-field/base.tsx',
              target: 'ui/text-field.tsx',
            },
          ],
        },
      },
      preset: { density: 'default', componentParams: {} },
    })

    expect(item.registryDependencies).toEqual([
      'https://dotui.org/r/field',
      'https://dotui.org/r/input',
    ])
  })

  test("alert: rewrites scalar-param var when preset selects 'md' radius", () => {
    const { rawContent } = publish({
      publishable: alertPublishable,
      preset: {
        density: 'default',
        componentParams: { alert: { radius: '--radius-md' } },
      },
    })
    expect(rawContent).toContain('rounded-md')
    expect(rawContent).not.toContain('rounded-(--alert-radius)')
  })

  test('alert: falls back to default radius when preset omits the param', () => {
    const { rawContent } = publish({
      publishable: alertPublishable,
      preset: { density: 'default', componentParams: {} },
    })
    // alert.radius default is "--radius-lg" → suffix "lg".
    expect(rawContent).toContain('rounded-lg')
  })

  test('styles.css defaults resolve vars with no meta param, and the shipped declaration is pruned', () => {
    const { item, rawContent } = publish({
      publishable: {
        template: `const s = ${TV_CONFIG_PLACEHOLDER};`,
        stylesConfig: { base: { base: 'rounded-(--popover-radius) border' } },
        meta: {
          name: 'popover',
          type: 'registry:ui',
          css: { ':root': { '--popover-radius': 'var(--radius-md)' } },
          files: [
            {
              type: 'registry:ui',
              path: 'ui/popover/base.tsx',
              target: 'ui/popover.tsx',
            },
          ],
        },
      },
      preset: { density: 'default', componentParams: {} },
      styleVarDefaults: { '--popover-radius': 'var(--radius-md)' },
    })
    expect(rawContent).toContain('rounded-md')
    expect(rawContent).not.toContain('--popover-radius')
    expect(item.css).toBeUndefined()
  })

  test('cross-item refs resolve from the registry-wide defaults (toggle-button ← button)', () => {
    const { rawContent } = publish({
      publishable: {
        template: `const s = ${TV_CONFIG_PLACEHOLDER};`,
        stylesConfig: { base: { base: 'rounded-(--btn-radius)' } },
        meta: {
          name: 'toggle-button',
          type: 'registry:ui',
          files: [
            {
              type: 'registry:ui',
              path: 'ui/toggle-button/base.tsx',
              target: 'ui/toggle-button.tsx',
            },
          ],
        },
      },
      preset: { density: 'default', componentParams: {} },
      // Declared by button/styles.css, not by toggle-button.
      styleVarDefaults: { '--btn-radius': 'var(--radius-md)' },
    })
    expect(rawContent).toContain('rounded-md')
  })

  test('scalar-param selection overrides the styles.css default', () => {
    const map = buildStyleVarMap({ '--alert-radius': 'var(--radius-lg)' })
    for (const [k, v] of buildScalarVarMap(alertPublishable.meta, {
      radius: '--radius-sm',
    })) {
      map.set(k, v)
    }
    expect(map.get('--alert-radius')).toBe('sm')
  })

  test('surface-var refs in template markup (outside the tv config) resolve too', () => {
    const { rawContent } = publish({
      publishable: {
        template: `const s = ${TV_CONFIG_PLACEHOLDER};\nconst el = <div className="rounded-(--color-swatch-radius)" />;`,
        stylesConfig: { base: {} },
        meta: {
          name: 'color-swatch',
          type: 'registry:ui',
          files: [
            {
              type: 'registry:ui',
              path: 'ui/color-swatch/base.tsx',
              target: 'ui/color-swatch.tsx',
            },
          ],
        },
      },
      preset: { density: 'default', componentParams: {} },
      styleVarDefaults: { '--color-swatch-radius': 'var(--radius-sm)' },
    })
    expect(rawContent).toContain('rounded-sm')
    expect(rawContent).not.toContain('--color-swatch-radius')
  })

  test('alert: published item drops dotui-only fields (params, group)', () => {
    const { item } = publish({
      publishable: alertPublishable,
      preset: { density: 'default', componentParams: {} },
    })
    // `params` and `group` are dev-time concerns only.
    expect((item as Record<string, unknown>).params).toBeUndefined()
    expect((item as Record<string, unknown>).group).toBeUndefined()
  })

  test('includes component-level registry css fields', () => {
    const css = {
      '@utility skeleton': {
        position: 'relative',
      },
    }

    const { item } = publish({
      publishable: {
        template: TV_CONFIG_PLACEHOLDER,
        stylesConfig: { base: {} },
        meta: {
          name: 'skeleton',
          type: 'registry:ui',
          css,
          files: [
            {
              type: 'registry:ui',
              path: 'ui/skeleton/base.tsx',
              target: 'ui/skeleton.tsx',
            },
          ],
        },
      },
      preset: { density: 'default', componentParams: {} },
    })

    expect(item.css).toEqual(css)
  })

  test('multi-file item: ships each file its own content', () => {
    const hookContent = 'export function useThing() {\n\treturn null;\n}\n'

    const { item } = publish({
      publishable: {
        template: `const x = ${TV_CONFIG_PLACEHOLDER};\nexport function Thing() {}\n`,
        stylesConfig: { base: {} },
        meta: {
          name: 'thing',
          type: 'registry:ui',
          files: [
            {
              type: 'registry:ui',
              path: 'ui/thing/base.tsx',
              target: 'ui/thing.tsx',
            },
            {
              type: 'registry:ui',
              path: 'ui/thing/use-thing.ts',
              target: 'ui/use-thing.ts',
            },
          ],
        },
        extraFiles: { 'ui/thing/use-thing.ts': hookContent },
      },
      preset: { density: 'default', componentParams: {} },
    })

    const base = item.files?.find((f) => f.target === 'ui/thing.tsx')
    const hook = item.files?.find((f) => f.target === 'ui/use-thing.ts')

    // The base file gets the resolved template; the hook file gets its own
    // pre-transformed content — never the base template (the multi-file bug).
    expect(base?.content).toContain('export function Thing()')
    expect(base?.content).not.toContain(TV_CONFIG_PLACEHOLDER)
    expect(hook?.content).toBe(hookContent)
    expect(hook?.content).not.toContain('export function Thing()')
  })
})

/* ============================================================ */
/* depsFromFileImports                                           */
/* ============================================================ */

describe('depsFromFileImports', () => {
  const deps = (content: string) => depsFromFileImports([{ content }])

  test('deep react-aria-components import maps to react-aria-components', () => {
    const found = deps(
      `import { Autocomplete } from "react-aria-components/Autocomplete"`,
    )
    expect(found).toContain('react-aria-components')
    // must NOT be misattributed to the react-aria entry
    expect(found).not.toContain('react-aria')
  })

  test('bare react-aria-components import maps to react-aria-components', () => {
    const found = deps(`import { Button } from "react-aria-components"`)
    expect(found).toContain('react-aria-components')
    expect(found).not.toContain('react-aria')
  })

  test('react-aria deep import still maps to react-aria (not the -components pkg)', () => {
    const found = deps(`import { useButton } from "react-aria/button"`)
    expect(found).toContain('react-aria')
    expect(found).not.toContain('react-aria-components')
  })

  test('a file importing both lists both packages', () => {
    const found = deps(
      `import { useFilter } from "react-aria"\nimport { Autocomplete } from "react-aria-components/Autocomplete"`,
    )
    expect(found).toContain('react-aria')
    expect(found).toContain('react-aria-components')
  })
})
