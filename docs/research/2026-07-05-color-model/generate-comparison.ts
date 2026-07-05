/**
 * Generates ramps-comparison.html — side-by-side ramps: the current @dotui/colors
 * engine (all four algorithms + the www reverse-ramp dark path) vs Tailwind v4,
 * Radix Colors, Material HCT, and a prototype "generated dark" (the #377 §5 fix).
 *
 * Run from the repo root: `node_modules/.bin/tsx docs/research/2026-07-05-color-model/generate-comparison.ts`
 * Palette data: radix-scales.json / tailwind-palette.json (dumped from the npm packages).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  createTheme,
  gamutMap,
  oklchCss,
  onBlackWhite,
  toHex,
  toOklch,
  wcag2,
} from '../../../packages/colors/src/index'
import { chromaEnvelope } from '../../../packages/colors/src/shared/curve'
import { resolveColorConfig } from '../../../www/src/registry/theme/primitives'

const here = dirname(fileURLToPath(import.meta.url))
const radix: Record<string, Record<string, string>> = JSON.parse(
  readFileSync(join(here, 'radix-scales.json'), 'utf8'),
)
const tailwind: Record<string, Record<string, string>> = JSON.parse(
  readFileSync(join(here, 'tailwind-palette.json'), 'utf8'),
)

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

// ---------------------------------------------------------------------------
// helpers

type Ramp = Record<string, string>

function kernelRamp(
  algorithm: 'oklch' | 'tailwind' | 'contrast' | 'material',
  seed: string,
  opts: Record<string, unknown> = {},
  mode: 'light' | 'dark' = 'light',
): Ramp {
  const theme = createTheme({
    algorithm,
    palettes: { primary: seed },
    modes: { [mode]: true },
    ...opts,
  } as never)
  return theme[mode]!.scales.primary!
}

/** The www path: resolveColorConfig (light generated, dark = reversed; neutral stretched). */
function wwwRamps(seeds: { neutral: string; accent: string }) {
  return resolveColorConfig({ algorithm: 'oklch', seeds })
}

/** ΔE-ish distance in OKLab (good enough for "where does the seed land"). */
function dist(a: string, b: string): number {
  const A = toOklch(a)
  const B = toOklch(b)
  const [ax, ay] = [A.c * Math.cos((A.h * Math.PI) / 180), A.c * Math.sin((A.h * Math.PI) / 180)]
  const [bx, by] = [B.c * Math.cos((B.h * Math.PI) / 180), B.c * Math.sin((B.h * Math.PI) / 180)]
  return Math.sqrt((A.l - B.l) ** 2 + (ax - bx) ** 2 + (ay - by) ** 2)
}

function nearestStep(ramp: Ramp, seed: string): { step: string; d: number } {
  let best = { step: '', d: Infinity }
  for (const [step, value] of Object.entries(ramp)) {
    const d = dist(value, seed)
    if (d < best.d) best = { step, d }
  }
  return best
}

// ---------------------------------------------------------------------------
// Prototype: a genuinely generated dark (the #377 §5 model — same producer, isDark-aware
// anchors, slightly damped chroma). A sketch to judge direction, not final tuning.

const DARK_L_ANCHORS = [
  0.181, 0.216, 0.263, 0.318, 0.392, 0.478, 0.564, 0.664, 0.752, 0.846, 0.932,
]
const DARK_NEUTRAL_L = [
  0.145, 0.185, 0.222, 0.262, 0.322, 0.412, 0.512, 0.632, 0.742, 0.862, 0.955,
]

function prototypeDark(seed: string, neutral = false, surface?: number): Ramp {
  const s = toOklch(seed)
  let anchors = neutral ? DARK_NEUTRAL_L : DARK_L_ANCHORS
  if (surface !== undefined) {
    // Remap the ladder so the surface end starts at the requested lightness ("dim" mode).
    const [lo, hi] = [anchors[0]!, anchors[anchors.length - 1]!]
    anchors = anchors.map((l) => surface + ((l - lo) / (hi - lo)) * (hi - surface))
  }
  const peakC = neutral ? Math.min(s.c, 0.012) : Math.max(s.c * 0.88, 0.097)
  const scale: Ramp = {}
  for (let i = 0; i < 11; i++) {
    // Chroma envelope shifted toward the light half (solids sit lighter in dark UIs).
    const env = neutral ? 1 : 0.5 + 0.5 * Math.sin(Math.PI * Math.min(1, i / 10 + 0.08))
    scale[STEPS[i]!] = oklchCss(gamutMap({ l: anchors[i]!, c: peakC * env, h: s.h }))
  }
  return scale
}

