/**
 * `registry:font` items.
 *
 * shadcn installs a font per framework from one of these — on Next.js it wires
 * `next/font/google` into the root layout, elsewhere it adds the `@fontsource`
 * package and imports it — and sets the token's CSS variable either way. The
 * init item references one per font token the preset sets (see emit-theme)
 * instead of appending a Google Fonts `@import url()` to the consumer's
 * stylesheet: shadcn's CSS updater inserts registry imports after
 * `@import "tailwindcss"`, which is invalid once Tailwind expands, and
 * bundlers drop it silently (the examples smoke caught this).
 *
 * Names follow shadcn's own registry: `font-<slug>` for the body face
 * (`--font-sans`), `font-heading-<slug>` for `--font-heading`, plus
 * `font-mono-<slug>` for `--font-mono`. Slugs double as the fontsource
 * package names (`Source Sans 3` → `source-sans-3`).
 */

import {
  familyFromStack,
  FONT_CATALOG,
  FONT_HEADING_VAR,
  FONT_MONO_VAR,
  FONT_SANS_VAR,
  FONT_TOKEN_VARS,
  fontStack,
} from "@/lib/fonts"
import type { RegistryItem } from "@/registry/types"

type FontTokenVar = (typeof FONT_TOKEN_VARS)[number]

const NAME_PREFIX: Record<FontTokenVar, string> = {
  [FONT_SANS_VAR]: "font-",
  [FONT_HEADING_VAR]: "font-heading-",
  [FONT_MONO_VAR]: "font-mono-",
}

// Longest prefix first so `font-heading-x` never parses as the body face
// `heading-x`.
const PARSE_ORDER: FontTokenVar[] = [
  FONT_HEADING_VAR,
  FONT_MONO_VAR,
  FONT_SANS_VAR,
]

const FAMILY_BY_SLUG = new Map(
  FONT_CATALOG.map((font) => [fontSlug(font.family), font.family]),
)

export function fontSlug(family: string): string {
  return family.toLowerCase().replaceAll(" ", "-")
}

export function fontItemName(variable: FontTokenVar, family: string): string {
  return `${NAME_PREFIX[variable]}${fontSlug(family)}`
}

/** The font item each font token of a preset needs, in token order. */
export function fontItemNamesForTokens(
  tokens: Record<string, string>,
): string[] {
  const names: string[] = []
  for (const variable of FONT_TOKEN_VARS) {
    const stack = tokens[variable]
    if (!stack) continue
    const family = familyFromStack(stack)
    if (!FAMILY_BY_SLUG.has(fontSlug(family))) continue
    names.push(fontItemName(variable, family))
  }
  return names
}

export function parseFontItemName(
  name: string,
): { variable: FontTokenVar; family: string } | undefined {
  for (const variable of PARSE_ORDER) {
    const prefix = NAME_PREFIX[variable]
    if (!name.startsWith(prefix)) continue
    const family = FAMILY_BY_SLUG.get(name.slice(prefix.length))
    return family ? { variable, family } : undefined
  }
  return undefined
}

export function emitFontItem(name: string): RegistryItem | undefined {
  const parsed = parseFontItemName(name)
  if (!parsed) return undefined
  const { variable, family } = parsed
  const role =
    variable === FONT_HEADING_VAR
      ? " (Heading)"
      : variable === FONT_MONO_VAR
        ? " (Mono)"
        : ""
  const item = {
    name,
    type: "registry:font",
    title: `${family}${role}`,
    font: {
      // fontsource registers variable faces as "<Family> Variable"; next/font
      // ignores `family` and sets the variable itself.
      family: fontStack(family).replace(`'${family}'`, `'${family} Variable'`),
      provider: "google",
      // The `next/font/google` export: the family with spaces as underscores.
      import: family.replaceAll(" ", "_"),
      variable,
      subsets: ["latin"],
      dependency: `@fontsource-variable/${fontSlug(family)}`,
    },
  }
  return item as unknown as RegistryItem
}
