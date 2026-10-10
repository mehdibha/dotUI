/* Typography: the three font roles, resolved onto the font catalog. */

import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  FONT_CATALOG,
} from "@/lib/fonts"
import type { FontCategory } from "@/lib/fonts"

import { add, statusOf } from "./context"
import type { Ctx } from "./context"
import { dim, isRecord, proseFonts, sentences } from "./parse"
import type { FontRole } from "./parse"

type Category = "sans" | "serif" | "mono"

const CATALOG = new Map(
  FONT_CATALOG.map((font) => [normalizeFamily(font.family), font]),
)
const SUBSTITUTE =
  /substitut|fallback|alternative|closest|approximat|similar|in place of/i
const CATEGORY: Partial<Record<FontCategory, Category>> = {
  "sans-serif": "sans",
  serif: "serif",
  mono: "mono",
}
const FAMILY_MATCHER = new RegExp(
  `(?<![A-Za-z0-9])(${FONT_CATALOG.filter((font) => CATEGORY[font.category])
    .map((font) => font.family)
    .sort((a, b) => b.length - a.length)
    .map((family) => family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})(?![A-Za-z0-9])`,
  "g",
)
const GENERIC: Record<string, Category> = {
  "system-ui": "sans",
  "-apple-system": "sans",
  blinkmacsystemfont: "sans",
  "ui-sans-serif": "sans",
  "sans-serif": "sans",
  "segoe ui": "sans",
  "ui-serif": "serif",
  serif: "serif",
  monospace: "mono",
  "ui-monospace": "mono",
}
const ALIASES: [RegExp, string][] = [
  [
    /^(sf pro|helvetica|arial$|neue haas|haas|söhne|sohne|system-ui$)/i,
    "Inter",
  ],
  [/^(georgia$|times|tiempos|copernicus$)/i, "Source Serif 4"],
]

