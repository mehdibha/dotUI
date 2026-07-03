// Validates ds/data (roster + every system dir) against the schema and emits
// the static index consumed by routes at build time. `--check` validates only.
// Exits non-zero on any violation so CI fails on bad data.
import fs from 'node:fs'
import path from 'node:path'

import {
  colorsFileSchema,
  rosterSchema,
  systemSchema,
} from '../src/data/schema'
import type { DataIndex, SystemWithColors } from '../src/data/schema'

const root = path.resolve(import.meta.dirname, '..')
const dataDir = path.join(root, 'data')
const outFile = path.join(root, 'src', 'data', '__generated__', 'index.json')
const checkOnly = process.argv.includes('--check')

const errors: string[] = []

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    errors.push(`${path.relative(root, file)}: ${(error as Error).message}`)
    return undefined
  }
}

const rosterRaw = readJson(path.join(dataDir, 'roster.json'))
const rosterResult = rosterSchema.safeParse(rosterRaw)
if (!rosterResult.success) {
  errors.push(`data/roster.json: ${rosterResult.error.message}`)
}

const systemsDir = path.join(dataDir, 'systems')
const systemDirs = fs.existsSync(systemsDir)
  ? fs
      .readdirSync(systemsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : []

const systems: SystemWithColors[] = []

for (const dir of systemDirs) {
  const rel = `data/systems/${dir}`
  const systemResult = systemSchema.safeParse(
    readJson(path.join(systemsDir, dir, 'system.json')),
  )
  if (!systemResult.success) {
    errors.push(`${rel}/system.json: ${systemResult.error.message}`)
    continue
  }
  if (systemResult.data.slug !== dir) {
    errors.push(
      `${rel}/system.json: slug "${systemResult.data.slug}" must match its directory name`,
    )
  }

  const colorsResult = colorsFileSchema.safeParse(
    readJson(path.join(systemsDir, dir, 'colors.json')),
  )
  if (!colorsResult.success) {
    errors.push(`${rel}/colors.json: ${colorsResult.error.message}`)
    continue
  }

  // Every per-mode value must use a declared mode, so the mode switcher and
  // table columns can trust `modes` as the complete set.
  const colors = colorsResult.data
  const modes = new Set(colors.modes)
  const checkValues = (values: Record<string, string>, where: string) => {
    for (const mode of Object.keys(values)) {
      if (!modes.has(mode)) {
        errors.push(
          `${rel}/colors.json: ${where} uses undeclared mode "${mode}"`,
        )
      }
    }
  }
  for (const ramp of colors.ramps) {
    for (const step of ramp.steps) {
      checkValues(step.values, `ramp "${ramp.name}" step ${step.step}`)
    }
  }
  for (const group of colors.tokenGroups) {
    for (const token of group.tokens) {
      checkValues(token.values, `token "${token.name}"`)
    }
  }
  for (const pair of colors.contrast) {
    if (pair.mode !== null && !modes.has(pair.mode)) {
      errors.push(
        `${rel}/colors.json: contrast pair "${pair.label}" uses undeclared mode "${pair.mode}"`,
      )
    }
  }

  systems.push({ ...systemResult.data, colors })
}

if (errors.length > 0) {
  console.error(`[build-data-index] ${errors.length} problem(s):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

if (!checkOnly) {
  const index: DataIndex = {
    roster: rosterResult.success ? rosterResult.data.systems : [],
    systems,
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, `${JSON.stringify(index, null, 2)}\n`)
}

console.log(
  `[build-data-index] ${systemDirs.length} system(s)${checkOnly ? ' — valid' : ` → ${path.relative(root, outFile)}`}`,
)
