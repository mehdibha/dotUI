// D2 border bar: what contrast do Radix border steps (6/7/8) actually clear
// against background steps (1/2), light and dark? Plus Geist gray borders
// (values scraped from vercel.com/geist CSS chunks on 2026-07-18, all
// achromatic HSL, recorded here verbatim so the script stays offline).

import { writeFileSync } from 'node:fs'
import * as radix from '@radix-ui/colors'

import {
  RADIX_ALL,
  apcaLc,
  median,
  radixSteps,
  round,
  wcagRatio,
} from './lib.mjs'

const BORDER_STEPS = [6, 7, 8]
const BG_STEPS = [1, 2]

function measureMode(mode) {
  const perScale = {}
  for (const name of RADIX_ALL) {
    const steps = radixSteps(radix[mode === 'dark' ? `${name}Dark` : name])
    const pairs = {}
    for (const b of BORDER_STEPS) {
      for (const bg of BG_STEPS) {
        pairs[`${b}v${bg}`] = {
          border: steps[b],
          bg: steps[bg],
          wcag: round(wcagRatio(steps[b], steps[bg]), 3),
          apcaLc: round(Math.abs(apcaLc(steps[b], steps[bg])), 2),
        }
      }
    }
    perScale[name] = pairs
  }

  const summary = {}
  for (const b of BORDER_STEPS) {
    for (const bg of BG_STEPS) {
      const key = `${b}v${bg}`
      const wcags = RADIX_ALL.map((n) => perScale[n][key].wcag)
      const lcs = RADIX_ALL.map((n) => perScale[n][key].apcaLc)
      const argmin = RADIX_ALL[wcags.indexOf(Math.min(...wcags))]
      summary[key] = {
        wcagMin: round(Math.min(...wcags), 3),
        wcagMedian: round(median(wcags), 3),
        apcaLcMin: round(Math.min(...lcs), 2),
        apcaLcMedian: round(median(lcs), 2),
        minScale: argmin,
      }
    }
  }
  return { perScale, summary }
}

// Geist grays (achromatic): border tokens gray-400 (default border),
// gray-500 (hover border), gray-600 (focus/high-contrast border) vs
// background-100 (app bg) and background-200 (subtle bg).
const GEIST = {
  light: {
    'background-100': '#ffffff', // hsl(0,0%,100%)
    'background-200': '#fafafa', // hsl(0,0%,98%)
    'gray-400': '#eaeaea', // hsl(0,0%,92%)
    'gray-500': '#c9c9c9', // hsl(0,0%,79%)
    'gray-600': '#a8a8a8', // hsl(0,0%,66%)
  },
  dark: {
    'background-100': '#0a0a0a', // hsl(0,0%,4%)
    'background-200': '#000000', // hsl(0,0%,0%)
    'gray-400': '#2e2e2e', // hsl(0,0%,18%)
    'gray-500': '#454545', // hsl(0,0%,27%)
    'gray-600': '#878787', // hsl(0,0%,53%)
  },
}

function measureGeist(mode) {
  const t = GEIST[mode]
  const out = {}
  for (const border of ['gray-400', 'gray-500', 'gray-600']) {
    for (const bg of ['background-100', 'background-200']) {
      out[`${border} on ${bg}`] = {
        border: t[border],
        bg: t[bg],
        wcag: round(wcagRatio(t[border], t[bg]), 3),
        apcaLc: round(Math.abs(apcaLc(t[border], t[bg])), 2),
      }
    }
  }
  return out
}

const result = {
  meta: {
    source: '@radix-ui/colors 3.0.0; Geist values scraped 2026-07-18',
    borderSteps: BORDER_STEPS,
    bgSteps: BG_STEPS,
    scales: RADIX_ALL.length,
    note: 'apcaLc is |Lc| (border as APCA foreground); wcag is the WCAG 2 ratio',
  },
  radix: {
    light: measureMode('light'),
    dark: measureMode('dark'),
  },
  geist: {
    light: measureGeist('light'),
    dark: measureGeist('dark'),
  },
}

writeFileSync(
  new URL('./data/border-bars.json', import.meta.url),
  JSON.stringify(result, null, 2) + '\n',
)

for (const mode of ['light', 'dark']) {
  console.log(`\n=== Radix ${mode} (n=${RADIX_ALL.length}) ===`)
  console.table(result.radix[mode].summary)
}
console.log('\n=== Geist light ===')
console.table(result.geist.light)
console.log('\n=== Geist dark ===')
console.table(result.geist.dark)
