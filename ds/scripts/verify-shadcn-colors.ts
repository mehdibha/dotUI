import fs from 'node:fs'
// Cross-checks every shadcn color value in
// src/components/system/sections/shadcn/data.ts against shadcn's own upstream
// sources, so the numbers are provable, not trusted. Run: pnpm --filter=ds verify:colors
//
// Sources of truth:
//   - base grays        → ui.shadcn.com/r/colors/<base>.json (cssVarsV4)
//   - color themes       → shadcn-ui/ui _legacy-base-colors.ts (baseColorsOKLCH, step-annotated)
//   - Tailwind steps     → the installed tailwindcss theme.css palette
//   - destructive-fg     → shadcn-ui/ui apps/v4/app/globals.css
// Exits non-zero on any discrepancy.
import { createRequire } from 'node:module'
import path from 'node:path'

import {
  BASE_COLORS,
  COLOR_THEME_STEPS,
  COLOR_THEME_VALUES,
  MODES,
  TAILWIND_MAP,
  THEME_OVERRIDE_TOKENS,
  THEMES,
  TOKEN_GROUPS,
} from '../src/components/system/sections/shadcn/data'

const RAW = 'https://raw.githubusercontent.com/shadcn-ui/ui/main'
const problems: string[] = []
const fail = (msg: string) => problems.push(msg)

// ── color parsing ───────────────────────────────────────────────────────────
interface C {
  l: number
  c: number
  h: number
  a: number
}
function parse(v: string): C | null {
  const m = v.match(/oklch\(([^)]+)\)/i)
  if (!m) return null
  let [body, alpha] = m[1]!.split('/').map((s) => s.trim())
  const p = body!.split(/\s+/)
  const num = (s: string) =>
    s.endsWith('%') ? parseFloat(s) / 100 : parseFloat(s)
  const a = alpha ? num(alpha) : 1
  return { l: num(p[0]!), c: num(p[1] ?? '0'), h: num(p[2] ?? '0'), a }
}
/** Exact (post-rounding) equality — shadcn and Tailwind round to 3 places. */
function same(a: string, b: string, eps = 0.0015): boolean {
  if (a === b) return true
  const x = parse(a)
  const y = parse(b)
  if (!x || !y) return a === b
  const dh = Math.min(Math.abs(x.h - y.h), 360 - Math.abs(x.h - y.h))
  return (
    Math.abs(x.l - y.l) < eps &&
    Math.abs(x.c - y.c) < eps &&
    (dh < 0.08 || x.c < 0.002) &&
    Math.abs(x.a - y.a) < 0.005
  )
}

// ── Tailwind palette (installed) ────────────────────────────────────────────
const require_ = createRequire(import.meta.url)
const twThemeCss = path.join(
  path.dirname(require_.resolve('tailwindcss/package.json')),
  'theme.css',
)
const tw: Record<string, string> = {}
for (const m of fs
  .readFileSync(twThemeCss, 'utf8')
  .matchAll(/--color-([a-z]+-\d+):\s*(oklch\([^)]+\))/g)) {
  tw[m[1]!] = m[2]!
}
function stepColor(step: string): string | null {
  const [name, alpha] = step.split('/').map((s) => s.trim())
  if (name === 'white')
    return alpha ? `oklch(1 0 0 / ${alpha})` : 'oklch(1 0 0)'
  if (name === 'black') return 'oklch(0 0 0)'
  return tw[name!] ?? null
}

interface ColorsRegistry {
  cssVarsV4: { light: Record<string, string>; dark: Record<string, string> }
}
async function getJson(url: string): Promise<ColorsRegistry> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json() as Promise<ColorsRegistry>
}
async function getText(url: string): Promise<string> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.text()
}

