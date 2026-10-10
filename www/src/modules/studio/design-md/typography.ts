import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_MONO_FAMILY,
  FONT_CATALOG,
} from "@/lib/fonts"
import type { FontCategory, FontOption } from "@/lib/fonts"

import { add, statusOf } from "./context"
import type { Ctx } from "./context"
import { dim, escapeRegExp, isRecord, proseFonts, sentences } from "./parse"
import type { FontRole } from "./parse"

type Category = "sans" | "serif" | "mono"

const CATALOG = new Map(
  FONT_CATALOG.map((font) => [normalizeFamily(font.family), font]),
)
const STRONG_SUBSTITUTE =
  /substitut|alternative|closest|approximat|similar|in place of|stand[- ]in|replace/i
const SUBSTITUTE =
  /substitut|fallback|falls back|alternative|closest|approximat|similar|in place of|stand[- ]in|replace/i
const ROLE_WORD: Record<FontRole, RegExp> = {
  body: /\b(body|UI|text|paragraph|copy)\b/i,
  heading: /\b(display|headings?|headlines?|titles?|hero)\b/i,
  mono: /\b(mono|code)\b/i,
}
const CATEGORY: Partial<Record<FontCategory, Category>> = {
  "sans-serif": "sans",
  serif: "serif",
  mono: "mono",
}
const FAMILY_MATCHER = new RegExp(
  `(?<![A-Za-z0-9])(${FONT_CATALOG.filter((font) => CATEGORY[font.category])
    .map((font) => font.family)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
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
const MONO_STACK = /mono|courier|consolas|menlo|monaco|\bcode\b/i

function normalizeFamily(name: string) {
  return name.toLowerCase().replace(/[\s_'"-]+/g, "")
}

function catalogFont(name: string): FontOption | undefined {
  const bare = name.replace(/[\s-]*(variable|vf|var)$/i, "")
  for (const candidate of [
    name,
    bare,
    bare.replace(/[\s-]+(display|text|sans)$/i, ""),
  ]) {
    const hit = CATALOG.get(normalizeFamily(candidate))
    if (hit) return hit
  }
}

const categoryOf = (family: string): Category | undefined => {
  const font = CATALOG.get(normalizeFamily(family))
  return font && CATEGORY[font.category]
}

// Case-sensitive, so "PolySans" isn't mentioned by "PolySans Mono".
const nameRe = (name: string) =>
  `(?<![\\w-])${escapeRegExp(name)}(?![\\w-]|\\s[A-Z])`
const mentions = (text: string, name: string) =>
  new RegExp(nameRe(name)).test(text)

// The category a line opening with the face gives it: "**Apercu** — a sans".
function proseCategory(prose: string, face: string): Category | undefined {
  const opens = new RegExp(`^[\\s>*_\\d.-]*${nameRe(face)}\\**\\s*([(—–:-]|$)`)
  for (const line of prose.split("\n")) {
    if (!opens.test(line)) continue
    const word = /\b(mono(?:space|spaced)?|sans(?:-serif)?|serif)\b/i
      .exec(line.replace(opens, ""))?.[1]
      ?.toLowerCase()
    if (word?.startsWith("mono")) return "mono"
    if (word) return word === "serif" ? "serif" : "sans"
  }
}

// Prose cut into clauses, so "A stands in for X, and B for Y" splits.
const clausesOf = (text: string) =>
  sentences(text.replace(/`[^`]*`/g, "")).flatMap((s) =>
    s.split(/[,;]\s+(?=and\b|while\b|but\b)|;\s+/),
  )

interface Substitute {
  clause: string
  line: string
  // "Falls back to system-ui (… Roboto …)" names what renders, not a pick.
  weak: boolean
}

// Lines under a "substitutes" heading count as substitute sentences.
function substituteClauses(prose: string): Substitute[] {
  const picked: Substitute[] = []
  let underHeading = false
  for (const line of prose.split("\n")) {
    const heading = /^#{2,4}\s+(.*)$/.exec(line)?.[1]
    if (heading !== undefined) underHeading = SUBSTITUTE.test(heading)
    for (const clause of clausesOf(line))
      if (underHeading || SUBSTITUTE.test(clause))
        picked.push({
          clause,
          line,
          weak:
            !STRONG_SUBSTITUTE.test(clause) &&
            /falls? back|fallback/i.test(clause),
        })
  }
  return picked
}

interface Resolution {
  family: string
  exact: boolean
  label: string
}

const splitStack = (stack: string) =>
  stack
    .split(",")
    .map((entry) =>
      entry
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .trim(),
    )
    .filter(Boolean)

const isGeneric = (entry: string) =>
  GENERIC[entry.toLowerCase()] !== undefined ||
  entry.toLowerCase().startsWith("ui-")

// The first named face of a stack, for matching it in prose.
export const faceOf = (stack: string) =>
  splitStack(stack).find((entry) => !isGeneric(entry))

export function resolveFamily(
  stack: string,
  role: FontRole,
  typographyProse: string,
  otherFaces: string[] = [],
): Resolution {
  const entries = splitStack(stack)
  let hint: Category | undefined
  for (const [i, entry] of entries.entries()) {
    if (isGeneric(entry)) {
      hint ??= GENERIC[entry.toLowerCase()]
      continue
    }
    const font = catalogFont(entry)
    if (!font || (role === "mono" && font.category !== "mono")) continue
    return i === 0
      ? { family: font.family, exact: true, label: "Font from the file" }
      : {
          family: font.family,
          exact: false,
          label: "Used the file's listed fallback",
        }
  }

  const face = faceOf(stack)
  hint ??= face ? proseCategory(typographyProse, face) : undefined
  const want: Category =
    role === "mono" || hint === "mono" ? "mono" : (hint ?? "sans")

  // This face's substitutes first; a bare "fallback: …" list is its line's.
  const substitutes = substituteClauses(typographyProse)
  const others = otherFaces.filter((other) => other !== face)
  const free = (text: string) => !others.some((other) => mentions(text, other))
  const passes = face
    ? [
        substitutes.filter(({ clause }) => mentions(clause, face)),
        substitutes.filter(
          ({ clause, line }) => mentions(line, face) && free(clause),
        ),
      ]
    : []
  passes.push(
    substitutes.filter(
      ({ clause }) => free(clause) && !/fallbacks?\s*:/i.test(clause),
    ),
  )
  // Within a pass: real substitutes first, then ones that name the role.
  const rank = ({ clause, weak }: Substitute) =>
    (weak ? 2 : 0) + (ROLE_WORD[role].test(clause) ? 0 : 1)
  for (const pass of passes)
    for (const { clause } of pass.sort((a, b) => rank(a) - rank(b)))
      for (const match of clause.matchAll(FAMILY_MATCHER)) {
        const family = match[1] ?? ""
        if (categoryOf(family) === want)
          return {
            family: CATALOG.get(normalizeFamily(family))?.family ?? family,
            exact: false,
            label: "Substitute named in the file",
          }
      }

  for (const entry of entries)
    for (const [pattern, family] of ALIASES)
      if (pattern.test(entry) && categoryOf(family) === want)
        return { family, exact: false, label: "Closest open alternative" }
  const fallback =
    want === "mono"
      ? DEFAULT_MONO_FAMILY
      : want === "serif"
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
  let best: { value: string; count: number } | undefined
  for (const [value, count] of counts)
    if (!best || count > best.count) best = { value, count }
  return best?.value
}

const ROLE_KEY = {
  body: "bodyFont",
  heading: "headingFont",
  mono: "monoFont",
} as const

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
    const monoStacks = entries
      .filter(
        ([name, e]) =>
          /mono|code/.test(name.toLowerCase()) ||
          /monospace|mono/i.test(familyOf(e) ?? ""),
      )
      .map(([, e]) => familyOf(e))
    // An entry named `*-mono` may still set a sans; prefer monospace stacks.
    const monospaced = monoStacks.filter((s) => s && MONO_STACK.test(s))
    const mono = mostFrequent(monospaced.length > 0 ? monospaced : monoStacks)
    if (mono) stacks.mono = { stack: mono, source: "typography" }
  } else {
    for (const [role, stack] of Object.entries(proseFonts(prose)))
      stacks[role as FontRole] = { stack, source: "prose: Typography" }
  }

  const faces = [
    ...new Set(
      [
        ...entries.map(([, e]) => familyOf(e)),
        ...Object.values(stacks).map((s) => s.stack),
      ].flatMap((stack) => {
        const face = stack ? faceOf(stack) : undefined
        return face && !catalogFont(face) ? [face] : []
      }),
    ),
  ]

  const resolved: Partial<Record<FontRole, Resolution>> = {}
  for (const role of ["body", "heading", "mono"] as const) {
    const entry = stacks[role]
    if (!entry) continue
    const resolution = resolveFamily(entry.stack, role, prose, faces)
    resolved[role] = resolution
    const prosey = proseOnly || entry.source.startsWith("prose")
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
      keys: [ROLE_KEY[role]],
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
