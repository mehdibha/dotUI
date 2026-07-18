// D10-A — Alpha twins: reimplement Radix's getAlphaColor solver and verify
// digit-for-digit against published @radix-ui/colors alpha scales.
//
// Algorithm source: radix-ui/website custom-colors (getAlphaColorSrgb):
//   overlay toward white if any target channel is lighter than the background
//   channel, else toward black; alpha = max per-channel (t-b)/(desired-b),
//   ceil'd to 1/255; channels solved as R = -(b*(1-A)-t)/A, ceil'd, then
//   corrected +/-1 against the browser compositing model
//   round(bg*(1-a)) + round(fg*a) at 0-255.
//
// Run: node research/alpha-parity.mjs   (from packages/colors)

import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const radix = require('@radix-ui/colors')

// ---------- helpers ----------

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return [0, 1, 2].map((i) => parseInt(h.slice(i * 2, i * 2 + 2), 16))
}
const hexToRgba = (hex) => {
  const h = hex.replace('#', '')
  const rgb = hexToRgb('#' + h.slice(0, 6))
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return [...rgb, a]
}
const byte = (n) => n.toString(16).padStart(2, '0')
const formatRgba = ([r, g, b, a]) => {
  const a255 = Math.round(a * 255)
  return a255 === 255
    ? `#${byte(r)}${byte(g)}${byte(b)}`
    : `#${byte(r)}${byte(g)}${byte(b)}${byte(a255)}`
}

// Browser compositing model (source-over, 8-bit, per Radix's correction step).
const blendChannel = (fg, a, bg) =>
  Math.round(bg * (1 - a)) + Math.round(fg * a)
const composite = ([r, g, b, a], bg) => [
  blendChannel(r, a, bg[0]),
  blendChannel(g, a, bg[1]),
  blendChannel(b, a, bg[2]),
]

// ---------- Radix getAlphaColor (rgbPrecision = alphaPrecision = 255) ----------

function getAlphaColor(targetRgb, backgroundRgb) {
  const P = 255
  const [tr, tg, tb] = targetRgb
  const [br, bg, bb] = backgroundRgb

  // Overlay direction: white if any target channel is lighter than the bg.
  const desired = tr > br || tg > bg || tb > bb ? P : 0

  const alphaR = (tr - br) / (desired - br)
  const alphaG = (tg - bg) / (desired - bg)
  const alphaB = (tb - bb) / (desired - bb)

  const isPureGray = [alphaR, alphaG, alphaB].every((a) => a === alphaR)
  if (isPureGray) {
    const V = desired // 0 or 255
    return [V, V, V, alphaR]
  }

  const clampRgb = (n) => (Number.isNaN(n) ? 0 : Math.min(P, Math.max(0, n)))
  const clampA = (n) => (Number.isNaN(n) ? 0 : Math.min(P, Math.max(0, n)))
  const maxAlpha = Math.max(alphaR, alphaG, alphaB)
  const A = clampA(Math.ceil(maxAlpha * P)) / P

  let R = Math.ceil(clampRgb(((br * (1 - A) - tr) / A) * -1))
  let G = Math.ceil(clampRgb(((bg * (1 - A) - tg) / A) * -1))
  let B = Math.ceil(clampRgb(((bb * (1 - A) - tb) / A) * -1))

  // +/-1 correction against the 8-bit compositing model.
  const fix = (fg, t, b) => {
    const blended = blendChannel(fg, A, b)
    if (desired === 0 && t <= b && t !== blended)
      return t > blended ? fg + 1 : fg - 1
    if (desired === P && t >= b && t !== blended)
      return t > blended ? fg + 1 : fg - 1
    return fg
  }
  R = fix(R, tr, br)
  G = fix(G, tg, bg)
  B = fix(B, tb, bb)

  return [R, G, B, A]
}

// ---------- measurement ----------

const SCALES = ['blue', 'red', 'green', 'amber', 'purple', 'gray']
const values = (obj) => Object.values(obj)

function measureScale(name, solidHexes, publishedAlphaHexes, bg) {
  const steps = solidHexes.map((solidHex, i) => {
    const target = hexToRgb(solidHex)
    const computed = getAlphaColor(target, bg)
    const computedHex = formatRgba(computed)
    const publishedHex = publishedAlphaHexes[i]

    const compComputed = composite(
      [
        computed[0],
        computed[1],
        computed[2],
        Math.round(computed[3] * 255) / 255,
      ],
      bg,
    )
    const compPublished = composite(hexToRgba(publishedHex), bg)
    const errComputed = Math.max(
      ...compComputed.map((v, c) => Math.abs(v - target[c])),
    )
    const errPublished = Math.max(
      ...compPublished.map((v, c) => Math.abs(v - target[c])),
    )

    return {
      step: i + 1,
      solid: solidHex,
      published: publishedHex,
      computed: computedHex,
      hexMatch: computedHex.toLowerCase() === publishedHex.toLowerCase(),
      // max |channel| error when compositing over bg vs the published solid
      compositeErrComputed: errComputed,
      compositeErrPublished: errPublished,
    }
  })
  return {
    scale: name,
    background: '#' + bg.map(byte).join(''),
    exactHexMatches: steps.filter((s) => s.hexMatch).length,
    maxCompositeErrComputed: Math.max(
      ...steps.map((s) => s.compositeErrComputed),
    ),
    maxCompositeErrPublished: Math.max(
      ...steps.map((s) => s.compositeErrPublished),
    ),
    steps,
  }
}

