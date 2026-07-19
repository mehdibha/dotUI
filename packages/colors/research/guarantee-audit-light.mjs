// D2 claim audit, light mode: text steps 11/12 against background steps
// 1/2/3 across all 31 Radix light scales. Verifies the SPEC claims:
// worst step-11 Lc on step-2 >= 60, worst step-12 >= 90, and six scales
// under WCAG 4.5 at step 11.

import { writeFileSync } from 'node:fs'
import * as radix from '@radix-ui/colors'

import { RADIX_ALL, apcaLc, radixSteps, round, wcagRatio } from './lib.mjs'

const TEXT_STEPS = [11, 12]
const BG_STEPS = [1, 2, 3]

const perScale = {}
for (const name of RADIX_ALL) {
  const steps = radixSteps(radix[name])
  const pairs = {}
  for (const t of TEXT_STEPS) {
    for (const bg of BG_STEPS) {
      pairs[`${t}v${bg}`] = {
        text: steps[t],
        bg: steps[bg],
        wcag: round(wcagRatio(steps[t], steps[bg]), 3),
        apcaLc: round(Math.abs(apcaLc(steps[t], steps[bg])), 2),
      }
    }
  }
  perScale[name] = pairs
}

const summary = {}
for (const t of TEXT_STEPS) {
  for (const bg of BG_STEPS) {
    const key = `${t}v${bg}`
    const lcs = RADIX_ALL.map((n) => perScale[n][key].apcaLc)
    const wcags = RADIX_ALL.map((n) => perScale[n][key].wcag)
    summary[key] = {
      apcaLcMin: Math.min(...lcs),
      apcaLcMinScale: RADIX_ALL[lcs.indexOf(Math.min(...lcs))],
      wcagMin: Math.min(...wcags),
      wcagMinScale: RADIX_ALL[wcags.indexOf(Math.min(...wcags))],
    }
  }
}

const under45 = {}
for (const bg of BG_STEPS) {
  under45[`11v${bg}`] = RADIX_ALL.filter(
    (n) => perScale[n][`11v${bg}`].wcag < 4.5,
  ).map((n) => ({ scale: n, wcag: perScale[n][`11v${bg}`].wcag }))
}

const result = {
  meta: {
    source: '@radix-ui/colors 3.0.0 (light scales)',
    textSteps: TEXT_STEPS,
    bgSteps: BG_STEPS,
    scales: RADIX_ALL.length,
    claims: {
      'worst light step-11 Lc on step-2 >= 60': summary['11v2'].apcaLcMin >= 60,
      'worst light step-12 Lc on step-2 >= 90': summary['12v2'].apcaLcMin >= 90,
      'six scales under WCAG 4.5 at step 11 (on step-2)':
        under45['11v2'].length === 6,
    },
  },
  perScale,
  summary,
  wcagUnder45AtStep11: under45,
}

writeFileSync(
  new URL('./data/guarantee-audit-light.json', import.meta.url),
  JSON.stringify(result, null, 2) + '\n',
)

console.log('=== summary (min across 31 light scales) ===')
console.table(summary)
console.log('\n=== scales under WCAG 4.5 at step 11 ===')
for (const bg of BG_STEPS) {
  console.log(
    `vs step ${bg}:`,
    under45[`11v${bg}`].map((s) => `${s.scale}=${s.wcag}`).join(', ') || 'none',
  )
}
console.log('\n=== claims ===')
console.log(result.meta.claims)
