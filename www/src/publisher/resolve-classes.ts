/**
 * Resolve scalar-param var references in a flat tv layer.
 *
 * Input class examples (from `styles.ts`):
 *   "rounded-(--alert-radius)"        — Tailwind v4 shorthand for arbitrary CSS var
 *   "bg-(--alert-bg) text-fg"         — multiple utilities, only one is a param ref
 *
 * The map `cssVar → tailwindSuffix` is seeded from the registry-wide
 * styles.css defaults (`buildStyleVarMap`) and overridden by the component's
 * scalar-param selections (`buildScalarVarMap`), then matching class tokens
 * rewrite to `rounded-md` etc. Vars that don't resolve (literals, calc
 * chains, tokens outside the static pools) are left alone and keep shipping
 * as declarations — `pruneResolvedCssVars` drops only the ones the rewrite
 * made dead.
 */

import type { RegistryItem, ScalarParamDef } from "@/registry/types"

import { tokenRefToSuffix, tokenValueToSuffix } from "./token-map"
import type { ClassValue, TvLayer, VariantSliceValue } from "./types"

/* ---------------------------- var → suffix map ---------------------------- */

/**
 * Seed a var → suffix map from the registry-wide styles.css defaults
 * (`--popover-radius: var(--radius-md)` → `md`). Per-surface vars are
 * builder-only indirection — exported code gets the resolved utility class.
 * Only single bare `var(--token)` values resolve; literals and calc() chains
 * are left alone and keep shipping as vars.
 */
export function buildStyleVarMap(
  defaults: Record<string, string>,
): Map<string, string> {
  const map = new Map<string, string>()
  const bareRef = (value: string) =>
    /^var\((--[\w-]+)\)$/.exec(value.trim())?.[1]
  // Follows role hops (--btn-radius → --radius-control → --radius-md) until a
  // real token or a dead end; depth-capped so a cycle can't hang the build.
  const refToSuffix = (ref: string, depth = 0): string | undefined => {
    const direct = tokenRefToSuffix(ref)
    if (direct !== undefined) return direct
    if (depth >= 4) return undefined
    const next = defaults[ref]
    const nextRef = next === undefined ? undefined : bareRef(next)
    return nextRef === undefined ? undefined : refToSuffix(nextRef, depth + 1)
  }
  for (const [cssVar, value] of Object.entries(defaults)) {
    const ref = bareRef(value)
    if (!ref) continue
    const suffix = refToSuffix(ref)
    if (suffix !== undefined) map.set(cssVar, suffix)
  }
  return map
}

/**
 * Build the cssVar → suffix lookup for one component's scalar params, given
 * the user's preset selection for that component. Returns an empty map when
 * there are no resolvable scalar params (other types like color/spacing are
 * left to flow through unchanged for now — they're shipped as base CSS).
 */
export function buildScalarVarMap(
  meta: RegistryItem,
  paramSelections: Record<string, string>,
): Map<string, string> {
  const map = new Map<string, string>()
  const params = meta.params ?? {}
  for (const [paramName, def] of Object.entries(params)) {
    if (def.kind !== "scalar") continue
    const scalar = def as ScalarParamDef
    const value = paramSelections[paramName] ?? scalar.default
    const suffix = tokenValueToSuffix(scalar.type, value)
    if (suffix !== undefined) {
      map.set(scalar.cssVar, suffix)
    }
  }
  return map
}

/* ----------------------------- class rewrite ----------------------------- */

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Rewrite one class string. For each known (cssVar → suffix) pair, replace
 * `<prefix>-(<cssVar>)` with `<prefix>-<suffix>`. Whitespace-separated tokens
 * outside the pattern are preserved verbatim.
 */
export function rewriteClassString(
  input: string,
  varMap: Map<string, string>,
): string {
  if (varMap.size === 0) return input
  let output = input
  for (const [cssVar, suffix] of varMap) {
    const pattern = new RegExp(`-\\(${escapeRegex(cssVar)}\\)`, "g")
    output = output.replace(pattern, `-${suffix}`)
  }
  return output
}

function rewriteClassValue(
  value: ClassValue | undefined,
  varMap: Map<string, string>,
): ClassValue | undefined {
  if (value == null || value === false) return value
  if (typeof value === "string") return rewriteClassString(value, varMap)
  if (Array.isArray(value)) {
    return value.map(
      (v) => rewriteClassValue(v, varMap) as string | string[],
    ) as ClassValue
  }
  return value
}

function isSlotMap(
  value: VariantSliceValue | undefined,
): value is Record<string, ClassValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function rewriteVariantSlice(
  value: VariantSliceValue | undefined,
  varMap: Map<string, string>,
): VariantSliceValue | undefined {
  if (value === undefined) return undefined
  if (isSlotMap(value)) {
    const result: Record<string, ClassValue> = {}
    for (const [slot, slotValue] of Object.entries(value)) {
      const rewritten = rewriteClassValue(slotValue, varMap)
      if (rewritten !== undefined) result[slot] = rewritten
    }
    return result
  }
  return rewriteClassValue(value, varMap)
}