function normalizeFamily(name: string) {
  return name.toLowerCase().replace(/[\s_'"-]+/g, "")
}

function catalogFamily(name: string): string | undefined {
  const tries = [name, name.replace(/[\s-]*(variable|vf|var)$/i, "")]
  tries.push(tries[1]!.replace(/[\s-]+(display|text|sans)$/i, ""))
  for (const candidate of tries) {
    const hit = CATALOG.get(normalizeFamily(candidate))
    if (hit) return hit.family
  }
}

interface Resolution {
  family: string
  exact: boolean
  label: string
}

export function resolveFamily(
  stack: string,
  role: FontRole,
  typographyProse: string,
): Resolution {
  const entries = stack
    .split(",")
    .map((entry) =>
      entry
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .trim(),
    )
    .filter(Boolean)
  let hint: Category | undefined
  for (const [i, entry] of entries.entries()) {
    const generic = GENERIC[entry.toLowerCase()]
    if (generic || entry.toLowerCase().startsWith("ui-")) {
      hint ??= generic
      continue
    }
    const family = catalogFamily(entry)
    if (family)
      return i === 0
        ? { family, exact: true, label: "Font from the file" }
        : { family, exact: false, label: "Used the file's listed fallback" }
  }
  const want: Category =
    role === "mono" || hint === "mono"
      ? "mono"
      : role === "heading" && hint === "serif"
        ? "serif"
        : "sans"
  // Code spans are CSS stacks, not named substitutes.
  for (const sentence of sentences(typographyProse.replace(/`[^`]*`/g, ""))) {
    if (!SUBSTITUTE.test(sentence)) continue
    for (const match of sentence.matchAll(FAMILY_MATCHER)) {
      const font = CATALOG.get(normalizeFamily(match[1]!))
      if (font && CATEGORY[font.category] === want)
        return {
          family: font.family,
          exact: false,
          label: "Substitute named in the file",
        }
    }
  }
  for (const entry of entries)
    for (const [pattern, family] of ALIASES)
      if (pattern.test(entry))
        return { family, exact: false, label: "Closest open alternative" }
  const fallback =
    hint === "mono" || role === "mono"
      ? DEFAULT_MONO_FAMILY
      : hint === "serif"
        ? "Source Serif 4"
        : DEFAULT_BODY_FAMILY
  return {
    family: fallback,
    exact: false,
    label: "No open match; used the default",
  }
}

const familyOf = (entry: Record<string, unknown>) => {
  const value = entry.fontFamily
  return Array.isArray(value)
    ? value.join(", ")
    : typeof value === "string"
      ? value
      : undefined
}

function mostFrequent(values: (string | undefined)[]): string | undefined {
  const counts = new Map<string, number>()
  for (const value of values)
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  let best: string | undefined
  for (const [value, count] of counts)
    if (best === undefined || count > counts.get(best)!) best = value
  return best
}

export function mapTypography(ctx: Ctx, proseOnly: boolean) {
  const { doc, state } = ctx
  const typography = doc.tokens?.typography
  const entries = isRecord(typography)
    ? Object.entries(typography).filter(
        (e): e is [string, Record<string, unknown>] => isRecord(e[1]),
      )
    : []
  const prose = doc.sections.typography ?? doc.prose

  const stacks: Partial<Record<FontRole, { stack: string; source: string }>> =
    {}
  if (entries.length > 0 && !proseOnly) {
    const named = (re: RegExp) =>
      entries.filter(([name]) => re.test(name.toLowerCase()))
    const body = named(/^body/)
    let bodyEntry = body.sort(
      (a, b) =>
        Math.abs((dim(a[1].fontSize) ?? Infinity) - 16) -
        Math.abs((dim(b[1].fontSize) ?? Infinity) - 16),
    )[0]
    bodyEntry ??= named(/^(text|paragraph|copy)/)[0]
    const bodyStack = bodyEntry
      ? familyOf(bodyEntry[1])
      : mostFrequent(entries.map(([, e]) => familyOf(e)))
    if (bodyStack)
      stacks.body = {
        stack: bodyStack,
        source: bodyEntry ? `typography.${bodyEntry[0]}` : "typography",
      }
    const heading = mostFrequent(
      named(/^(display|headline|heading|h[1-3]|title|hero)/).map(([, e]) =>
        familyOf(e),
      ),
    )
    if (heading) stacks.heading = { stack: heading, source: "typography" }
    const mono = mostFrequent(
      entries
        .filter(
          ([name, e]) =>
            /mono|code/.test(name.toLowerCase()) ||
            /monospace|mono/i.test(familyOf(e) ?? ""),
        )
        .map(([, e]) => familyOf(e)),
    )
    if (mono) stacks.mono = { stack: mono, source: "typography" }
  } else {
    for (const [role, stack] of Object.entries(proseFonts(prose)))
      stacks[role as FontRole] = { stack, source: "prose: Typography" }
  }

  const resolved: Partial<Record<FontRole, Resolution>> = {}
  for (const role of ["body", "heading", "mono"] as const) {
    const entry = stacks[role]
    if (!entry) continue
    const resolution = resolveFamily(entry.stack, role, prose)
    resolved[role] = resolution
    const prosey = proseOnly || entry.source.startsWith("prose")
    const key =
      role === "body"
        ? "bodyFont"
        : role === "mono"
          ? "monoFont"
          : "headingFont"
    let result = resolution.family
    if (role === "body" && resolution.family !== DEFAULT_BODY_FAMILY)
      state.bodyFont = resolution.family
    if (role === "mono" && resolution.family !== DEFAULT_MONO_FAMILY)
      state.monoFont = resolution.family
    if (role === "heading") {
      const same =
        resolution.family === (resolved.body?.family ?? DEFAULT_BODY_FAMILY)
      state.headingFont = same ? "" : resolution.family
      if (same) result = `${resolution.family} (same as body)`
    }
    add(ctx, statusOf(resolution.exact && !prosey), "typography", {
      id: `font:${role}`,
      label: resolution.label,
      source: entry.source,
      keys: [key],
      value: entry.stack,
      result,
    })
  }

  const all = entries.map(([, e]) => e)
  const some = (test: (e: Record<string, unknown>) => boolean) => all.some(test)
  if (some((e) => e.fontSize !== undefined || e.lineHeight !== undefined))
    add(ctx, "unmapped", "typography", {
      id: "type-scale",
      label: "Type scale: sizes and line heights have no axis",
    })
  if (some((e) => e.fontWeight !== undefined))
    add(ctx, "unmapped", "typography", {
      id: "type-weights",
      label: "Font weights have no axis",
    })
  if (
    some((e) => {
      const value = e.letterSpacing
      if (value === undefined || value === null) return false
      const n = dim(value)
      return n === undefined
        ? !/^(normal|0\w*)$/i.test(String(value).trim())
        : n !== 0
    })
  )
    add(ctx, "unmapped", "typography", {
      id: "type-tracking",
      label: "Letter spacing has no axis",
    })
  if (
    some((e) => Object.keys(e).some((k) => /^font(Feature|Variation)/.test(k)))
  )
    add(ctx, "unmapped", "typography", {
      id: "font-features",
      label: "Font features and variations have no axis",
    })
}
