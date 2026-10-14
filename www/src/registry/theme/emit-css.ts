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

function resolveTarget(target: SemanticTarget): string {
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

function baseTarget(target: SemanticToken["target"]): SemanticTarget {
  return isPerMode(target) ? target.light : target
}

function resolveTokenValue(token: SemanticToken): string {
  return resolveTarget(baseTarget(token.target))
}

export interface EmitCssOptions {
  /** Indentation unit (default one tab). */
  indent?: string
  /**
   * Wrapping selector (default `@theme`); a concrete selector such as
   * `[data-dotui-scope="x"]` re-declares the semantic layer on that subtree.
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
 * Emit the `.dark` re-points for tokens whose target differs per mode, or an
 * empty string when there are none.
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
