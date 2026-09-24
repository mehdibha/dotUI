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
 *   duration-(--studio-popover-enter-duration) → duration-200
 *   ease-(--studio-popover-ease)               → ease-out · ease-[cubic-bezier(…)]
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

/** Tailwind's named curves, keyed by their whitespace-free value. */
const NAMED_EASES: Record<string, string> = {
  "cubic-bezier(0,0,0.2,1)": "out",
  "cubic-bezier(0.4,0,1,1)": "in",
  "cubic-bezier(0.4,0,0.2,1)": "in-out",
  linear: "linear",
}

/**
 * The utility suffix a resolved value maps to, or undefined for an arbitrary
 * value. Theme tokens map by name (`var(--radius-md)` → `md`); spacing by
 * multiplier; the shadow literal the registry's defaults use by utility;
 * whole milliseconds and Tailwind's named curves by motion utility.
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
  if (utility === "duration") {
    const [, n, unit] = /^([\d.]+)(ms|s)?$/.exec(value) ?? []
    const ms = Number(n) * (unit === "s" ? 1000 : 1)
    return Number.isInteger(ms) ? String(ms) : undefined
  }
  if (utility === "ease")
    return (
      /^var\(--ease-(in|out|in-out)\)$/.exec(value)?.[1] ??
      NAMED_EASES[value.replace(/\s+/g, "")]
    )
  return undefined
}

/* A motion read that changes nothing ships no class: an unprefixed duration
   or ease at Tailwind's transition default (150ms, ease-in-out) beside an
   unprefixed transition utility, which already sets it — unless tw-animate's
   `animate-in` / `animate-out` there reads it too, with defaults of its own; a
   variant-prefixed one equal to its unprefixed sibling, which it would
   override with itself. */
const TRANSITION_DEFAULT: Record<string, string> = {
  duration: "150",
  ease: "in-out",
}
const HAS_TRANSITION =
  /(?:^|\s)transition(?:-(?!none\b|discrete\b|normal\b)\S+)?(?=\s|$)/
const HAS_ANIMATION = /(?:^|[\s:])animate-(?:in|out)(?=\s|$)/

/** The shipped form of one studio read: `duration-200`, `ease-[…]`. */
function resolvedUtility(utility: string, value: string): string {
  const suffix = utilitySuffix(utility, value)
  if (suffix !== undefined) return `${utility}-${suffix}`
  const ref = /^var\((--[\w-]+)\)$/.exec(value)
  if (ref) return `${utility}-(${ref[1]})`
  // Curves drop the spaces after commas; `linear()` stops keep theirs as `_`.
  const arbitrary = utility === "ease" ? value.replace(/\s*,\s*/g, ",") : value
  return `${utility}-[${arbitrary.replace(/\s+/g, "_")}]`
}

function isNoopMotion(
  variants: string,
  utility: string,
  value: string,
  context: string,
  vars: StudioVars,
): boolean {
  if (!(utility in TRANSITION_DEFAULT)) return false
  const shipped = resolvedUtility(utility, value)
  if (!variants)
    return (
      shipped === `${utility}-${TRANSITION_DEFAULT[utility]}` &&
      HAS_TRANSITION.test(context) &&
      !HAS_ANIMATION.test(context)
    )
  const sibling = new RegExp(
    `(?:^|\\s)${utility}-\\((${STUDIO_VAR_PREFIX}[\\w-]+)\\)(?=\\s|$)`,
  ).exec(context)?.[1]
  const siblingValue = sibling && vars.get(sibling)
  if (
    siblingValue === undefined ||
    resolvedUtility(utility, siblingValue) !== shipped
  )
    return false
  // It stays when it beats a broader prefixed one (`a:duration-x` under
  // `a:b:duration-y`), whose every variant it also wears.
  const own = variants.slice(0, -1).split(":")
  return !context.split(/\s+/).some((cls) => {
    const prefix = new RegExp(`^(.+?):${utility}-`).exec(cls)?.[1]
    if (!prefix || prefix === own.join(":")) return false
    return prefix.split(":").every((v) => own.includes(v))
  })
}

/**
 * Rewrite one class string (or any text carrying class names). A rounded
 * utility whose var resolves to `0` is dropped with its variant prefix — a
 * square system ships no rounded class, not `rounded-none` — and so is a
 * no-op motion read. `context` is every class the element wears (the whole
 * slot), which those motion drops are judged against.
 */
export function rewriteClassString(
  input: string,
  vars: StudioVars,
  context = input,
): string {
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
      if (
        (value === "0" && utility.startsWith("rounded")) ||
        isNoopMotion(variants, utility, value, context, vars)
      ) {
        dropped = true
        return lead && trail ? " " : ""
      }
      return `${lead}${variants}${resolvedUtility(utility, value)}${trail}`
    },
  )
  // A drop at either end of a class string leaves a stray space; file
  // content (markup around the tv config) keeps its whitespace.
  if (dropped && !/["'`\n]/.test(input)) rewritten = rewritten.trim()
  return substituteVarReads(rewritten, (name) => vars.get(name)).text
}

/** Every class in a value, space-joined — the context a slot's reads share. */
function classText(...values: (ClassValue | undefined)[]): string {
  return values
    .flatMap((v) =>
      typeof v === "string" ? [v] : Array.isArray(v) ? [classText(...v)] : [],
    )
    .join(" ")
}

function rewriteClassValue(
  value: ClassValue | undefined,
  vars: StudioVars,
  context = classText(value),
): ClassValue | undefined {
  if (value == null || value === false) return value
  if (typeof value === "string") return rewriteClassString(value, vars, context)
  if (Array.isArray(value)) {
    // A dropped class can empty a group; the group goes with it.
    return value
      .map((v) => rewriteClassValue(v, vars, context) as string | string[])
      .filter((v) => v !== "") as ClassValue
  }
  return value
}

function isSlotMap(
  value: VariantSliceValue | undefined,
): value is Record<string, ClassValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** A variant slice is judged with the base classes of the slot it lands on. */
function rewriteVariantSlice(
  value: VariantSliceValue | undefined,
  vars: StudioVars,
  layer: TvLayer,
): VariantSliceValue | undefined {
  if (value === undefined) return undefined
  if (isSlotMap(value)) {
    const result: Record<string, ClassValue> = {}
    for (const [slot, slotValue] of Object.entries(value)) {
      const context = classText(slotValue, layer.slots?.[slot])
      const rewritten = rewriteClassValue(slotValue, vars, context)
      if (rewritten !== undefined) result[slot] = rewritten
    }
    return result
  }
  return rewriteClassValue(value, vars, classText(value, layer.base))
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
        const rewritten = rewriteVariantSlice(sliceValue, vars, layer)
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
          const rewritten = rewriteClassValue(
            v as ClassValue,
            vars,
            classText(v as ClassValue, layer.base),
          )
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
