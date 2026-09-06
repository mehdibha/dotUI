/**
 * Flatten a preset token's CSS value to one export-safe string per mode.
 *
 * The site runs on the primitive ramps and a live `@theme` vocabulary, so a
 * preset token may say `var(--color-accent)`, `light-dark(var(--neutral-25),
 * …)` or `color-mix(in oklab, var(--neutral-50) 65%, …)`. The export ships
 * neither: ramps never leave the generator and `@theme inline` bakes the
 * semantic aliases into utilities. So every reference is resolved through the
 * engine here — `light-dark()` split per mode, opaque oklab mixes computed the
 * way `resolveTargetLiteral` computes them, alpha mixes (`transparent`) kept as
 * `color-mix()` over literals. Anything else passes through untouched.
 */

import { fitSrgb, mixOklab, oklchCss, type Theme, toOklch } from "@dotui/colors"

import type { ModeName } from "@/registry/theme"

type Lookup = (name: string, mode: ModeName) => string | undefined

const FUNCTION = /^(var|light-dark|color-mix)\(/
/** A color `mixOklab` can take: the engine's `oklch()` output or a plain hex. */
const OPAQUE = /^(oklch\([^/]*\)|#[0-9a-f]{3}|#[0-9a-f]{6})$/i

export function flattenColorValue(
  value: string,
  mode: ModeName,
  lookup: Lookup,
): string {
  let out = ""
  let i = 0
  while (i < value.length) {
    const match = FUNCTION.exec(value.slice(i))
    if (!match || (i > 0 && /[\w-]/.test(value[i - 1] ?? ""))) {
      out += value[i]
      i++
      continue
    }
    const start = i + match[0].length
    const end = closingParen(value, start)
    const args = splitArgs(value.slice(start, end))
    out += evaluate(match[1] ?? "", args, mode, lookup)
    i = end + 1
  }
  return out
}

function evaluate(
  fn: string,
  args: string[],
  mode: ModeName,
  lookup: Lookup,
): string {
  const flatten = (value: string) => flattenColorValue(value, mode, lookup)
  if (fn === "var") {
    return lookup(args[0] ?? "", mode) ?? `var(${args.join(", ")})`
  }
  if (fn === "light-dark") {
    return flatten(args[mode === "light" ? 0 : 1] ?? "")
  }
  const [space = "", ...colors] = args
  const [a, b] = colors.map((arg) => {
    const [, color = "", weight] = /^(.*?)(?:\s+([\d.]+)%)?$/.exec(arg) ?? []
    return { color: flatten(color), weight }
  })
  if (
    a &&
    b &&
    space === "in oklab" &&
    OPAQUE.test(a.color) &&
    OPAQUE.test(b.color)
  ) {
    const weight = Number(a.weight ?? (b.weight ? 100 - Number(b.weight) : 50))
    return oklchCss(
      fitSrgb(mixOklab(toOklch(a.color), weight, toOklch(b.color))),
    )
  }
  const part = (arg: { color: string; weight?: string }) =>
    arg.weight ? `${arg.color} ${arg.weight}%` : arg.color
  return `color-mix(${[space, ...[a, b].filter((x) => x !== undefined).map(part)].join(", ")})`
}

function closingParen(value: string, from: number): number {
  let depth = 1
  for (let i = from; i < value.length; i++) {
    if (value[i] === "(") depth++
    else if (value[i] === ")" && --depth === 0) return i
  }
  return value.length
}

function splitArgs(value: string): string[] {
  const args: string[] = []
  let depth = 0
  let current = ""
  for (const char of value) {
    if (char === "(") depth++
    else if (char === ")") depth--
    if (char === "," && depth === 0) {
      args.push(current.trim())
      current = ""
    } else current += char
  }
  args.push(current.trim())
  return args
}

/**
 * Resolve `var()` names against the engine: `--color-<x>` to the semantic
 * literal (the preset's own re-point first, so a token that names a
 * re-pointed token follows it), `--<palette>-<step>` and
 * `--on-<palette>-<step>` to the ramps. Unknown names stay `var()`.
 */
export function colorLookup(
  engine: Theme,
  literals: Record<ModeName, Record<string, string>>,
  tokens: Record<string, string>,
): Lookup {
  const lookup = (
    name: string,
    mode: ModeName,
    depth: number,
  ): string | undefined => {
    if (name.startsWith("--color-")) {
      const own = tokens[name]
      if (own !== undefined && depth < 4) {
        const value = own.startsWith("--") ? `var(${own})` : own
        return flattenColorValue(value, mode, (n, m) => lookup(n, m, depth + 1))
      }
      return literals[mode][name.slice(2)]
    }
    const ramp = /^--(on-)?([a-z]+)-(\d+)$/.exec(name)
    if (!ramp) return undefined
    const [, on, palette = "", step = ""] = ramp
    const ramps: Record<string, Record<string, string>> = engine[mode][
      on ? "on" : "scales"
    ]
    return ramps[palette]?.[step]
  }
  return (name, mode) => lookup(name, mode, 0)
}
