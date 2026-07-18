// D10-B — Status seeds CVD gate: measure min pairwise dEok of dotUI's current
// SEMANTIC_COLORS (+ typical blue accent) under protan/deutan/tritan severity
// 1.0 (culori Machado filters), then search a replacement 4-seed set (same hue
// families) maximizing the min pairwise dEok across normal + all three CVDs.
//
// dEok = Euclidean distance in OKLab (0..~1 range; ~0.02 is roughly one JND).
//
// Run: node research/status-cvd.mjs   (from packages/colors)

import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const {
  rgb,
  oklch,
  formatHex,
  clampChroma,
  differenceEuclidean,
  filterDeficiencyProt,
  filterDeficiencyDeuter,
  filterDeficiencyTrit,
} = require('culori')

const dEok = differenceEuclidean('oklab')

const CONDITIONS = {
  normal: (c) => c,
  protan: filterDeficiencyProt(1),
  deutan: filterDeficiencyDeuter(1),
  tritan: filterDeficiencyTrit(1),
}

const ACCENT = '#438cd6' // typical blue accent, fixed

// dotUI packages/colors/src/shared/constants.ts SEMANTIC_COLORS (Tailwind hexes)
const CURRENT = {
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#3b82f6',
}

// Radix solid steps as a reference point (grass9/amber9/red9/blue9)
const RADIX_REF = {
  success: '#46a758',
  warning: '#ffc53d',
  danger: '#e5484b',
  info: '#0090ff',
}

const round4 = (n) => Math.round(n * 1e4) / 1e4

function evaluateSet(named) {
  const entries = Object.entries(named) // [name, hex][]
  const perCondition = {}
  let globalMin = Infinity
  let globalMinPair = null
  for (const [cond, filter] of Object.entries(CONDITIONS)) {
    const sim = entries.map(([name, hex]) => [name, filter(rgb(hex))])
    const pairs = []
    let min = Infinity
    let minPair = null
    for (let i = 0; i < sim.length; i++)
      for (let j = i + 1; j < sim.length; j++) {
        const d = dEok(sim[i][1], sim[j][1])
        pairs.push({ pair: `${sim[i][0]}-${sim[j][0]}`, dEok: round4(d) })
        if (d < min) {
          min = d
          minPair = `${sim[i][0]}-${sim[j][0]}`
        }
      }
    perCondition[cond] = { min: round4(min), minPair, pairs }
    if (min < globalMin) {
      globalMin = min
      globalMinPair = `${cond}:${minPair}`
    }
  }
  return {
    colors: named,
    globalMin: round4(globalMin),
    globalMinPair,
    perCondition,
  }
}

// objective for the search: min pairwise dEok over {4 seeds + accent},
// across normal + protan + deutan + tritan (exact score, no pair table)
function score(seedHexes) {
  const all = [...seedHexes, ACCENT]
  let min = Infinity
  for (const filter of Object.values(CONDITIONS)) {
    const sim = all.map((hex) => filter(rgb(hex)))
    for (let i = 0; i < sim.length; i++)
      for (let j = i + 1; j < sim.length; j++) {
        const d = dEok(sim[i], sim[j])
        if (d < min) min = d
      }
  }
  return min
}

// ---------- search: coordinate ascent on an OKLCH grid ----------
// Hue families kept: success=green, warning=amber/orange, danger=red, info=blue.
// Candidates stay solid-button-plausible: L in [0.55, 0.80], C >= 0.12 (in gamut).

const FAMILIES = {
  success: { hue: [135, 165] },
  warning: { hue: [55, 95] },
  danger: { hue: [15, 40] },
  info: { hue: [230, 270] },
}
const L_GRID = []
for (let l = 0.55; l <= 0.801; l += 0.025) L_GRID.push(round4(l))
const C_GRID = []
for (let c = 0.12; c <= 0.301; c += 0.02) C_GRID.push(round4(c))

function candidates(family) {
  const out = []
  const [h0, h1] = FAMILIES[family].hue
  for (let h = h0; h <= h1; h += 5)
    for (const l of L_GRID)
      for (const c of C_GRID) {
        const clamped = clampChroma({ mode: 'oklch', l, c, h }, 'oklch')
        if (clamped.c < 0.12 - 1e-6) continue // out-of-gamut below the chroma floor
        const hex = formatHex(rgb(clamped))
        // dedupe identical hexes produced by chroma clamping
        if (!out.some((o) => o.hex === hex))
          out.push({ hex, l, c: round4(clamped.c), h })
      }
  return out
}

const FAMILY_ORDER = ['success', 'warning', 'danger', 'info']
const CANDS = Object.fromEntries(FAMILY_ORDER.map((f) => [f, candidates(f)]))

