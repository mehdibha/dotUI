/**
 * Compile-time tests for `createStyles` strict typing.
 *
 * Each `// @ts-expect-error` line is a wrong-type case that MUST fail to
 * compile. If TypeScript later accepts one of these, the directive itself
 * raises an "Unused '@ts-expect-error' directive" error — which means the
 * type system regressed and the issue surfaces immediately.
 *
 * Run: `npx tsc --noEmit` (this file is included via the project's TS glob).
 */

import { expect, test } from 'vitest'

import type { RegistryItem } from '@/registry/types'

import { createStyles } from './styles'

/* -------------------------------------------------------------------------- *
 * Fixture: a meta with both enum and scalar params, plus base with slots
 * and variants. Used as the reference shape for all the failure cases below.
 * -------------------------------------------------------------------------- */

const fixtureMeta = {
  name: 'fixture',
  type: 'registry:ui',
  files: [{ type: 'registry:ui', path: 'fake.tsx', target: 'fake.tsx' }],
  params: {
    style: {
      kind: 'enum',
      default: 'default',
      values: ['default', 'alt'] as const,
    },
    highlight: {
      kind: 'enum',
      default: 'subtle',
      values: ['subtle', 'accent'] as const,
    },
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--fixture-radius',
      default: '--radius-md',
    },
  },
} satisfies RegistryItem

const baseConfig = {
  base: {
    base: 'block',
    slots: {
      root: 'rounded',
      item: 'px-2',
    },
    variants: {
      variant: { default: '', danger: '' },
      size: { sm: '', md: '', lg: '' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
} as const

test('loads createStyles compile-time fixtures', () => {
  expect(fixtureMeta.name).toBe('fixture')
})

/* -------------------------------------------------------------------------- *
 * Happy path — should COMPILE.
 * -------------------------------------------------------------------------- */

createStyles(fixtureMeta, {
  base: baseConfig.base,
  density: {
    compact: {
      base: 'text-xs',
      variants: { size: { sm: 'h-6', md: 'h-7', lg: 'h-8' } },
    },
    default: {},
    comfortable: {
      slots: { root: 'text-sm' },
    },
  },
  params: {
    style: {
      default: { slots: { root: 'border' } },
      alt: {
        slots: { item: 'italic' },
        vars: { '--fixture-bg': 'var(--neutral-100)' },
      },
    },
    highlight: {
      subtle: { slots: { item: 'bg-neutral' } },
      accent: { slots: { item: 'bg-accent' } },
    },
  },
})

/* -------------------------------------------------------------------------- *
 * Wrong-type cases — each must fail compilation.
 * -------------------------------------------------------------------------- */

/* 1) Density: adds a slot key not present in base.slots */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  density: {
    compact: {
      // @ts-expect-error — "footer" is not a slot in base
      slots: { footer: 'h-2' },
    },
    default: {},
    comfortable: {},
  },
})

/* 2) Density: uses a variant key not in base.variants */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  density: {
    compact: {
      // @ts-expect-error — "tone" is not a variant in base
      variants: { tone: { soft: 'bg-soft' } },
    },
    default: {},
    comfortable: {},
  },
})

/* 3) Density: uses a variant value not declared in base.variants.size */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  density: {
    compact: {
      variants: {
        // @ts-expect-error — "xl" is not a value of base.variants.size
        size: { xl: 'h-10' },
      },
    },
    default: {},
    comfortable: {},
  },
})

/* 4) Density: wrong defaultVariants key */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  density: {
    compact: {
      // @ts-expect-error — "tone" is not a variant in base
      defaultVariants: { tone: 'soft' },
    },
    default: {},
    comfortable: {},
  },
})

/* 5) Density: defaultVariants value not in the variant's value set */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  density: {
    compact: {
      defaultVariants: {
        // @ts-expect-error — "xl" is not a value of size
        size: 'xl',
      },
    },
    default: {},
    comfortable: {},
  },
})

/* 6) Density: missing one of the three densities */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  // @ts-expect-error — "comfortable" key missing
  density: {
    compact: {},
    default: {},
  },
})

/* 7) Params: param name not declared in meta.params */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  params: {
    // @ts-expect-error — "unknown" isn't a param in meta
    unknown: { foo: { slots: { root: 'x' } } },
  },
})

/* 8) Params: value name not in meta.params.style.values */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  params: {
    style: {
      // @ts-expect-error — "neon" isn't in style.values
      neon: { slots: { root: 'border' } },
    },
  },
})

/* 9) Params: param value adds a slot key not in base */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  params: {
    style: {
      default: {
        // @ts-expect-error — "footer" is not a base slot
        slots: { footer: 'p-2' },
      },
    },
  },
})

/* 10) Params: param value uses a variant value not in base */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  params: {
    highlight: {
      subtle: {
        variants: {
          // @ts-expect-error — "warning" not in base.variants.variant
          variant: { warning: 'bg-warning' },
        },
      },
    },
  },
})

/* 11) Params: vars must be Record<string, string>, not number values */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  params: {
    style: {
      alt: {
        // @ts-expect-error — vars values must be strings
        vars: { '--x': 12 },
      },
    },
  },
})

/* 12) `tv:` wrapper should NOT be a valid key (legacy shape removed) */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  params: {
    style: {
      default: {
        // @ts-expect-error — `tv` is not a valid key on a param value
        tv: { slots: { root: 'border' } },
      },
    },
  },
})

/* 13) Top-level `styles` field is gone */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  // @ts-expect-error — `styles` is no longer a valid top-level field
  styles: { default: { slots: { root: 'x' } } },
})

/* 14) defaultVariants on a param value: variant key not in base */
createStyles(fixtureMeta, {
  base: baseConfig.base,
  params: {
    style: {
      default: {
        // @ts-expect-error — "tone" is not a base variant
        defaultVariants: { tone: 'soft' },
      },
    },
  },
})

/* -------------------------------------------------------------------------- *
 * Meta-shape tests — RegistryItem-level
 * -------------------------------------------------------------------------- */

/* 15) Enum param missing required `values` */
const _missingValues = {
  name: 'x',
  type: 'registry:ui',
  files: [{ type: 'registry:ui', path: 'f.ts', target: 'f.ts' }],
  params: {
    // @ts-expect-error — values is required for enum params
    style: { kind: 'enum', default: 'default' },
  },
} satisfies RegistryItem

/* 16) Scalar param: `cssVar` must be a `--<string>` template literal */
const _badCssVar = {
  name: 'x',
  type: 'registry:ui',
  files: [{ type: 'registry:ui', path: 'f.ts', target: 'f.ts' }],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      // @ts-expect-error — cssVar must start with "--"
      cssVar: 'alert-radius',
      default: '--radius-md',
    },
  },
} satisfies RegistryItem

/* 17) Scalar param: `type` must be a known TokenType */
const _badType = {
  name: 'x',
  type: 'registry:ui',
  files: [{ type: 'registry:ui', path: 'f.ts', target: 'f.ts' }],
  params: {
    // @ts-expect-error — "weight" isn't a TokenType
    w: { kind: 'scalar', type: 'weight', cssVar: '--w', default: '100' },
  },
} satisfies RegistryItem

/* Suppress "unused" warnings */
void _missingValues
void _badCssVar
void _badType
