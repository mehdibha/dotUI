/**
 * Parity coverage analysis — the "is this component at parity yet?" half of the
 * dual-backend system (see `docs/research/2026-06-30-tailwind-stylex-dual-backend/`).
 *
 * `emit-stylex.ts` answers "render this component in StyleX, and tell me what I
 * couldn't translate." This module answers the dual question across a component's
 * WHOLE style surface (every layer — base, density, params, variants, compound) at
 * once: which Tailwind tokens have no same-element StyleX form, and — crucially —
 * *why*, so the report is an actionable work-list rather than a flat dump.
 *
 * Every untranslated token is bucketed by the strategy that resolves it (the table
 * in the research README):
 *   - `marker`     — `group`/`peer` marker tokens; emit no CSS (structural only).
 *   - `ancestor`   — `group-*`/`peer-*`/`in-*` variants → `stylex.when.ancestor` + a marker.
 *   - `has`        — `has-*` → `stylex.when.descendant` (`:has()`-gated).
 *   - `descendant` — `**:`/`*:`/`[&…]` genuine descendant styling → refactor to a slot/`gap`.
 *   - `composite`  — dotUI same-element composite utilities (`focus-ring`, …) shipped in
 *                    base.css → pass through as a literal className (parity for free).
 *   - `unknown`    — a same-element utility the table doesn't cover yet → extend the map.
 *
 * That bucketing turns "71 components, unknown effort" into a sized plan, and the
 * `unknown` bucket is the precise to-do list for growing `tw-to-stylex.ts`. Pure
 * data transform — no React, no ts-morph; safe anywhere the publisher runs.
 */

import {
  PASSTHROUGH_UTILITIES,
  translateClasses,
  translateUtility,
} from './tw-to-stylex'
import type {
  ClassValue,
  StylesConfig,
  TvLayer,
  VariantSliceValue,
} from './types'

/* ----------------------------- token taxonomy ----------------------------- */

export type ParityBucket =
  | 'marker'
  | 'ancestor'
  | 'has'
  | 'descendant'
  | 'pseudo'
  | 'composite'
  | 'unknown'

/** Tailwind pseudo-ELEMENT variant prefixes. StyleX expresses these as top-level
 *  `::x` namespace keys (a different shape from same-element pseudo-classes) — an
 *  emitter extension, not a descendant refactor, so they get their own bucket. */
const PSEUDO_ELEMENT_PREFIXES = new Set([
  'before',
  'after',
  'placeholder',
  'selection',
  'marker',
  'first-letter',
  'first-line',
  'file',
  'backdrop',
  'details-content',
])

