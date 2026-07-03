// Validates ds/data (roster + every system dir) against the schema and emits
// the static index consumed by routes at build time. `--check` validates only.
// Exits non-zero on any violation so CI fails on bad data.
import fs from 'node:fs'
import path from 'node:path'

import { questionBankVersion, questionById } from '../src/data/question-bank'
import { factsFileSchema, rosterSchema, systemSchema } from '../src/data/schema'
import type { DataIndex, SystemWithFacts } from '../src/data/schema'

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

const systems: SystemWithFacts[] = []

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

  const factsResult = factsFileSchema.safeParse(
    readJson(path.join(systemsDir, dir, 'facts.json')),
  )
  if (!factsResult.success) {
    errors.push(`${rel}/facts.json: ${factsResult.error.message}`)
    continue
  }

  const seenIds = new Set<string>()
  factsResult.data.forEach((fact, i) => {
    const question = questionById.get(fact.questionId)
    if (!question) {
      errors.push(
        `${rel}/facts.json[${i}]: unknown questionId "${fact.questionId}"`,
      )
      return
    }
    if (seenIds.has(fact.questionId)) {
      errors.push(
        `${rel}/facts.json[${i}]: duplicate questionId "${fact.questionId}"`,
      )
    }
    seenIds.add(fact.questionId)
    if (fact.status === 'answered') {
      const answer = question.answerShape.safeParse(fact.answer)
      if (!answer.success) {
        errors.push(
          `${rel}/facts.json[${i}] (${fact.questionId}): answer does not match the question's shape — ${answer.error.message}`,
        )
      }
    }
    // Single-session research retrieves and verifies the same day; phase-2
    // re-verification will relax this.
    for (const evidence of fact.evidence) {
      if (evidence.retrievedAt !== fact.verifiedAt) {
        errors.push(
          `${rel}/facts.json[${i}] (${fact.questionId}): evidence retrievedAt ${evidence.retrievedAt} != verifiedAt ${fact.verifiedAt}`,
        )
      }
    }
  })

  // Every researched system answers the full bank, or says why it can't.
  for (const question of questionById.values()) {
    if (!seenIds.has(question.id)) {
      errors.push(`${rel}/facts.json: missing fact for "${question.id}"`)
    }
  }

  systems.push({ ...systemResult.data, facts: factsResult.data })
}

if (errors.length > 0) {
  console.error(`[build-data-index] ${errors.length} problem(s):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

if (!checkOnly) {
  const index: DataIndex = {
    questionBankVersion,
    questionBank: [...questionById.values()].map(
      ({ answerShape: _answerShape, ...meta }) => meta,
    ),
    roster: rosterResult.success ? rosterResult.data.systems : [],
    systems,
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, `${JSON.stringify(index, null, 2)}\n`)
}

console.log(
  `[build-data-index] ${systemDirs.length} system(s), ${questionById.size} questions${checkOnly ? ' — valid' : ` → ${path.relative(root, outFile)}`}`,
)