// identity-preserving variant: each seed's L held within +/-0.05 of the
// current Tailwind seed's OKLCH L, so the win can't come purely from
// staggering lightness
const CURRENT_L = Object.fromEntries(
  FAMILY_ORDER.map((f) => [f, oklch(rgb(CURRENT[f])).l]),
)
const CANDS_IDENTITY = Object.fromEntries(
  FAMILY_ORDER.map((f) => [
    f,
    CANDS[f].filter((c) => Math.abs(c.l - CURRENT_L[f]) <= 0.05 + 1e-9),
  ]),
)

function coordinateAscent(startHexes, cands = CANDS) {
  const current = { ...startHexes }
  let best = score(FAMILY_ORDER.map((f) => current[f]))
  for (let round = 0; round < 10; round++) {
    let improved = false
    for (const family of FAMILY_ORDER) {
      for (const cand of cands[family]) {
        const trial = { ...current, [family]: cand.hex }
        const s = score(FAMILY_ORDER.map((f) => trial[f]))
        if (s > best + 1e-9) {
          best = s
          current[family] = cand.hex
          improved = true
        }
      }
    }
    if (!improved) break
  }
  return { seeds: current, score: best }
}

// two deterministic starts to reduce local-optimum risk
const startA = coordinateAscent(CURRENT)
const startB = coordinateAscent(RADIX_REF)
const winner = startA.score >= startB.score ? startA : startB

const identA = coordinateAscent(CURRENT, CANDS_IDENTITY)
const identB = coordinateAscent(RADIX_REF, CANDS_IDENTITY)
const identityWinner = identA.score >= identB.score ? identA : identB

const withOklch = (seeds) =>
  Object.fromEntries(
    Object.entries(seeds).map(([k, hex]) => {
      const o = oklch(rgb(hex))
      return [
        k,
        { hex, oklch: { l: round4(o.l), c: round4(o.c), h: round4(o.h ?? 0) } },
      ]
    }),
  )

const result = {
  decision: 'D10-B status seeds CVD gate',
  method:
    'culori Machado filterDeficiency{Prot,Deuter,Trit}(1.0) on sRGB; dEok = Euclidean in OKLab. ' +
    'Sets evaluated as 4 status seeds + fixed accent #438cd6 (10 pairs) under 4 conditions. ' +
    'Search: deterministic coordinate ascent over OKLCH grid (L 0.55-0.80 step 0.025, C 0.12-0.30 ' +
    'step 0.02 gamut-clamped, H step 5deg in family windows: green 135-165, amber 55-95, red 15-40, ' +
    'blue 230-270), objective = min pairwise dEok across normal+protan+deutan+tritan, two starts ' +
    '(current seeds, Radix 9s).',
  accent: ACCENT,
  jndNote: 'dEok ~0.02 is roughly one just-noticeable difference',
  current: evaluateSet({ ...CURRENT, accent: ACCENT }),
  currentWithoutAccent: evaluateSet(CURRENT),
  radixReference: evaluateSet({ ...RADIX_REF, accent: ACCENT }),
  search: {
    fromCurrentStart: startA,
    fromRadixStart: startB,
    winner: {
      seeds: withOklch(winner.seeds),
      minPairwiseDEok: round4(winner.score),
      evaluation: evaluateSet({ ...winner.seeds, accent: ACCENT }),
      withoutAccent: evaluateSet(winner.seeds),
    },
    identityPreserving: {
      note: 'same search with each seed L held within +/-0.05 of the current Tailwind seed L',
      seeds: withOklch(identityWinner.seeds),
      minPairwiseDEok: round4(identityWinner.score),
      evaluation: evaluateSet({ ...identityWinner.seeds, accent: ACCENT }),
      withoutAccent: evaluateSet(identityWinner.seeds),
    },
  },
}

const out = new URL('./data/status-cvd.json', import.meta.url)
writeFileSync(out, JSON.stringify(result, null, 2) + '\n')

const brief = (label, ev) =>
  console.log(
    `${label}: globalMin=${ev.globalMin} (${ev.globalMinPair}) | normal=${ev.perCondition.normal.min} protan=${ev.perCondition.protan.min} deutan=${ev.perCondition.deutan.min} tritan=${ev.perCondition.tritan.min}`,
  )
brief('current+accent ', result.current)
brief('current alone  ', result.currentWithoutAccent)
brief('radix9+accent  ', result.radixReference)
console.log('winner seeds:', winner.seeds, 'score', round4(winner.score))
brief('winner+accent  ', result.search.winner.evaluation)
brief('winner alone   ', result.search.winner.withoutAccent)
console.log(
  'identity seeds:',
  identityWinner.seeds,
  'score',
  round4(identityWinner.score),
)
brief('identity+accent', result.search.identityPreserving.evaluation)
