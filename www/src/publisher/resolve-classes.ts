/**
 * Resolve `--studio-*` vars out of shipped code.
 *
 * Studio vars are the builder's live-tweak indirection: a component reads
 * `rounded-(--studio-btn-radius)` so the panel can retarget every button at
 * once by writing one custom property on `:root`. Exported code owns its
 * values instead, so every read resolves to what the preset lands on:
 *
 *   rounded-(--studio-btn-radius)              → rounded-md
 *   font-(--studio-btn-font-weight)            → font-medium
 *   shadow-(--studio-slider-thumb-shadow)      → shadow-none
 *   [--surface-radius:var(--studio-card-radius)] → [--surface-radius:var(--radius-xl)]
 *
 * The var → value map follows chains through other studio vars (button →
 * radius role → ladder rung). Values that name a Tailwind theme token become
 * the utility's suffix; anything else ships as an arbitrary value. A studio
 * var that survives into shipped output is a build error — declare a default
 * in the component's styles.css.
 */

import type { EnumParamDef, RegistryItem } from "@/registry/types"

import type { ClassValue, TvLayer, VariantSliceValue } from "./types"

export const STUDIO_VAR_PREFIX = "--studio-"

/** Studio var name → its fully resolved CSS value. */
export type StudioVars = ReadonlyMap<string, string>

/* ------------------------------ var → value ------------------------------ */

/** Preset tokens may name a token bare (`--radius-md`); CSS wants `var()`. */
function asCssValue(value: string): string {
  const trimmed = value.trim()
  return /^--[\w-]+$/.test(trimmed) ? `var(${trimmed})` : trimmed
}

/**
 * Resolve every studio var in `sources` (later entries win) to a final value.
 * Non-studio entries are ignored, so callers can spread whole token maps in.
 */
export function resolveStudioVars(
  sources: Record<string, string | undefined>,
): Map<string, string> {
  const raw = new Map<string, string>()
  for (const [name, value] of Object.entries(sources)) {
    if (name.startsWith(STUDIO_VAR_PREFIX) && value !== undefined)
      raw.set(name, asCssValue(value))
  }
  const out = new Map<string, string>()
  const resolve = (name: string, depth: number): string | undefined => {
    if (out.has(name)) return out.get(name)
    const value = raw.get(name)
    if (value === undefined) return undefined
    if (depth > 8) throw new Error(`Studio var cycle through ${name}`)
    const { text } = substituteVarReads(value, (ref) => resolve(ref, depth + 1))
    out.set(name, text)
    return text
  }
  for (const name of raw.keys()) resolve(name, 0)
  return out
}

/** The vars the selected enum-param values carry (`field.error = bar`). */
export function paramVars(
  meta: RegistryItem,
  selections: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [name, def] of Object.entries(meta.params ?? {})) {
    const enumDef = def as EnumParamDef
    if (enumDef.kind !== "enum") continue
    Object.assign(out, enumDef.vars?.[selections[name] ?? enumDef.default])
  }
  return out
}

/* ------------------------------ substitution ----------------------------- */

type Lookup = (name: string) => string | undefined

/**
 * Replace every `var(--studio-x)` / `var(--studio-x, fallback)` read in
 * `text` with its value (or the fallback). Reads with no value and no
 * fallback are left in place and reported.
 */
function substituteVarReads(
  text: string,
  lookup: Lookup,
): { text: string; unresolved: string[] } {
  const unresolved: string[] = []
  const marker = `var(${STUDIO_VAR_PREFIX}`
  let out = text
  let from = 0
  for (;;) {
    const start = out.indexOf(marker, from)
    if (start === -1) break
    const argStart = start + "var(".length
    const name = /^--[\w-]+/.exec(out.slice(argStart))?.[0] ?? ""
    const nameEnd = argStart + name.length
    // Match the closing paren, skipping nested `calc()` / `var()` in the fallback.
    let depth = 1
    let i = nameEnd
    for (; i < out.length && depth > 0; i++) {
      if (out[i] === "(") depth++
      else if (out[i] === ")") depth--
    }
    const inner = out.slice(nameEnd, i - 1).trim()
    const fallback = inner.startsWith(",") ? inner.slice(1).trim() : undefined
    const value = lookup(name) ?? fallback
    if (value === undefined) {
      unresolved.push(name)
      from = i
      continue
    }
    out = out.slice(0, start) + value + out.slice(i)
    // A fallback may itself read a studio var — rescan from here.
    from = start
  }
  return { text: out, unresolved }
}

/* ----------------------------- class rewrite ----------------------------- */

/**
 * The utility suffix a resolved value maps to, or undefined for an arbitrary
 * value. Theme tokens map by name (`var(--radius-md)` → `md`); spacing by
 * multiplier; the shadow literal the registry's defaults use by utility.
 */
function utilitySuffix(utility: string, value: string): string | undefined {
  const token =
    /^var\(--(?:radius|shadow|blur|cursor|color|font-weight)-([\w.]+)\)$/.exec(
      value,
    )
  if (token) return token[1]
  const spacing =
    /^--spacing\(([\d.]+)\)$/.exec(value) ??
    /^calc\(var\(--spacing\)\s*\*\s*([\d.]+)\)$/.exec(value)
  if (spacing) return spacing[1]
  if (value === "0 0 #0000" && utility === "shadow") return "none"
  return undefined
}

/**
 * Rewrite one class string (or any text carrying class names). A rounded
 * utility whose var resolves to `0` is dropped with its variant prefix — a
 * square system ships no rounded class, not `rounded-none`.
 */
