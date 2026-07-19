// D5 measurement: chroma curves of Radix light scales + Tailwind v4 palettes.
// Measures C(step) in OKLCH, each family's sRGB gamut cusp, and whether
// cusp-relative chroma C_rel = C / Cmax(L, H) collapses to a shared curve.
// Deterministic; run: node research/d5-chroma-measure.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { converter } from 'culori'

const require = createRequire(import.meta.url)
const radix = require('@radix-ui/colors')

const toOklch = converter('oklch')
const toRgb = converter('rgb')

const EPS = 1e-6
function inSrgb(l, c, h) {
  const { r, g, b } = toRgb({ mode: 'oklch', l, c, h })
  return (
    r >= -EPS &&
    r <= 1 + EPS &&
    g >= -EPS &&
    g <= 1 + EPS &&
    b >= -EPS &&
    b <= 1 + EPS
  )
}

// Max in-gamut chroma at fixed OKLCH L and H (binary search, tol 1e-5).
function maxChroma(l, h) {
  if (l <= 0 || l >= 1) return 0
  let lo = 0
  let hi = 0.5
  if (inSrgb(l, hi, h)) return hi // never happens in sRGB
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (inSrgb(l, mid, h)) lo = mid
    else hi = mid
  }
  return lo
}

// sRGB gamut cusp for hue H: (L, C) maximizing maxChroma(L, H).
// Coarse scan then ternary refine — maxChroma(L) is unimodal in L per hue.
function cusp(h) {
  let bestL = 0.5
  let bestC = 0
  for (let l = 0.02; l <= 0.98; l += 0.005) {
    const c = maxChroma(l, h)
    if (c > bestC) {
      bestC = c
      bestL = l
    }
  }
  let lo = bestL - 0.005
  let hi = bestL + 0.005
  for (let i = 0; i < 30; i++) {
    const m1 = lo + (hi - lo) / 3
    const m2 = hi - (hi - lo) / 3
    if (maxChroma(m1, h) < maxChroma(m2, h)) lo = m1
    else hi = m2
  }
  const l = (lo + hi) / 2
  return { l: round(l, 4), c: round(maxChroma(l, h), 4) }
}

const round = (x, d = 4) => Number(x.toFixed(d))

// ---------- Radix light chromatic scales ----------
const RADIX_GRAYS = new Set(['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'])
const radixFamilies = Object.keys(radix).filter(
  (k) =>
    !/Dark|A$|P3/.test(k) && !RADIX_GRAYS.has(k) && !/^(black|white)/.test(k),
)

function measureScale(name, entries) {
  const steps = entries.map(([, hexOrCss], i) => {
    const o = toOklch(hexOrCss)
    const l = o.l
    const c = o.c ?? 0
    const h = o.h ?? 0
    const ceil = maxChroma(l, h)
    return {
      step: i + 1,
      l: round(l),
      c: round(c),
      h: round(h, 2),
      cmaxAtLH: round(ceil),
      cRel: ceil > 0 ? round(Math.min(c / ceil, 1.5)) : 0,
    }
  })
  const peak = steps.reduce((a, b) => (b.c > a.c ? b : a))
  const familyCusp = cusp(peak.h)
  return {
    name,
    steps,
    peakStep: peak.step,
    peakC: peak.c,
    peakH: peak.h,
    cusp: familyCusp,
  }
}

const radixData = radixFamilies.map((fam) =>
  measureScale(fam, Object.entries(radix[fam])),
)