// ---------------------------------------------------------------------------
// html

const css = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; }
  body { font: 13px/1.5 -apple-system, 'SF Pro Text', 'Segoe UI', sans-serif; background: #f4f4f5; color: #18181b; padding: 40px 48px 120px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 16px; margin: 44px 0 4px; }
  .sub { color: #71717a; margin-bottom: 14px; max-width: 860px; }
  .panel { background: #fff; border: 1px solid #e4e4e7; border-radius: 10px; padding: 18px 20px; margin-bottom: 14px; }
  .panel.dark { background: #101012; border-color: #26262b; color: #e4e4e7; color-scheme: dark; }
  .panel.dark .lbl { color: #a1a1aa; }
  .panel.dark .lstep { color: #52525b; }
  .row { display: flex; align-items: center; gap: 10px; margin: 7px 0; }
  .lbl { width: 250px; flex: none; font-size: 12px; color: #52525b; text-align: right; padding-right: 4px; }
  .lbl b { color: inherit; font-weight: 600; }
  .ramp { display: flex; flex: 1; height: 44px; border-radius: 6px; overflow: hidden; }
  .ramp.free { height: 44px; }
  .sw { flex: 1; position: relative; }
  .sw.seedmark::after { content: ''; position: absolute; inset: auto 50% 3px; width: 6px; height: 6px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 1.5px rgba(0,0,0,.55); transform: translateX(3px); }
  .steps { display: flex; flex: 1; }
  .steps span { flex: 1; text-align: center; font-size: 10px; color: #a1a1aa; }
  .seedchip { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: #52525b; margin-bottom: 10px; }
  .seedchip i { width: 22px; height: 22px; border-radius: 5px; display: inline-block; border: 1px solid rgba(0,0,0,.15); }
  .lsteps { display: flex; flex: 1; }
  .lstep { flex: 1; text-align: center; font-size: 9.5px; color: #a1a1aa; font-variant-numeric: tabular-nums; }
  .note { font-size: 12px; color: #71717a; margin-top: 10px; max-width: 860px; }
  .grid { display: grid; grid-template-columns: 110px 1fr 1fr; gap: 4px 12px; align-items: center; }
  .grid .hue { font-size: 11px; color: #52525b; text-align: right; }
  .grid .head { font-size: 12px; font-weight: 600; color: #18181b; padding-bottom: 6px; }
  .miniramp { display: flex; height: 20px; border-radius: 4px; overflow: hidden; }
  .on-strip { display: flex; gap: 10px; flex-wrap: wrap; }
  .on-card { width: 168px; border-radius: 8px; padding: 10px 12px; font-size: 12px; }
  .on-card .name { opacity: .75; font-size: 10.5px; }
  .on-card .big { font-weight: 600; font-size: 14px; }
  .badge { display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 99px; margin-top: 6px; }
  .pass { background: rgba(0,0,0,.18); }
  .fail { background: #dc2626; color: #fff; }
  code { background: #e4e4e7; border-radius: 4px; padding: 0 4px; font-size: 11.5px; }
  .panel.dark code { background: #26262b; }
`

const out: string[] = []
function el(html: string) {
  out.push(html)
}

function swatches(ramp: Ramp, seed?: string): string {
  const mark = seed ? nearestStep(ramp, seed).step : null
  return Object.entries(ramp)
    .map(([step, v]) => {
      const hex = toHex(v)
      const l = toOklch(v).l.toFixed(3)
      return `<div class="sw${step === mark ? ' seedmark' : ''}" style="background:${hex}" title="${step} · ${hex} · L ${l} · ${v}"></div>`
    })
    .join('')
}

function row(label: string, ramp: Ramp, seed?: string): string {
  return `<div class="row"><div class="lbl">${label}</div><div class="ramp">${swatches(ramp, seed)}</div></div>`
}

function lRow(ramp: Ramp): string {
  const cells = Object.values(ramp)
    .map((v) => `<span class="lstep">${toOklch(v).l.toFixed(2)}</span>`)
    .join('')
  return `<div class="row"><div class="lbl"></div><div class="lsteps">${cells}</div></div>`
}

function stepsHeader(steps: string[]): string {
  return `<div class="row"><div class="lbl"></div><div class="steps">${steps.map((s) => `<span>${s}</span>`).join('')}</div></div>`
}

function seedChip(seed: string, label: string): string {
  return `<div class="seedchip"><i style="background:${seed}"></i> seed <code>${seed}</code> — ${label} <span style="color:#a1a1aa">(the white dot marks each ramp's nearest step to the seed, ΔEok)</span></div>`
}

// ---------------------------------------------------------------------------
// 1. Accent ramps, light — blue

const BLUE = toHex(tailwind.blue!['500']!)

el(`<h1>dotUI color model — ramp comparisons</h1>
<p class="sub">Generated ${'2026-07-05'} by <code>generate-comparison.ts</code> from the live <code>@dotui/colors</code> engine in this repo. Every dotUI row is the actual kernel output; Tailwind/Radix rows are the shipped palettes from npm. Hover any swatch for step · hex · OKLCH&nbsp;L.</p>`)

el(`<h2>1 · Same blue seed through every engine (light)</h2>
<p class="sub">Seed = Tailwind <code>blue-500</code>. "Can the engine reproduce a Tailwind-quality ramp from its own seed?"</p>`)
el(`<div class="panel">`)
el(seedChip(BLUE, 'Tailwind blue-500'))
el(stepsHeader(STEPS))
el(row('<b>Tailwind v4 blue</b> (hand-tuned, ground truth)', tailwind.blue!, BLUE))
el(row('<b>dotUI oklch</b> (default)', kernelRamp('oklch', BLUE), BLUE))
el(row('<b>dotUI tailwind</b> (torsion 24°)', kernelRamp('tailwind', BLUE), BLUE))
el(row('<b>dotUI contrast</b> (wcag2)', kernelRamp('contrast', BLUE), BLUE))
el(row('<b>dotUI material</b> (HCT light tones)', kernelRamp('material', BLUE), BLUE))
el(row('<b>Radix blue</b> (12 steps, hand-tuned)', radix.blue!, BLUE))
el(lRow(kernelRamp('oklch', BLUE)))
el(`<p class="note">Radix uses 1–12 use-case steps (1–2 app bg, 3–5 component bg, 6–8 borders, 9–10 solid, 11–12 text) — shown raw for texture, not step-aligned.</p>`)
el(`</div>`)

// 2. Yellow stress test
const YELLOW = toHex(tailwind.yellow!['400']!)
el(`<h2>2 · The yellow stress test</h2>
<p class="sub">Seed = Tailwind <code>yellow-400</code>. Yellow's gamut cusp sits near L&nbsp;0.9 — a chroma envelope that peaks at step 500 (L&nbsp;0.65) forces the vivid part of the ramp into the mud. Hand-tuned palettes peak chroma where the hue actually lives.</p>`)
el(`<div class="panel">`)
el(seedChip(YELLOW, 'Tailwind yellow-400'))
el(stepsHeader(STEPS))
el(row('<b>Tailwind v4 yellow</b>', tailwind.yellow!, YELLOW))
el(row('<b>dotUI oklch</b>', kernelRamp('oklch', YELLOW), YELLOW))
el(row('<b>dotUI tailwind</b>', kernelRamp('tailwind', YELLOW), YELLOW))
el(row('<b>dotUI contrast</b>', kernelRamp('contrast', YELLOW), YELLOW))
el(row('<b>dotUI material</b>', kernelRamp('material', YELLOW), YELLOW))
el(row('<b>Radix yellow</b>', radix.yellow!, YELLOW))
el(`</div>`)

// 3. Hue sweep grid
el(`<h2>3 · Whole-palette texture: 17 hues at a glance</h2>
<p class="sub">Left: Tailwind's shipped ramp per hue. Right: dotUI <code>oklch</code> regenerated from that hue's 500 seed. One fixed lightness ladder + one fixed sine chroma envelope for every hue reads as uniform stripes; hand-tuned ramps vary per hue.</p>`)
el(`<div class="panel"><div class="grid">`)
el(`<div></div><div class="head">Tailwind v4 (hand-tuned)</div><div class="head">dotUI oklch (from tw *-500 seed)</div>`)
const SWEEP = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
for (const hue of SWEEP) {
  const seed = toHex(tailwind[hue]!['500']!)
  const mini = (ramp: Ramp) =>
    `<div class="miniramp">${Object.values(ramp)
      .map((v) => `<div class="sw" style="background:${toHex(v)}"></div>`)
      .join('')}</div>`
  el(`<div class="hue">${hue}</div>${mini(tailwind[hue]!)}${mini(kernelRamp('oklch', seed))}`)
}
el(`</div></div>`)

// 4. Neutral backbone
el(`<h2>4 · The neutral backbone (what surfaces are made of)</h2>
<p class="sub">dotUI default seeds (<code>neutral #808080</code>). The dotUI rows are the real <code>resolveColorConfig</code> output — kernel ramp, then <code>stretchLightness</code> smoothstep to L&nbsp;0.13–0.985. Semantic mapping: bg=50, field=100, muted=200, border=300, fg-muted=600, fg=950.</p>`)
const www = wwwRamps({ neutral: '#808080', accent: BLUE })
el(`<div class="panel">`)
el(stepsHeader(STEPS))
el(row('<b>dotUI neutral · light</b> (stretched)', www.light.neutral!))
el(lRow(www.light.neutral!))
el(row('<b>Tailwind neutral</b>', tailwind.neutral!))
el(row('<b>Radix gray</b>', radix.gray!))
el(`</div>`)

// 5. Dark mode — the money section
el(`<h2>5 · Dark mode: reversal vs generation</h2>
<p class="sub">dotUI's dark today is the light ramp <b>reversed</b> (step 50 takes 950's value). Below it: Radix and Material darks (independently designed), and a prototype <b>generated</b> dark — the same kernel producer given real dark lightness anchors (#377 §5's <code>isDark</code>-aware path; a direction sketch, not final tuning). The "dim" row is the same producer with the mode's <code>surface</code> knob raised to L&nbsp;0.22 — the answer to "my dark background is too black".</p>`)
el(`<div class="panel dark">`)
el(`<div style="font-size:12px; color:#a1a1aa; margin-bottom:6px">NEUTRAL — surfaces (bg=50, field=100, muted=200, border=300 · fg-muted=600 · fg=950)</div>`)
el(stepsHeader(STEPS))
el(row('<b>dotUI dark today</b> (reversed light)', www.dark.neutral!))
el(lRow(www.dark.neutral!))
el(row('<b>Prototype generated dark</b>', prototypeDark('#808080', true)))
el(lRow(prototypeDark('#808080', true)))
el(row('<b>Prototype "dim"</b> (same producer, surface L 0.22)', prototypeDark('#808080', true, 0.22)))
el(row('<b>Radix grayDark</b>', radix.grayDark!))
el(`<div style="height:18px"></div>`)
el(`<div style="font-size:12px; color:#a1a1aa; margin-bottom:6px">ACCENT (blue) — solid=500, muted bg=50/100, border=300</div>`)
el(row('<b>dotUI dark today</b> (reversed light)', www.dark.accent!))
el(lRow(www.dark.accent!))
el(row('<b>Prototype generated dark</b>', prototypeDark(BLUE)))
el(lRow(prototypeDark(BLUE)))
el(row('<b>Radix blueDark</b>', radix.blueDark!))
el(row('<b>dotUI material dark tones</b> (unreachable from www)', kernelRamp('material', BLUE, {}, 'dark')))
el(`<p class="note">Reversal artifacts to look for: the dark "muted accent" (steps 50–200) is the light ramp's <i>text</i> end — heavy, saturated navy instead of a dim tinted surface; border (300) arrives too bright; and the whole dark neutral is forced symmetric with light, so dark surfaces can't cluster tighter than light ones (real dark UIs compress the dark end harder than light UIs compress the light end).</p>`)
el(`</div>`)

// 6. Brand preservation
const BRAND = '#635bff'
el(`<h2>6 · Brand color fidelity</h2>
<p class="sub">Seed = <code>#635bff</code> (a Stripe-ish brand violet). Default dotUI <b>discards the seed's lightness</b> — the ramp never contains the brand color. <code>preserveSeedAt: '500'</code> exists but is buried in advanced knobs.</p>`)
el(`<div class="panel">`)
el(seedChip(BRAND, 'brand violet'))
el(stepsHeader(STEPS))
for (const [label, ramp] of [
  ['<b>dotUI oklch</b> (default — seed L discarded)', kernelRamp('oklch', BRAND)],
  ["<b>dotUI oklch</b> + preserveSeedAt:'500'", kernelRamp('oklch', BRAND, { preserveSeedAt: '500' })],
  ['<b>dotUI material</b>', kernelRamp('material', BRAND)],
  ['<b>Radix iris</b> (nearest hand-tuned hue)', radix.iris!],
] as const) {
  el(row(label, ramp as Ramp, BRAND))
  const near = nearestStep(ramp as Ramp, BRAND)
  el(`<div class="row"><div class="lbl"></div><div style="font-size:10.5px;color:#a1a1aa">nearest step: ${near.step} · ΔEok ${(near.d).toFixed(3)} ${near.d < 0.02 ? '(≈ exact)' : near.d < 0.06 ? '(close)' : '(visibly off-brand)'}</div></div>`)
}
el(`</div>`)

// 7. on-color strip
el(`<h2>7 · Text on solids (<code>onBlackWhite</code>, what actually ships)</h2>
<p class="sub">The shipped <code>--on-*</code> is a pure black/white luminance pick with <b>no AA floor check</b>. WCAG 2 ratio shown; AA needs 4.5.</p>`)
el(`<div class="panel"><div class="on-strip">`)
const SOLIDS: Array<[string, string]> = [
  ['dotUI blue-500', kernelRamp('oklch', BLUE)['500']!],
  ['dotUI yellow-500', kernelRamp('oklch', YELLOW)['500']!],
  ['tw yellow-400 as solid', tailwind.yellow!['400']!],
  ['dotUI green-500', kernelRamp('oklch', toHex(tailwind.green!['500']!))['500']!],
  ['dotUI oklch vivid (chromaMode max) blue-500', kernelRamp('oklch', BLUE, { chromaMode: 'max' })['500']!],
  ['Radix amber-9 (their solid)', radix.amber!['amber9']!],
]
for (const [name, bg] of SOLIDS) {
  const fg = onBlackWhite(bg)
  const ratio = wcag2(fg === 'black' ? '#000' : '#fff', toHex(bg))
  el(`<div class="on-card" style="background:${toHex(bg)}; color:${fg}">
    <div class="name">${name}</div><div class="big">Aa Button</div>
    <span class="badge ${ratio >= 4.5 ? 'pass' : 'fail'}">${fg} · ${ratio.toFixed(2)}${ratio >= 4.5 ? ' AA' : ' — fails AA'}</span></div>`)
}
el(`</div><p class="note">Radix pairs amber/yellow/lime/mint/sky solids with <i>dark</i> text by design; a black/white luminance pick agrees, but nothing guarantees 4.5:1 — mid-tone solids ship failing text and no one is told.</p></div>`)

const html = `<!doctype html><meta charset="utf-8"><title>dotUI color model — ramp comparisons</title><style>${css}</style><body>${out.join('\n')}</body>`
writeFileSync(join(here, 'ramps-comparison.html'), html)
console.log('wrote', join(here, 'ramps-comparison.html'))