const MARKER_RE = /^(group|peer)(\/.+)?$/
const ANCESTOR_PREFIX_RE = /^(group-|peer-|in-|not-in-)/
const HAS_PREFIX_RE = /^(group-has-|peer-has-|has-)/
// Sibling/child/class-presence/tag arbitrary selectors + the custom `with` plugin —
// kept in sync with the translator's DESCENDANT_PREFIX_RE.
const DESCENDANT_PREFIX_RE = /^(\*\*|\*|\[&|\[\.|\[\[|\[[a-z]|with-|not-with-)/
// Utilities that style children (no prefix): `space-x-*`, `divide-*`.
const DESCENDANT_UTILITY_RE = /^-?(space-[xy]-|divide(-|$))/

/** The utility (last `:`-segment) of a token, bracket-depth aware. */
function utilityOf(token: string): string {
  let depth = 0
  let last = 0
  for (let i = 0; i < token.length; i++) {
    const ch = token[i]
    if (ch === '[' || ch === '(') depth++
    else if (ch === ']' || ch === ')') depth--
    else if (ch === ':' && depth === 0) last = i + 1
  }
  return token.slice(last)
}

function prefixesOf(token: string): string[] {
  const util = utilityOf(token)
  if (util.length === token.length) return []
  return token.slice(0, token.length - util.length - 1).split(':')
}

/**
 * Classify a token that the translator could not express on the element itself,
 * into the strategy bucket that resolves it.
 */
export function classifyUntranslated(token: string): ParityBucket {
  if (MARKER_RE.test(token)) return 'marker'
  const prefixes = prefixesOf(token)
  for (const p of prefixes) {
    if (HAS_PREFIX_RE.test(p)) return 'has'
    if (DESCENDANT_PREFIX_RE.test(p)) return 'descendant'
    if (ANCESTOR_PREFIX_RE.test(p)) return 'ancestor'
    if (PSEUDO_ELEMENT_PREFIXES.has(p)) return 'pseudo'
  }
  const util = utilityOf(token)
  if (DESCENDANT_UTILITY_RE.test(util)) return 'descendant'
  if (PASSTHROUGH_UTILITIES.has(util)) return 'composite'
  return 'unknown'
}

/* ------------------------------ leaf walking ------------------------------ */

function pushClassValue(value: ClassValue | undefined, out: string[]): void {
  if (value == null || value === false) return
  if (typeof value === 'string') {
    if (value) out.push(value)
  } else if (Array.isArray(value)) {
    for (const v of value) pushClassValue(v, out)
  }
}

function pushSlice(value: VariantSliceValue | undefined, out: string[]): void {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const slotValue of Object.values(value)) pushClassValue(slotValue, out)
  } else {
    pushClassValue(value as ClassValue, out)
  }
}

/** Collect every class string anywhere in one tv layer. */
function collectLayerLeaves(layer: TvLayer, out: string[]): void {
  pushClassValue(layer.base, out)
  if (layer.slots)
    for (const v of Object.values(layer.slots)) pushClassValue(v, out)
  if (layer.variants) {
    for (const values of Object.values(layer.variants)) {
      for (const slice of Object.values(values)) pushSlice(slice, out)
    }
  }
  if (layer.compoundVariants) {
    for (const cv of layer.compoundVariants) {
      pushClassValue((cv.class ?? cv.className) as ClassValue, out)
    }
  }
}

/** Every class string across all layers of a styles config (base + density + params). */
export function collectClassLeaves(config: StylesConfig): string[] {
  const out: string[] = []
  collectLayerLeaves(config.base, out)
  for (const layer of Object.values(config.density ?? {})) {
    if (layer) collectLayerLeaves(layer, out)
  }
  for (const valueMap of Object.values(config.params ?? {})) {
    for (const layer of Object.values(valueMap)) collectLayerLeaves(layer, out)
  }
  return out
}

/* ------------------------------- analysis -------------------------------- */

export interface ParityReport {
  /** Distinct translatable same-element tokens. */
  translated: number
  /** Distinct tokens with no same-element StyleX form, grouped by strategy bucket. */
  buckets: Record<ParityBucket, string[]>
  /** True when every untranslated token is `marker` or `composite` — i.e. the
   *  component reaches exact parity with no codegen extension, plumbing, or refactor. */
  trivial: boolean
  /** The component's overall difficulty (worst bucket present). `extend` = a
   *  mechanical translator/emitter extension (uncovered utility or pseudo-element);
   *  `ancestor` = `when.*` marker plumbing; `descendant` = a per-component refactor. */
  difficulty: 'trivial' | 'extend' | 'ancestor' | 'descendant'
}

const EMPTY_BUCKETS: () => Record<ParityBucket, string[]> = () => ({
  marker: [],
  ancestor: [],
  has: [],
  descendant: [],
  pseudo: [],
  composite: [],
  unknown: [],
})

/**
 * Analyze one component's full styles config: run the translator over every class
 * leaf, then bucket the untranslated remainder by resolution strategy.
 */
export function analyzeParity(config: StylesConfig): ParityReport {
  const translated = new Set<string>()
  const buckets = EMPTY_BUCKETS()
  const seenUntranslated = new Set<string>()

  for (const leaf of collectClassLeaves(config)) {
    const { untranslated, markers } = translateClasses(leaf)
    for (const m of markers) {
      if (!seenUntranslated.has(m)) {
        seenUntranslated.add(m)
        buckets.marker.push(m)
      }
    }
    for (const token of untranslated) {
      if (seenUntranslated.has(token)) continue
      seenUntranslated.add(token)
      buckets[classifyUntranslated(token)].push(token)
    }
    // Same-element tokens that DID translate: count the distinct utilities.
    for (const word of leaf.split(/\s+/).filter(Boolean)) {
      if (seenUntranslated.has(word)) continue
      if (!MARKER_RE.test(word) && translateUtility(utilityOf(word)) !== null) {
        translated.add(word)
      }
    }
  }

  // Genuine descendant selectors need a per-component refactor; group/peer/has
  // need `when.*` marker plumbing; uncovered utilities + pseudo-elements are just
  // mechanical codegen extensions. Everything else (marker/composite) is parity-now.
  const needsDescendant = buckets.descendant.length > 0
  const needsAncestor = buckets.ancestor.length > 0 || buckets.has.length > 0
  const needsExtend = buckets.unknown.length > 0 || buckets.pseudo.length > 0
  const trivial = !needsDescendant && !needsAncestor && !needsExtend

  return {
    translated: translated.size,
    buckets,
    trivial,
    difficulty: needsDescendant
      ? 'descendant'
      : needsAncestor
        ? 'ancestor'
        : needsExtend
          ? 'extend'
          : 'trivial',
  }
}
