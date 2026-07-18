// D9 research: measure all Radix DARK scales (31 = 25 chromatic + 6 grays)
// vs their LIGHT counterparts. Deterministic; re-runnable.
//
// Outputs:
//   research/data/radix-dark-Lstar.json    — L* (culori lab65, D65) skeletons
//   research/data/radix-dark-chroma.json   — OKLCH C per step + dark/light ratios
//   research/data/dark-guarantee-audit.json — APCA/WCAG audit of text steps
//
// Note on Lab: culori `lab65` = CIELAB with D65 white point. WCAG relative
// luminance is D65-based, so the L* bridge in SPEC.md D3 requires D65 Lab.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as radix from '@radix-ui/colors'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { converter, parse } from 'culori'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, 'data')
mkdirSync(dataDir, { recursive: true })

const toLab65 = converter('lab65')
const toOklch = converter('oklch')

const GRAYS = new Set(['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'])

// All dark solid scales (exclude alpha "DarkA" and P3 "DarkP3" variants).
const families = Object.keys(radix)
  .filter((k) => /^[a-z]+Dark$/.test(k))
  .map((k) => k.slice(0, -4))
  .sort()

const hexToRgb8 = (hex) => {
  const c = parse(hex)
  return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)]
}

const wcagLum = (hex) => {
  const c = parse(hex)
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
}