export function rewriteClassString(input: string, vars: StudioVars): string {
  if (vars.size === 0 && !input.includes(STUDIO_VAR_PREFIX)) return input
  // lead · variants (`max-md:`, `**:data-x:`, `*:[img]:first:`) · utility · var · trail
  const shorthand = new RegExp(
    `( ?)((?:[\\w\\[\\]*&>./=-]+:)*)([a-z][a-z0-9-]*)-\\((${STUDIO_VAR_PREFIX}[\\w-]+)\\)( ?)`,
    "g",
  )
  let dropped = false
  // An arbitrary radius derived from a 0 role (`calc(var(--r)-1px)`) is 0 too;
  // substituted, it would ship invalid CSS (`calc(0-1px)`).
  const arbitraryRadius =
    /( ?)((?:[\w[\]*&>./=-]+:)*)(rounded[a-z-]*)-\[([^\s\]]+)\]( ?)/g
  let rewritten = input.replace(
    arbitraryRadius,
    (match, lead: string, _variants, _utility, value: string, trail) => {
      const reads = value.matchAll(/var\((--studio-[\w-]+)/g)
      if (![...reads].some(([, name]) => vars.get(name!) === "0")) return match
      dropped = true
      return lead && trail ? " " : ""
    },
  )
  rewritten = rewritten.replace(
    shorthand,
    (match, lead, variants, utility, name, trail) => {
      const value = vars.get(name)
      if (value === undefined) return match
      if (value === "0" && utility.startsWith("rounded")) {
        dropped = true
        return lead && trail ? " " : ""
      }
      const suffix = utilitySuffix(utility, value)
      if (suffix !== undefined)
        return `${lead}${variants}${utility}-${suffix}${trail}`
      const ref = /^var\((--[\w-]+)\)$/.exec(value)
      if (ref) return `${lead}${variants}${utility}-(${ref[1]})${trail}`
      return `${lead}${variants}${utility}-[${value.replace(/\s+/g, "_")}]${trail}`
    },
  )
  // A drop at either end of a class string leaves a stray space; file
  // content (markup around the tv config) keeps its whitespace.
  if (dropped && !/["'`\n]/.test(input)) rewritten = rewritten.trim()
  return substituteVarReads(rewritten, (name) => vars.get(name)).text
}

function rewriteClassValue(
  value: ClassValue | undefined,
  vars: StudioVars,
): ClassValue | undefined {
  if (value == null || value === false) return value
  if (typeof value === "string") return rewriteClassString(value, vars)
  if (Array.isArray(value)) {
    // A dropped rounded class can empty a group; the group goes with it.
    return value
      .map((v) => rewriteClassValue(v, vars) as string | string[])
      .filter((v) => v !== "") as ClassValue
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
  vars: StudioVars,
): VariantSliceValue | undefined {
  if (value === undefined) return undefined
  if (isSlotMap(value)) {
    const result: Record<string, ClassValue> = {}
    for (const [slot, slotValue] of Object.entries(value)) {
      const rewritten = rewriteClassValue(slotValue, vars)
      if (rewritten !== undefined) result[slot] = rewritten
    }
    return result
  }
  return rewriteClassValue(value, vars)
}

/**
 * Walk a flat tv layer and rewrite all class strings.
 * Returns a new layer; the input is not mutated.
 */
export function resolveClasses(layer: TvLayer, vars: StudioVars): TvLayer {
  const out: TvLayer = {}

  if (layer.base !== undefined) {
    out.base = rewriteClassValue(layer.base, vars)
  }

  if (layer.slots) {
    const slots: Record<string, ClassValue> = {}
    for (const [k, v] of Object.entries(layer.slots)) {
      const rewritten = rewriteClassValue(v, vars)
      if (rewritten !== undefined) slots[k] = rewritten
    }
    out.slots = slots
  }

  if (layer.variants) {
    const variants: NonNullable<TvLayer["variants"]> = {}
    for (const [variantName, values] of Object.entries(layer.variants)) {
      const valuesOut: Record<string, VariantSliceValue> = {}
      for (const [valueName, sliceValue] of Object.entries(values)) {
        const rewritten = rewriteVariantSlice(sliceValue, vars)
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
          const rewritten = rewriteClassValue(v as ClassValue, vars)
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

/* ------------------------------- css fields ------------------------------ */

type CssValue = string | CssObject
interface CssObject {
  [key: string]: CssValue
}

/**
 * Resolve a registry item's `css` field: the studio defaults themselves are
 * dropped, reads inside shipped rules are substituted, and a declaration
 * reading an unset studio var goes too — it's invalid at computed-value time
 * live, so dropping it is what the browser already does. Selectors emptied by
 * that are dropped; originally-empty entries (`@plugin` statements) stay.
 */
export function resolveCssFields(
  css: RegistryItem["css"],
  vars: StudioVars,
): RegistryItem["css"] | undefined {
  if (!css) return css
  const visit = (node: CssObject): CssObject | undefined => {
    const out: CssObject = {}
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        if (key.startsWith(STUDIO_VAR_PREFIX)) continue
        const { text, unresolved } = substituteVarReads(value, (name) =>
          vars.get(name),
        )
        if (unresolved.length === 0) out[key] = text
        continue
      }
      const child = visit(value)
      if (child !== undefined || Object.keys(value).length === 0)
        out[key] = child ?? {}
    }
    return Object.keys(out).length > 0 ? out : undefined
  }
  return visit(css as CssObject) as RegistryItem["css"] | undefined
}

/** Shipped output must carry no studio var — the export owns its values. */
export function assertNoStudioVars(text: string, where: string): void {
  const hits = [
    ...new Set(text.match(new RegExp(`${STUDIO_VAR_PREFIX}[\\w-]+`, "g"))),
  ]
  if (hits.length === 0) return
  throw new Error(
    `${where}: unresolved studio vars ${hits.join(", ")} — declare a default in the component's styles.css`,
  )
}