// ---------- Tailwind v4 chromatic + neutral scales ----------
const twCss = readFileSync(
  new URL(
    '../../../node_modules/.pnpm/tailwindcss@4.3.0/node_modules/tailwindcss/theme.css',
    import.meta.url,
  ),
  'utf8',
)
const twScales = {}
for (const m of twCss.matchAll(
  /--color-([a-z]+)-(\d+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g,
)) {
  const [, fam, step, l, c, h] = m
  ;(twScales[fam] ??= []).push({
    step: Number(step),
    l: Number(l) / 100,
    c: Number(c),
    h: Number(h),
  })
}
// v4.3 ships extra tinted neutrals (mauve/olive/mist/taupe) beyond the classic
// five; classify neutrals by measured peak chroma instead of a name list.
const twAll = Object.entries(twScales).map(([fam, steps]) => {
  const measured = steps
    .sort((a, b) => a.step - b.step)
    .map((s) => {
      const ceil = maxChroma(s.l, s.h)
      return {
        step: s.step,
        l: round(s.l),
        c: round(s.c),
        h: round(s.h, 2),
        cmaxAtLH: round(ceil),
        cRel: ceil > 0 ? round(Math.min(s.c / ceil, 1.5)) : 0,
      }
    })
  const peak = measured.reduce((a, b) => (b.c > a.c ? b : a))
  const familyCusp = cusp(peak.h)
  const outOfSrgb = measured.filter((s) => !inSrgb(s.l, s.c, s.h)).length
  return {
    name: fam,
    steps: measured,
    peakStep: peak.step,
    peakC: peak.c,
    peakH: peak.h,
    cusp: familyCusp,
    outOfSrgbSteps: outOfSrgb,
  }
})
const twData = twAll.filter((f) => f.peakC >= 0.06)
const twNeutrals = twAll.filter((f) => f.peakC < 0.06)

// ---------- collapse statistics ----------
// For each step index, spread across families of: absolute C, C normalized by
// family peak (c/peakC), and cusp-relative C_rel. Lower CV = better collapse.
function collapseStats(data, nSteps) {
  const stats = []
  for (let i = 0; i < nSteps; i++) {
    const abs = data.map((f) => f.steps[i].c)
    const norm = data.map((f) => f.steps[i].c / f.peakC)
    const rel = data.map((f) => f.steps[i].cRel)
    const s = (arr) => {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length
      const sd = Math.sqrt(
        arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length,
      )
      return {
        mean: round(mean),
        sd: round(sd),
        cv: mean > 0 ? round(sd / mean, 3) : 0,
      }
    }
    stats.push({ step: i + 1, absC: s(abs), cNorm: s(norm), cRel: s(rel) })
  }
  const avg = (key) =>
    round(stats.reduce((a, b) => a + b[key].cv, 0) / stats.length, 3)
  return {
    perStep: stats,
    meanCV: { absC: avg('absC'), cNorm: avg('cNorm'), cRel: avg('cRel') },
  }
}

// Vivid subset: exclude the deliberately muted Radix metals/browns — they run
// at a lower fraction of gamut by design and are reported separately.
const MUTED = new Set(['bronze', 'gold', 'brown'])
const radixVivid = radixData.filter((f) => !MUTED.has(f.name))

const radixStats = collapseStats(radixData, 12)
const radixVividStats = collapseStats(radixVivid, 12)
const twStats = collapseStats(twData, 11)

// ---------- solids vs cusp ----------
function solidsVsCusp(data, solidSteps) {
  return data.map((f) => {
    const out = { name: f.name, cuspL: f.cusp.l, cuspC: f.cusp.c }
    for (const s of solidSteps) {
      const st = f.steps[s - 1]
      out[`step${s}`] = {
        l: st.l,
        dLfromCusp: round(st.l - f.cusp.l),
        cOverCuspC: round(st.c / f.cusp.c, 3),
        cRelAtOwnL: st.cRel,
      }
    }
    return out
  })
}

const out = {
  meta: {
    generated: 'd5-chroma-measure.mjs',
    space: 'OKLCH via culori; gamut = sRGB (displayable, eps 1e-6)',
    radixVersion: require('@radix-ui/colors/package.json').version,
    tailwindVersion: '4.3.0',
    note: "cRel = C / maxChroma(L,H) at the step's own L and H; cusp = argmax_L maxChroma(L, H_peakStep)",
  },
  radix: radixData,
  radixCollapse: radixStats,
  radixCollapseVividOnly: { excluded: [...MUTED], ...radixVividStats },
  radixSolidsVsCusp: solidsVsCusp(radixData, [9, 10]),
  tailwind: twData,
  tailwindNeutrals: twNeutrals.map((f) => f.name),
  tailwindCollapse: twStats,
  tailwindSolidsVsCusp: solidsVsCusp(twData, [6, 7]), // tw solid ≈ 500/600 → indices 6,7 are 500,600
}

writeFileSync(
  new URL('./data/radix-light-chroma.json', import.meta.url),
  JSON.stringify(out, null, 2),
)

// ---------- console summary ----------
console.log('Radix peak-chroma step per family:')
for (const f of radixData)
  console.log(
    `  ${f.name.padEnd(8)} peak@${String(f.peakStep).padStart(2)} C=${f.peakC} H=${f.peakH}  cusp L=${f.cusp.l} C=${f.cusp.c}  C9/cusp=${round(f.steps[8].c / f.cusp.c, 3)} L9-Lcusp=${round(f.steps[8].l - f.cusp.l, 3)}`,
  )
console.log('\nRadix mean CV (all 25):', radixStats.meanCV)
console.log('Radix mean CV (vivid only):', radixVividStats.meanCV)
console.log('\nRadix vivid per-step cRel mean/sd:')
for (const s of radixVividStats.perStep)
  console.log(
    `  step ${String(s.step).padStart(2)}: cRel ${s.cRel.mean} ± ${s.cRel.sd} (cv ${s.cRel.cv}) | cNorm ${s.cNorm.mean} ± ${s.cNorm.sd} (cv ${s.cNorm.cv})`,
  )

console.log(
  '\nTailwind neutrals excluded:',
  twNeutrals.map((f) => f.name).join(' '),
)
console.log('Tailwind peak-chroma step per family:')
for (const f of twData)
  console.log(
    `  ${f.name.padEnd(8)} peak@${String(f.peakStep).padStart(3)} C=${f.peakC} H=${f.peakH}  cusp L=${f.cusp.l} C=${f.cusp.c}  outOfSrgbSteps=${f.outOfSrgbSteps}`,
  )
console.log('\nTailwind mean CV:', twStats.meanCV)
console.log('\nTailwind per-step cRel mean/sd:')
for (const s of twStats.perStep)
  console.log(
    `  idx ${String(s.step).padStart(2)}: cRel ${s.cRel.mean} ± ${s.cRel.sd} (cv ${s.cRel.cv}) | cNorm ${s.cNorm.mean} ± ${s.cNorm.sd} (cv ${s.cNorm.cv})`,
  )