/* ----------------------------- css var pruning ---------------------------- */

type CssValue = string | CssObject
interface CssObject {
  [key: string]: CssValue
}

function isReferenced(cssVar: string, corpus: string): boolean {
  return new RegExp(`${escapeRegex(cssVar)}(?![\\w-])`).test(corpus)
}

/** Serialize a css object for reference checking, skipping one declaration. */
function corpusWithout(css: CssObject, skipPath: readonly string[]): string {
  const parts: string[] = []
  const walk = (node: CssObject, path: readonly string[]): void => {
    for (const [key, value] of Object.entries(node)) {
      const here = [...path, key]
      if (typeof value === "string") {
        const skipped =
          here.length === skipPath.length &&
          here.every((seg, i) => seg === skipPath[i])
        if (!skipped) parts.push(key, value)
      } else {
        parts.push(key)
        walk(value, here)
      }
    }
  }
  walk(css, [])
  return parts.join("\n")
}

/**
 * Drop styles.css declarations whose var was resolved away by the class
 * rewriter. A declaration ships only while something still references it —
 * shipped file contents (calc() chains, non-shorthand var() reads) or another
 * surviving css value. Runs to fixpoint so chains (`--a: var(--b)`) prune
 * fully. Vars outside `resolved` are never touched.
 */
export function pruneResolvedCssVars(
  css: RegistryItem["css"],
  resolved: ReadonlySet<string>,
  externalCorpus: string,
): RegistryItem["css"] | undefined {
  if (!css) return css
  const work = structuredClone(css) as CssObject

  let changed = true
  while (changed) {
    changed = false
    const visit = (node: CssObject, path: readonly string[]): void => {
      for (const [key, value] of Object.entries(node)) {
        const here = [...path, key]
        if (typeof value !== "string") {
          visit(value, here)
          continue
        }
        if (!key.startsWith("--") || !resolved.has(key)) continue
        const corpus = externalCorpus + "\n" + corpusWithout(work, here)
        if (!isReferenced(key, corpus)) {
          delete node[key]
          changed = true
        }
      }
    }
    visit(work, [])
  }

  const compact = (
    node: CssObject,
    original: CssObject,
  ): CssObject | undefined => {
    const out: CssObject = {}
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        out[key] = value
        continue
      }
      const originalChild = original[key]
      const child = compact(
        value,
        typeof originalChild === "object" ? originalChild : {},
      )
      // Keep originally-empty objects (`@plugin` statements); drop selectors
      // that pruning emptied out.
      const wasEmpty =
        typeof originalChild === "object" &&
        Object.keys(originalChild).length === 0
      if (child !== undefined || wasEmpty) out[key] = child ?? {}
    }
    return Object.keys(out).length > 0 ? out : undefined
  }

  return compact(work, css as CssObject) as RegistryItem["css"] | undefined
}

/**
 * Walk a flat tv layer and rewrite all class strings using `varMap`.
 * Returns a new layer; the input is not mutated.
 */
export function resolveClasses(
  layer: TvLayer,
  varMap: Map<string, string>,
): TvLayer {
  if (varMap.size === 0) return layer

  const out: TvLayer = {}

  if (layer.base !== undefined) {
    out.base = rewriteClassValue(layer.base, varMap)
  }

  if (layer.slots) {
    const slots: Record<string, ClassValue> = {}
    for (const [k, v] of Object.entries(layer.slots)) {
      const rewritten = rewriteClassValue(v, varMap)
      if (rewritten !== undefined) slots[k] = rewritten
    }
    out.slots = slots
  }

  if (layer.variants) {
    const variants: NonNullable<TvLayer["variants"]> = {}
    for (const [variantName, values] of Object.entries(layer.variants)) {
      const valuesOut: Record<string, VariantSliceValue> = {}
      for (const [valueName, sliceValue] of Object.entries(values)) {
        const rewritten = rewriteVariantSlice(sliceValue, varMap)
        if (rewritten !== undefined) valuesOut[valueName] = rewritten
      }
      variants[variantName] = valuesOut
    }
    out.variants = variants
  }

  if (layer.defaultVariants) out.defaultVariants = layer.defaultVariants

  if (layer.compoundVariants) {
    out.compoundVariants = layer.compoundVariants.map((cv) => {
      const result: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(cv)) {
        if (k === "class" || k === "className") {
          const rewritten = rewriteClassValue(v as ClassValue, varMap)
          if (rewritten !== undefined) result[k] = rewritten
        } else {
          result[k] = v
        }
      }
      return result
    })
  }

  return out
}