// -- empirically determine the bg Radix dark alphas assume --
// For each candidate neutral bg, generate all dark alpha scales and count
// exact hex matches against the published *DarkA scales.
const darkCandidates = []
for (let v = 0; v <= 32; v++) darkCandidates.push([v, v, v])
const darkSolveResults = darkCandidates.map((bg) => {
  let matches = 0
  let total = 0
  for (const name of SCALES) {
    const solids = values(radix[`${name}Dark`])
    const alphas = values(radix[`${name}DarkA`])
    solids.forEach((hex, i) => {
      total++
      if (
        formatRgba(getAlphaColor(hexToRgb(hex), bg)).toLowerCase() ===
        alphas[i].toLowerCase()
      )
        matches++
    })
  }
  return { bg: '#' + bg.map(byte).join(''), matches, total }
})
darkSolveResults.sort((a, b) => b.matches - a.matches)
const darkBg = hexToRgb(darkSolveResults[0].bg)

const WHITE = [255, 255, 255]
const light = SCALES.map((name) =>
  measureScale(name, values(radix[name]), values(radix[`${name}A`]), WHITE),
)
const dark = SCALES.map((name) =>
  measureScale(
    name,
    values(radix[`${name}Dark`]),
    values(radix[`${name}DarkA`]),
    darkBg,
  ),
)

const summary = {
  decision: 'D10-A alpha twins',
  algorithm:
    'Radix getAlphaColor: desired = white if any target channel > bg channel else black; ' +
    'A = ceil(max_c (t_c-b_c)/(desired-b_c) * 255)/255; channel = ceil(clamp(-(b(1-A)-t)/A)) ' +
    'with +/-1 correction against round(bg*(1-a))+round(fg*a); pure-gray shortcut returns ' +
    '(desired, desired, desired, exact alpha).',
  darkBackgroundSolve: {
    method:
      'brute-force neutral bg #000000..#202020, count exact hex matches of generated vs published *DarkA across 6 scales x 12 steps',
    top3: darkSolveResults.slice(0, 3),
    conclusion: darkSolveResults[0].bg,
  },
  light: {
    background: '#ffffff',
    totalSteps: light.length * 12,
    exactHexMatches: light.reduce((n, s) => n + s.exactHexMatches, 0),
    maxCompositeErrComputed: Math.max(
      ...light.map((s) => s.maxCompositeErrComputed),
    ),
    maxCompositeErrPublished: Math.max(
      ...light.map((s) => s.maxCompositeErrPublished),
    ),
    perScale: light,
  },
  dark: {
    background: darkSolveResults[0].bg,
    totalSteps: dark.length * 12,
    exactHexMatches: dark.reduce((n, s) => n + s.exactHexMatches, 0),
    maxCompositeErrComputed: Math.max(
      ...dark.map((s) => s.maxCompositeErrComputed),
    ),
    maxCompositeErrPublished: Math.max(
      ...dark.map((s) => s.maxCompositeErrPublished),
    ),
    perScale: dark,
  },
}

const out = new URL('./data/alpha-parity.json', import.meta.url)
writeFileSync(out, JSON.stringify(summary, null, 2) + '\n')

console.log('dark bg solve top3:', darkSolveResults.slice(0, 3))
console.log(
  `light: ${summary.light.exactHexMatches}/${summary.light.totalSteps} exact, maxErr computed=${summary.light.maxCompositeErrComputed} published=${summary.light.maxCompositeErrPublished}`,
)
console.log(
  `dark:  ${summary.dark.exactHexMatches}/${summary.dark.totalSteps} exact, maxErr computed=${summary.dark.maxCompositeErrComputed} published=${summary.dark.maxCompositeErrPublished}`,
)
for (const mode of [light, dark])
  for (const s of mode)
    for (const st of s.steps)
      if (!st.hexMatch)
        console.log(
          `  mismatch ${s.scale}${mode === dark ? 'Dark' : ''}[${st.step}]: published=${st.published} computed=${st.computed} (errC=${st.compositeErrComputed}, errP=${st.compositeErrPublished})`,
        )
