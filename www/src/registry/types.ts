import type {
  Registry as ShadcnRegistry,
  RegistryItem as ShadcnRegistryItem,
} from 'shadcn/schema'

/**
 * Density tiers a design system can be rendered at. Lives at the registry layer
 * because both the runtime provider and the publish pipeline need it.
 */
export type Density = 'compact' | 'default' | 'comfortable'

/**
 * Component groups for style editor UI organization.
 * Components in the same group share the same visual style.
 */
export type ComponentGroup =
  | 'buttons'
  | 'inputs'
  | 'pickers'
  | 'selection-controls'
  | 'overlays'
  | 'menus-lists'
  | 'feedback'
  | 'progress'
  | 'tags'
  | 'navigation'
  | 'disclosure'
  | 'containers'
  | 'sliders'
  | 'color-swatches'
  | 'calendar'
  | 'drop-zone'
  | 'typography'
  | 'charts'

/* ------------------------------- Params ------------------------------- */

export type TokenType =
  | 'radius'
  | 'color'
  | 'spacing'
  | 'font-size'
  | 'blur'
  | 'opacity'
  | 'cursor'
  | 'shadow'
export type RegistryItemFile = NonNullable<ShadcnRegistryItem['files']>[number]

/**
 * An "enum" param: user picks one of a fixed set of named values.
 * Each value can carry tv slices and/or CSS vars in `createStyles`.
 * Covers what was previously `meta.styles` (aesthetic) and `meta.params`
 * (per-component variants).
 */
export type EnumParamDef = {
  kind: 'enum'
  default: string
  values: readonly string[]
  files?: Record<string, readonly RegistryItemFile[]>
  description?: string
}

/**
 * A "scalar" param: user picks any value from a typed pool (a token type).
 * The selected value is written to `cssVar` on `:root`. No tv slice.
 * Covers what was previously `meta.tokens`.
 */
export type ScalarParamDef = {
  kind: 'scalar'
  type: TokenType
  cssVar: `--${string}`
  default: string
  minValue?: number
  maxValue?: number
  step?: number
  description?: string
}

export type ParamDef = EnumParamDef | ScalarParamDef

export type RegistryItem = ShadcnRegistryItem & {
  /** Component group for style editor UI organization */
  group?: ComponentGroup | null
  /**
   * Customization knobs surfaced in the create-page customizer.
   * Two kinds: `enum` (1-of-N named values, may carry tv + vars) and
   * `scalar` (a single CSS var resolved from a typed token pool).
   */
  params?: Record<string, ParamDef>
}

/* ------------------------------- Blocks ------------------------------- */

/**
 * Category a block/layout belongs to. Drives the explorer + /create grouping.
 * `'interactive'` is intentionally reserved for future real-world blocks
 * (kanban, media players) and is NOT part of v1 — adding it is a product
 * decision, not a code change.
 */
export type BlockCategory = 'layout' | 'page' | 'section'

/**
 * A block (or layout): a curated, multi-variant composition of already-themed
 * components — a login page, a sidebar app-shell, a dashboard. Unlike a
 * `ComponentGroup` item it has no `group` (so it never appears in the components
 * list or docs gallery), and its single tweak is always a named `variant`
 * modeled as enum-with-files: each variant is its own composition file resolved
 * at publish to one canonical `target` — the `loader` enum-with-files mechanism
 * at screen scale. Blocks add no tokens or axes; they consume the design system.
 */
export type BlockRegistryItem = ShadcnRegistryItem & {
  /** Explorer + builder category. */
  category: BlockCategory
  /** The single tweak. Always present, always named `variant`, always enum-with-files. */
  params: { variant: EnumParamDef }
  /** Display metadata for the builder + `/blocks` page. */
  display: {
    title: string
    description: string
    /** value -> human label, e.g. `{ split: 'Split' }` */
    variantLabels?: Record<string, string>
  }
}

export type Registry = Omit<ShadcnRegistry, 'items'> & {
  items: RegistryItem[]
}