const wcagRatio = (hexA, hexB) => {
  const [hi, lo] = [wcagLum(hexA), wcagLum(hexB)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

// APCA Lc of text on bg, absolute value (dark mode gives negative polarity).
const apcaLc = (textHex, bgHex) =>
  Math.abs(APCAcontrast(sRGBtoY(hexToRgb8(textHex)), sRGBtoY(hexToRgb8(bgHex))))

const steps = (scaleObj) => {
  // radix.blueDark = { blue1: "#...", ..., blue12: "#..." }
  const values = new Array(12)
  for (const [k, v] of Object.entries(scaleObj)) {
    const n = Number(k.match(/(\d+)$/)[1])
    values[n - 1] = v
  }
  return values
}

const r3 = (x) => (x == null ? null : Math.round(x * 1000) / 1000)
const r4 = (x) => (x == null ? null : Math.round(x * 10000) / 10000)

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
const quantile = (arr, q) => {
  const s = [...arr].sort((a, b) => a - b)
  const pos = (s.length - 1) * q
  const base = Math.floor(pos)
  return s[base] + (s[base + 1] - s[base] || 0) * (pos - base)
}

// ---------------------------------------------------------------- measure ---

const perFamily = {}
for (const fam of families) {
  const dark = steps(radix[`${fam}Dark`])
  const light = steps(radix[fam])
  perFamily[fam] = {
    isGray: GRAYS.has(fam),
    dark: {
      hex: dark,
      Lstar: dark.map((h) => r3(toLab65(h).l)),
      C: dark.map((h) => r4(toOklch(h).c ?? 0)),
      H: dark.map((h) => r3(toOklch(h).h ?? null)),
    },
    light: {
      hex: light,
      Lstar: light.map((h) => r3(toLab65(h).l)),
      C: light.map((h) => r4(toOklch(h).c ?? 0)),
    },
  }
}

// (1) L* skeleton, steps 1-8, median/spread per step; spacing comparison.
const skeleton = { dark: [], light: [] }
for (let i = 0; i < 12; i++) {
  for (const mode of ['dark', 'light']) {
    const Ls = families.map((f) => perFamily[f][mode].Lstar[i])
    skeleton[mode].push({
      step: i + 1,
      median: r3(median(Ls)),
      min: r3(Math.min(...Ls)),
      max: r3(Math.max(...Ls)),
      p25: r3(quantile(Ls, 0.25)),
      p75: r3(quantile(Ls, 0.75)),
    })
  }
}
const deltas = (sk) =>
  sk.slice(0, 7).map((s, i) => ({
    from: i + 1,
    to: i + 2,
    dL: r3(Math.abs(sk[i + 1].median - s.median)),
  }))

// Step-1 detail + Δ(1→2) per family, both modes.
const step1 = families.map((f) => ({
  family: f,
  isGray: GRAYS.has(f),
  dark_step1_hex: perFamily[f].dark.hex[0],
  dark_step1_Lstar: perFamily[f].dark.Lstar[0],
  dark_d12: r3(perFamily[f].dark.Lstar[1] - perFamily[f].dark.Lstar[0]),
  light_step1_Lstar: perFamily[f].light.Lstar[0],
  light_d12: r3(perFamily[f].light.Lstar[0] - perFamily[f].light.Lstar[1]),
}))

writeFileSync(
  join(dataDir, 'radix-dark-Lstar.json'),
  JSON.stringify(
    {
      meta: {
        source: '@radix-ui/colors',
        labSpace: 'lab65 (CIELAB, D65 white point — matches WCAG luminance)',
        families: families.length,
        chromatic: families.filter((f) => !GRAYS.has(f)).length,
        grays: GRAYS.size,
        generatedBy: 'research/d9-dark-mode.mjs',
      },
      skeletonDark: skeleton.dark,
      skeletonLight: skeleton.light,
      medianSpacingDark: deltas(skeleton.dark),
      medianSpacingLight: deltas(skeleton.light),
      step1,
      perFamilyLstar: Object.fromEntries(
        families.map((f) => [
          f,
          { dark: perFamily[f].dark.Lstar, light: perFamily[f].light.Lstar },
        ]),
      ),
    },
    null,
    2,
  ),
)

// (2) Chroma per step, dark vs light; text-step ratios per family.
const chromaRows = families.map((f) => {
  const d = perFamily[f].dark.C
  const l = perFamily[f].light.C
  const ratio = (i) => (l[i] > 0 ? r3(d[i] / l[i]) : null)
  return {
    family: f,
    isGray: GRAYS.has(f),
    C_dark: d,
    C_light: l,
    ratioPerStep: d.map((_, i) => ratio(i)),
    text: {
      C11_dark: d[10],
      C11_light: l[10],
      ratio11: ratio(10),
      C12_dark: d[11],
      C12_light: l[11],
      ratio12: ratio(11),
    },
  }
})

const chromatics = chromaRows.filter((r) => !r.isGray)
const ratioSummary = (i) => {
  const rs = chromatics.map((r) => r.ratioPerStep[i]).filter((x) => x != null)
  return {
    step: i + 1,
    median: r3(median(rs)),
    min: r3(Math.min(...rs)),
    max: r3(Math.max(...rs)),
  }
}

writeFileSync(
  join(dataDir, 'radix-dark-chroma.json'),
  JSON.stringify(
    {
      meta: {
        source: '@radix-ui/colors',
        chromaSpace: 'OKLCH C (culori)',
        ratio: 'C_dark / C_light per step; chromatic families only in summary',
        generatedBy: 'research/d9-dark-mode.mjs',
      },
      ratioSummaryPerStep: Array.from({ length: 12 }, (_, i) =>
        ratioSummary(i),
      ),
      perFamily: chromaRows,
    },
    null,
    2,
  ),
)

// (3) Guarantee audit: text steps on step-2 background, dark mode.
const audit = families.map((f) => {
  const hex = perFamily[f].dark.hex
  return {
    family: f,
    isGray: GRAYS.has(f),
    lc12on2: r3(apcaLc(hex[11], hex[1])),
    lc11on2: r3(apcaLc(hex[10], hex[1])),
    lc12on1: r3(apcaLc(hex[11], hex[0])),
    lc11on1: r3(apcaLc(hex[10], hex[0])),
    wcag12on2: r3(wcagRatio(hex[11], hex[1])),
    wcag11on2: r3(wcagRatio(hex[10], hex[1])),
  }
})
const stats = (key) => {
  const vals = audit.map((a) => a[key])
  return {
    min: r3(Math.min(...vals)),
    median: r3(median(vals)),
    max: r3(Math.max(...vals)),
  }
}
const below = (key, bar) =>
  audit.filter((a) => a[key] < bar).map((a) => a.family)

// Light-mode comparison for the same guarantee (worst-case reference).
const auditLight = families.map((f) => {
  const hex = perFamily[f].light.hex
  return {
    family: f,
    lc12on2: r3(apcaLc(hex[11], hex[1])),
    lc11on2: r3(apcaLc(hex[10], hex[1])),
    wcag12on2: r3(wcagRatio(hex[11], hex[1])),
    wcag11on2: r3(wcagRatio(hex[10], hex[1])),
  }
})

writeFileSync(
  join(dataDir, 'dark-guarantee-audit.json'),
  JSON.stringify(
    {
      meta: {
        source: '@radix-ui/colors dark scales',
        meters:
          'apca-w3 APCAcontrast+sRGBtoY (abs Lc); WCAG2 relative-luminance ratio',
        background: 'step 2 (subtle background) unless suffixed on1',
        generatedBy: 'research/d9-dark-mode.mjs',
      },
      summary: {
        scales: audit.length,
        lc12on2: stats('lc12on2'),
        lc11on2: stats('lc11on2'),
        wcag12on2: stats('wcag12on2'),
        wcag11on2: stats('wcag11on2'),
        below_Lc90_step12: below('lc12on2', 90),
        below_Lc60_step11: below('lc11on2', 60),
        below_wcag7_step12: below('wcag12on2', 7),
        below_wcag45_step11: below('wcag11on2', 4.5),
        counts: {
          below_Lc90_step12: below('lc12on2', 90).length,
          below_Lc60_step11: below('lc11on2', 60).length,
          below_wcag7_step12: below('wcag12on2', 7).length,
          below_wcag45_step11: below('wcag11on2', 4.5).length,
        },
      },
      lightSummary: {
        lc12on2: {
          min: r3(Math.min(...auditLight.map((a) => a.lc12on2))),
          median: r3(median(auditLight.map((a) => a.lc12on2))),
        },
        lc11on2: {
          min: r3(Math.min(...auditLight.map((a) => a.lc11on2))),
          median: r3(median(auditLight.map((a) => a.lc11on2))),
        },
        below_Lc90_step12: auditLight
          .filter((a) => a.lc12on2 < 90)
          .map((a) => a.family),
        below_Lc60_step11: auditLight
          .filter((a) => a.lc11on2 < 60)
          .map((a) => a.family),
        below_wcag45_step11: auditLight
          .filter((a) => a.wcag11on2 < 4.5)
          .map((a) => a.family),
        below_wcag7_step12: auditLight
          .filter((a) => a.wcag12on2 < 7)
          .map((a) => a.family),
      },
      perFamilyDark: audit,
      perFamilyLight: auditLight,
    },
    null,
    2,
  ),
)

// ------------------------------------------------------------- console out ---

const fmt = (arr, key) => arr.map((s) => s[key].toFixed(1)).join('  ')
console.log(
  `families: ${families.length} (${chromatics.length} chromatic + ${GRAYS.size} grays)\n`,
)
console.log('DARK  median L* 1-12:', fmt(skeleton.dark, 'median'))
console.log('LIGHT median L* 1-12:', fmt(skeleton.light, 'median'))
console.log(
  '\nDARK  ΔL* between medians 1→8:',
  deltas(skeleton.dark)
    .map((d) => d.dL.toFixed(1))
    .join('  '),
)
console.log(
  'LIGHT ΔL* between medians 1→8:',
  deltas(skeleton.light)
    .map((d) => d.dL.toFixed(1))
    .join('  '),
)
console.log(
  '\nstep-1 dark L*: min',
  Math.min(...step1.map((s) => s.dark_step1_Lstar)).toFixed(2),
  'max',
  Math.max(...step1.map((s) => s.dark_step1_Lstar)).toFixed(2),
  'median',
  median(step1.map((s) => s.dark_step1_Lstar)).toFixed(2),
)
console.log(
  'Δ(1→2) dark median:',
  median(step1.map((s) => s.dark_d12)).toFixed(2),
  '| light median:',
  median(step1.map((s) => s.light_d12)).toFixed(2),
)
console.log(
  '\nchroma ratio dark/light per step (chromatic medians):',
  Array.from({ length: 12 }, (_, i) => ratioSummary(i).median.toFixed(2)).join(
    '  ',
  ),
)
console.log('\nyellow family text-step chroma:')
for (const f of ['yellow', 'amber', 'orange', 'lime', 'mint', 'sky']) {
  const row = chromaRows.find((r) => r.family === f)
  console.log(
    ` ${f}: 11 ${row.text.C11_light}→${row.text.C11_dark} (x${row.text.ratio11})  12 ${row.text.C12_light}→${row.text.C12_dark} (x${row.text.ratio12})`,
  )
}
console.log(
  '\naudit: step12 on step2 —',
  JSON.stringify(stats('lc12on2')),
  '| below Lc90:',
  below('lc12on2', 90).length + '/31',
)
console.log(
  'audit: step11 on step2 —',
  JSON.stringify(stats('lc11on2')),
  '| below Lc60:',
  below('lc11on2', 60).length + '/31',
)
console.log(
  'below WCAG 7.0 (12):',
  below('wcag12on2', 7).length,
  below('wcag12on2', 7).join(','),
)
console.log(
  'below WCAG 4.5 (11):',
  below('wcag11on2', 4.5).length,
  below('wcag11on2', 4.5).join(','),
)
