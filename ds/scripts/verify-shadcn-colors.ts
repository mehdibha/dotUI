// Offline cross-check of the bespoke shadcn UI data (src/components/system/
// sections/shadcn/data.ts) against the committed, pinned snapshot — so the
// hand-curated page data is provable against upstream without hitting the live
// network. Run: pnpm --filter=ds verify:colors
//
// Replaces the old network verifier (which fetched ui.shadcn.com live). Values
// are now checked against sources/shadcn-ui/ at the pinned SHA; the machine
// extraction lives in systems/shadcn-ui/colors.json (see the pipeline).
import fs from 'node:fs'
import path from 'node:path'

import {
  BASE_COLORS,
  COLOR_THEME_VALUES,
  MODES,
  THEMES,
  THEME_OVERRIDE_TOKENS,
} from '../src/components/system/sections/shadcn/data'

const root = path.resolve(import.meta.dirname, '..')
const snapshotDir = path.join(root, 'sources', 'shadcn-ui')
const problems: string[] = []
const notes: string[] = []
const fail = (msg: string) => problems.push(msg)

const themesSrc = fs.readFileSync(path.join(snapshotDir, 'themes.ts'), 'utf8')
const legacySrc = fs.readFileSync(
  path.join(snapshotDir, '_legacy-base-colors.ts'),
  'utf8',
)

/** Read one theme's cssVars.{mode} object from the vendored themes.ts. */
function snapshotTheme(
  name: string,
  mode: string,
): Record<string, string> | null {
  const nameIdx = themesSrc.indexOf(`name: "${name}"`)
  if (nameIdx === -1) return null
  // Bound the block at the next theme's name.
  const nextIdx = themesSrc.indexOf('name: "', nameIdx + 8)
  const block = themesSrc.slice(nameIdx, nextIdx === -1 ? undefined : nextIdx)
  const modeIdx = block.indexOf(`${mode}: {`)
  if (modeIdx === -1) return null
  let depth = 0
  let end = -1
  for (let i = modeIdx + mode.length + 2; i < block.length; i++) {
    if (block[i] === '{') depth++
    else if (block[i] === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  const body = block.slice(modeIdx, end === -1 ? undefined : end)
  const vars: Record<string, string> = {}
  for (const m of body.matchAll(/"?([\w-]+)"?:\s*"([^"]+)"/g)) {
    if (m[1] === 'radius') continue
    vars[m[1]!] = m[2]!
  }
  return vars
}

// ── A. base-neutral themes match the snapshot exactly ──
// Upstream replaced gray/slate with mauve/olive/mist/taupe, so those two data.ts
// bases no longer exist in themes.ts — verify the three that remain and note it.
const VERIFIABLE_BASES = BASE_COLORS.filter((base) =>
  themesSrc.includes(`name: "${base}"`),
)
const MISSING_BASES = BASE_COLORS.filter(
  (base) => !themesSrc.includes(`name: "${base}"`),
)
if (MISSING_BASES.length > 0) {
  notes.push(
    `bases not in the pinned snapshot (upstream removed them): ${MISSING_BASES.join(', ')} — their data.ts values are unverifiable here.`,
  )
}

for (const base of VERIFIABLE_BASES) {
  for (const mode of MODES) {
    const upstream = snapshotTheme(base, mode)
    if (!upstream) {
      fail(`[base] ${base}.${mode}: not found in snapshot themes.ts`)
      continue
    }
    for (const [tok, val] of Object.entries(THEMES[base][mode])) {
      if (upstream[tok] !== val) {
        fail(
          `[base] ${base}.${mode}.${tok}: data.ts="${val}" snapshot="${upstream[tok] ?? '(absent)'}"`,
        )
      }
    }
  }
}

// ── B. colour-theme override values match baseColorsOKLCH ──
// data.ts's colour themes model shadcn's Themes page — recolouring primary/ring
// over a base gray — which is exactly the vendored baseColorsOKLCH map (keyed
// red/rose/orange/green/blue/yellow/violet), not the newer accent themes in
// themes.ts. Verify against that.
const oklchBlock = legacySrc.slice(
  legacySrc.indexOf('export const baseColorsOKLCH'),
)

/** Read a theme's {mode} object from baseColorsOKLCH (comments ignored). */
function legacyTheme(
  name: string,
  mode: string,
): Record<string, string> | null {
  const re = new RegExp(`\\n  ${name}: \\{`)
  const start = oklchBlock.search(re)
  if (start === -1) return null
  const rest = oklchBlock.slice(start + 5)
  const nextRel = rest.search(/\n  [a-z]+: \{/)
  const block = rest.slice(0, nextRel === -1 ? undefined : nextRel)
  const mMatch = block.match(new RegExp(`${mode}: \\{([\\s\\S]*?)\\n    \\}`))
  if (!mMatch) return null
  const vars: Record<string, string> = {}
  for (const m of mMatch[1]!.matchAll(/"?([\w-]+)"?:\s*"([^"]+)"/g)) {
    if (m[1] === 'radius') continue
    vars[m[1]!] = m[2]!
  }
  return vars
}

for (const theme of Object.keys(
  COLOR_THEME_VALUES,
) as (keyof typeof COLOR_THEME_VALUES)[]) {
  for (const mode of MODES) {
    const upstream = legacyTheme(theme, mode)
    if (!upstream) {
      notes.push(
        `colour theme "${theme}": no "${theme}" block in baseColorsOKLCH — skipped.`,
      )
      continue
    }
    for (const tok of THEME_OVERRIDE_TOKENS) {
      const mine = COLOR_THEME_VALUES[theme][mode][tok]
      if (upstream[tok] !== undefined && upstream[tok] !== mine) {
        fail(
          `[theme] ${theme}.${mode}.${tok}: data.ts="${mine}" legacy="${upstream[tok]}"`,
        )
      }
    }
  }
}

if (notes.length > 0) {
  console.log('notes:')
  for (const note of notes) console.log(`  - ${note}`)
}
if (problems.length > 0) {
  console.error(`✗ ${problems.length} discrepancy(ies) vs the pinned snapshot:`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(
  `✓ shadcn data.ts verified offline against sources/shadcn-ui/ (bases: ${VERIFIABLE_BASES.join(', ')}).`,
)
