/**
 * Render the semantic vocabulary to CSS.
 *
 * Two renderings of the same vocabulary:
 * - **Referenced** (`resolveTarget`, `emitCss`, `emitDarkOverridesCss`) —
 *   tokens point at the primitive ramps (`var(--neutral-25)`). This is what
 *   the site and the studio run on: the ramps stay live so scoped previews
 *   and per-token remaps recompute from them. Generated into
 *   `base/colors.css` by `pnpm build:registry`.
 * - **Literal** (`resolveTargetLiteral`, `semanticLiterals`) — every token is
 *   flattened to its `oklch()` value per mode, mixes computed. This is what
 *   users receive: the exported theme ships semantic tokens only, no ramps.
 */

import {
  fitSrgb,
  mixOklab,
  type ModeOutput,
  oklchCss,
  type Theme,
  toOklch,
} from "@dotui/colors"

import type {
  ModeName,
  SemanticTarget,
  SemanticToken,
  SemanticVocabulary,
} from "./types"

/** Resolve a single {@link SemanticTarget} to its CSS value string. */
export function resolveTarget(target: SemanticTarget): string {
  if ("ref" in target) return `var(--${target.ref.palette}-${target.ref.step})`
  if ("on" in target) return `var(--on-${target.on.palette}-${target.on.step})`
  if ("value" in target) return target.value
  const [a, weight, b] = target.mix
  return `color-mix(in oklab, ${resolveTarget(a)} ${weight}%, ${resolveTarget(b)})`
}

function primitive(
  mode: ModeOutput,
  kind: "scales" | "on",
  palette: string,
  step: string,
): string {
  const value = (mode[kind][palette] as Record<string, string> | undefined)?.[
    step
  ]
  if (!value)
    throw new Error(
      `@/registry/theme: no ${kind} primitive for ${palette}-${step}`,
    )
  return value
}

/** Resolve a {@link SemanticTarget} to a literal color for one engine mode. */
export function resolveTargetLiteral(
  target: SemanticTarget,
  mode: ModeOutput,
): string {
  if ("ref" in target)
    return primitive(mode, "scales", target.ref.palette, target.ref.step)
  if ("on" in target)
    return primitive(mode, "on", target.on.palette, target.on.step)
  if ("value" in target) return target.value
  const [a, weight, b] = target.mix
  const mixed = mixOklab(
    toOklch(resolveTargetLiteral(a, mode)),
    weight,
    toOklch(resolveTargetLiteral(b, mode)),
  )
  return oklchCss(fitSrgb(mixed))
}

/** Pick a token's target for one mode. */
function targetFor(token: SemanticToken, mode: ModeName): SemanticTarget {
  return isPerMode(token.target) ? token.target[mode] : token.target
}

/**
 * Flatten `vocab` to literal values per mode, keyed by token name without
 * the leading `--` (e.g. `"color-bg"`).
 */
export function semanticLiterals(
  vocab: SemanticVocabulary,
  theme: Theme,
): Record<ModeName, Record<string, string>> {
  const resolveMode = (mode: ModeName) =>
    Object.fromEntries(
      Object.entries(vocab).map(([name, token]) => [
        name,
        resolveTargetLiteral(targetFor(token, mode), theme[mode]),
      ]),
    )
  return { light: resolveMode("light"), dark: resolveMode("dark") }
}

function isPerMode(
  target: SemanticToken["target"],
): target is { light: SemanticTarget; dark: SemanticTarget } {
  return "light" in target && "dark" in target
}

/** Pick the base (light) target of a token. */
function baseTarget(target: SemanticToken["target"]): SemanticTarget {
  return isPerMode(target) ? target.light : target
}

/** Resolve a token's base (light) target to its CSS value. */
export function resolveTokenValue(token: SemanticToken): string {
  return resolveTarget(baseTarget(token.target))
}

export interface EmitCssOptions {
  /** Indentation unit (default one tab, matching the repo). */
  indent?: string
  /**
   * Wrapping selector for the block (default Tailwind's `@theme`). Pass a
   * concrete selector (e.g. `[data-dotui-scope="x"]`) to re-declare the
   * semantic layer on a subtree — see `DesignSystemProvider`'s scoped mode.
   */
  selector?: string
}

/** Emit `vocab` as a single declaration block (Tailwind's `@theme` by default). */
export function emitCss(
  vocab: SemanticVocabulary,
  options: EmitCssOptions = {},
): string {
  const indent = options.indent ?? "\t"
  const selector = options.selector ?? "@theme"
  const lines: string[] = [`${selector} {`]
  for (const [name, token] of Object.entries(vocab)) {
    lines.push(`${indent}--${name}: ${resolveTokenValue(token)};`)
  }
  lines.push("}")
  return `${lines.join("\n")}\n`
}

/**
 * Emit the `.dark` re-points for tokens whose target differs per mode.
 * Returns an empty string when the vocabulary has none (the common case —
 * primitives flip per mode, so most semantic tokens are mode-agnostic).
 */
export function emitDarkOverridesCss(
  vocab: SemanticVocabulary,
  options: EmitCssOptions = {},
): string {
  const indent = options.indent ?? "\t"
  const selector = options.selector ?? ".dark"
  const lines: string[] = []
  for (const [name, token] of Object.entries(vocab)) {
    if (!isPerMode(token.target)) continue
    lines.push(`${indent}--${name}: ${resolveTarget(token.target.dark)};`)
  }
  if (lines.length === 0) return ""
  return `${selector} {\n${lines.join("\n")}\n}\n`
}