async function main() {
  // ══ A. base grays are an exact copy of /r/colors/<base>.json ══
  for (const base of BASE_COLORS) {
    const reg = await getJson(`https://ui.shadcn.com/r/colors/${base}.json`)
    for (const mode of MODES) {
      const upstream: Record<string, string> = reg.cssVarsV4[mode]
      for (const [tok, val] of Object.entries(upstream)) {
        if (tok === 'radius') continue
        const mine = THEMES[base][mode][tok]
        if (mine !== val)
          fail(
            `[base] ${base}.${mode}.${tok}: mine="${mine}" upstream="${val}"`,
          )
      }
    }
  }

  // ══ B. destructive-foreground matches the site globals.css (constant) ══
  const globals = await getText(`${RAW}/apps/v4/app/globals.css`)
  const dfLight = globals
    .match(/:root\s*\{[^}]*?--destructive-foreground:\s*([^;]+);/s)?.[1]
    ?.trim()
  const dfDark = globals
    .match(/\.dark\s*\{[^}]*?--destructive-foreground:\s*([^;]+);/s)?.[1]
    ?.trim()
  for (const base of BASE_COLORS) {
    if (dfLight && THEMES[base].light['destructive-foreground'] !== dfLight)
      fail(
        `[dfg] ${base}.light: mine="${THEMES[base].light['destructive-foreground']}" upstream="${dfLight}"`,
      )
    if (dfDark && THEMES[base].dark['destructive-foreground'] !== dfDark)
      fail(
        `[dfg] ${base}.dark: mine="${THEMES[base].dark['destructive-foreground']}" upstream="${dfDark}"`,
      )
  }

  // ══ C. every Tailwind-map chip resolves to its token's actual value ══
  for (const base of BASE_COLORS) {
    for (const mode of MODES) {
      for (const [tok, step] of Object.entries(TAILWIND_MAP[base][mode])) {
        const resolved = stepColor(step)
        const value = THEMES[base][mode][tok]
        if (!resolved)
          fail(`[map] ${base}.${mode}.${tok}: unknown step "${step}"`)
        else if (!same(resolved, value!))
          fail(
            `[map] ${base}.${mode}.${tok}: step "${step}"=${resolved} ≠ value ${value}`,
          )
      }
    }
  }

  // ══ D+E. color themes exactly match baseColorsOKLCH (values + annotated steps) ══
  const legacy = await getText(`${RAW}/apps/v4/registry/_legacy-base-colors.ts`)
  const okBlock = legacy.slice(legacy.indexOf('export const baseColorsOKLCH'))
  const colorThemes = Object.keys(
    COLOR_THEME_VALUES,
  ) as (keyof typeof COLOR_THEME_VALUES)[]
  for (const theme of colorThemes) {
    const tStart = okBlock.search(new RegExp(`\\n  ${theme}: \\{`))
    const tEnd = okBlock.slice(tStart + 5).search(/\n  [a-z]+: \{/)
    const tBlock = okBlock.slice(
      tStart,
      tEnd === -1 ? undefined : tStart + 5 + tEnd,
    )
    for (const mode of MODES) {
      const mMatch = tBlock.match(
        new RegExp(`${mode}: \\{([\\s\\S]*?)\\n    \\}`),
      )
      const seg = mMatch?.[1] ?? ''
      for (const tok of THEME_OVERRIDE_TOKENS) {
        const re = new RegExp(
          `"?${tok}"?:\\s*"([^"]+)",\\s*(?://\\s*--color-([a-z0-9-]+))?`,
        )
        const mm = seg.match(re)
        const upVal = mm?.[1]
        const upStep = mm?.[2]
        const myVal = COLOR_THEME_VALUES[theme][mode][tok]
        if (upVal && myVal !== upVal)
          fail(
            `[theme] ${theme}.${mode}.${tok}: mine="${myVal}" upstream="${upVal}"`,
          )
        // step: use annotation when present, else the exact Tailwind match
        const myStep = COLOR_THEME_STEPS[theme][mode][
          tok as 'primary' | 'ring'
        ] as string | undefined
        if (myStep) {
          const expected =
            upStep ?? Object.keys(tw).find((n) => same(tw[n]!, myVal))
          if (expected && myStep !== expected)
            fail(
              `[theme-step] ${theme}.${mode}.${tok}: mine="${myStep}" expected="${expected}"`,
            )
          const resolved = stepColor(myStep)
          if (resolved && !same(resolved, myVal))
            fail(
              `[theme-step] ${theme}.${mode}.${tok}: step "${myStep}"=${resolved} ≠ value ${myVal}`,
            )
        }
      }
    }
  }

  // ══ F. structural coverage: table tokens exist; no /r/colors token is dropped ══
  const tableTokens = new Set(
    TOKEN_GROUPS.flatMap((g) =>
      g.tokens.flatMap((t) => (t.fg ? [t.name, t.fg] : [t.name])),
    ),
  )
  const reg = await getJson('https://ui.shadcn.com/r/colors/zinc.json')
  for (const tok of Object.keys(reg.cssVarsV4.light)) {
    if (tok === 'radius') continue
    if (!tableTokens.has(tok))
      fail(
        `[coverage] token "${tok}" is in the registry but missing from the table`,
      )
  }
  for (const tok of tableTokens) {
    if (!(tok in THEMES.zinc.light))
      fail(`[coverage] table token "${tok}" has no value in THEMES`)
    if (!(tok in TAILWIND_MAP.zinc.light))
      fail(`[coverage] table token "${tok}" has no Tailwind mapping`)
  }
}

main()
  .then(() => {
    if (problems.length) {
      console.error(`✗ ${problems.length} discrepancy(ies):`)
      for (const p of problems) console.error(`  - ${p}`)
      process.exit(1)
    }
    console.log(
      '✓ shadcn color data verified: base grays, color themes, Tailwind steps, destructive-foreground, and coverage all match upstream.',
    )
  })
  .catch((e) => {
    console.error('verify failed to run:', e)
    process.exit(2)
  })
