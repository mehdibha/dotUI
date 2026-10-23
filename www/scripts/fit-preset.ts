/**
 * Fit: the studio state whose specimens read closest to a pack's reference
 * (refs/<id>/tokens.json), searched key by key with the dev server running.
 * Every candidate is rendered for real, in place (`__specimen.setDiff`) on
 * the sheets it can change; a sensitivity map says which ones those are.
 * Color and font keys are left out (see fit.ts). Run from www/.
 *
 *   tsx scripts/fit-preset.ts --pack <id> [--preset <id>] [--keys a,b*] [--rounds 6] [--port 5173]
 *     Starts from the preset's state (--preset origin for a new one) and
 *     prints the changes the search keeps, the off rows before and after,
 *     the preset's full draft diff, and the residual rows by look. Writes
 *     .scratch-specimens/<pack>/fit.json. --keys limits the search to those
 *     keys (a trailing * matches a prefix).
 *
 *   --write-gaps  replaces the pack's "fit" entries in gaps.json with the
 *                 residual rows.
 *   --map         re-renders the searched keys' sensitivity, which is
 *                 otherwise rendered once per key and reused while the
 *                 registry, the studio, the sheets and the probe are
 *                 unchanged.
 */
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { parseArgs } from "node:util"
import type { Browser, Page } from "puppeteer"

import {
  type Axis,
  changedRows,
  type Measured,
  optionsOf,
  residualGaps,
  rowId,
  type Score,
  score,
  type SensitivityMap,
  type Value,
} from "../src/modules/preset-lab/fit"
import type { GapsFile } from "../src/modules/preset-lab/looks"
import {
  type Measures,
  SPECIMEN_TARGETS,
  snippet,
  type Target,
} from "../src/modules/preset-lab/probe"
import { getPreset } from "../src/modules/presets"
import {
  DEFAULTS,
  FOLLOWS,
  KEY_OWNER,
  parseState,
  SCHEMA,
  type StudioState,
} from "../src/modules/studio/axes"
import { designSystemOf } from "../src/modules/studio/resolve"
import {
  focusable,
  launch,
  type Mode,
  pool,
  PROBE,
  readReference,
  REFS,
  settle,
  versionOf,
} from "./preset-pages"

const { values: args } = parseArgs({
  options: {
    pack: { type: "string" },
    preset: { type: "string" },
    keys: { type: "string" },
    rounds: { type: "string", default: "6" },
    port: { type: "string", default: "5173" },
    out: { type: "string", default: ".scratch-specimens" },
    map: { type: "boolean", default: false },
    "write-gaps": { type: "boolean", default: false },
  },
})

const pack = args.pack
const reference = pack ? readReference(pack) : undefined
if (!pack || !reference) {
  console.error("--pack <id> naming a pack with a tokens.json is required")
  process.exit(1)
}
const start = getPreset(args.preset ?? pack)
if (!start) {
  console.error(
    `no preset "${args.preset ?? pack}": pass --preset origin for a new one`,
  )
  process.exit(1)
}
const readJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await readFile(file, "utf8")) as T
const MODES = (["light", "dark"] as const).filter((mode) => reference[mode])
if (reference.probe !== PROBE)
  console.log(
    `The reference was measured with probe ${reference.probe ?? "(unrecorded)"}, the specimens with ${PROBE}.`,
  )

type Diff = Record<string, Value>
/* Colors, fonts and the color engine's own dials (hue, vividness, tint,
   page lightness) stay out; the color chapter's routing enums stay in. */
const SKIP = new Set(["color", "font"])
const searched = (key: string, axis: Axis) =>
  !SKIP.has(axis.value.type) &&
  (KEY_OWNER[key] !== "color" || axis.value.type === "enum")
const wanted = (key: string) =>
  !args.keys ||
  args.keys
    .split(",")
    .some((glob) =>
      glob.endsWith("*") ? key.startsWith(glob.slice(0, -1)) : key === glob,
    )
const KEYS = Object.entries(SCHEMA as Record<string, Axis>)
  .filter(([key, axis]) => searched(key, axis) && wanted(key))
  .map(([key]) => key)
const followsOf = (key: string) =>
  (FOLLOWS[key] ?? []).map((follow) => String(follow.id))

/* What a state renders, as the specimens page builds it: candidates that
   resolve to the same design system render the same. */
const stateOf = (diff: Diff) => parseState({ ...start.state, ...diff })
const fingerprint = (state: StudioState) =>
  JSON.stringify(designSystemOf(state))

// The specimens: every sheet in every mode the reference has, open once.
const SHEETS = new Map<string, Record<string, Target>>()
for (const [part, { sheet, target }] of Object.entries(SPECIMEN_TARGETS))
  SHEETS.set(sheet, { ...SHEETS.get(sheet), [part]: target })
const sheetOf = new Map(
  Object.entries(SPECIMEN_TARGETS).map(([part, { sheet }]) => [part, sheet]),
)

interface Tab {
  mode: Mode
  sheet: string
  targets: Record<string, Target>
  page: Page
  /** What the tab shows now. */
  shown?: string
}

async function openTabs(browser: Browser, preset: string): Promise<Tab[]> {
  const jobs = MODES.flatMap((mode) =>
    [...SHEETS].map(([sheet, targets]) => ({ mode, sheet, targets })),
  )
  return pool(
    jobs,
    async ({ mode, sheet, targets }) => {
      const page = await browser.newPage()
      await focusable(page)
      await page.setViewport({ width: 1280, height: 900 })
      await page.emulateMediaFeatures([
        { name: "prefers-color-scheme", value: mode },
      ])
      await page.goto(
        `http://localhost:${args.port}/internal/specimens?preset=${preset}&mode=${mode}&sheet=${sheet}`,
        {
          waitUntil: "networkidle0",
          timeout: 120000,
        },
      )
      await page.waitForSelector("html[data-specimen-ready]", {
        timeout: 60000,
      })
      await settle(page)
      return { mode, sheet, targets, page, shown: "{}" }
    },
    6,
  )
}

/* Re-renders the tabs of the given sheets (all by default) with `diff`
   over the tab's preset, refocuses the focus specimen, and reads them. A
   tab the dev server reloaded (a source edit) is loaded again and read. */
async function render(
  tabs: Tab[],
  diff: Diff,
  sheets?: Set<string>,
): Promise<Measured> {
  const json = JSON.stringify(diff)
  const measured: Measured = {}
  const read = async (tab: Tab) => {
    if (tab.shown !== json) {
      // Resolves on the commit; two frames more for styles to land.
      await tab.page.evaluate(`window.__specimen.setDiff(${json})`)
      await tab.page.evaluate(
        `new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))`,
      )
      await tab.page.evaluate(
        `document.querySelector("[data-specimen-focus]")?.focus({ preventScroll: true })`,
      )
      await settle(tab.page)
      tab.shown = json
    }
    return (await tab.page.evaluate(snippet(tab.targets))) as Measures
  }
  await Promise.all(
    tabs
      .filter((tab) => !sheets || sheets.has(tab.sheet))
      .map(async (tab) => {
        let measures: Measures
        try {
          measures = await read(tab)
        } catch (error) {
          if (
            !/context was destroyed|detached|navigat/i.test(
              (error as Error).message,
            )
          )
            throw error
          await tab.page.reload({ waitUntil: "networkidle0", timeout: 120000 })
          await tab.page.waitForSelector("html[data-specimen-ready]", {
            timeout: 60000,
          })
          tab.shown = "{}"
          measures = await read(tab)
        }
        measured[tab.mode] = { ...measured[tab.mode], ...measures }
      }),
  )
  return measured
}

const overlay = (base: Measured, top: Measured): Measured =>
  Object.fromEntries(
    MODES.map((mode) => [mode, { ...base[mode], ...top[mode] }]),
  )

// The sensitivity map: each candidate's rows, set alone on Origin.
const BUILD = versionOf(
  "../../registry",
  "../studio",
  "sheets",
  "page.tsx",
  "probe.ts",
)
const mapFile = resolve(args.out, `sensitivity-${BUILD}.json`)
const ORIGIN = parseState({})

async function sensitivity(browser: Browser): Promise<SensitivityMap> {
  const map: SensitivityMap = existsSync(mapFile)
    ? await readJson(mapFile)
    : { probe: PROBE, build: BUILD, keys: {} }
  const todo = KEYS.filter((key) => args.map || !map.keys[key])
  if (!todo.length) return map
  const tabs = await openTabs(browser, "origin")
  const base = await render(tabs, {})
  const originPrint = fingerprint(ORIGIN)
  let done = 0
  const began = Date.now()
  for (const key of todo) {
    const axis = (SCHEMA as Record<string, Axis>)[key] as Axis
    const rows: Record<string, string[]> = {}
    const options = optionsOf(
      axis,
      (ORIGIN as Record<string, Value>)[key] ?? null,
      followsOf(key),
    )
    // A number moves the same rows across its range: five steps tell which.
    const numeric = axis.value.type === "number"
    const every = numeric ? Math.ceil(options.length / 5) : 1
    for (const option of options.filter((_, i) => i % every === 0)) {
      const state = parseState({ ...ORIGIN, [key]: option })
      // Hidden or pinned on Origin: no rows, and the fit renders it in full.
      if (fingerprint(state) === originPrint) continue
      rows[String(option)] = changedRows(
        base,
        await render(tabs, { [key]: option }),
      )
    }
    if (numeric) rows["*"] = [...new Set(Object.values(rows).flat())]
    map.keys[key] = rows
    if (++done % 10 === 0)
      console.log(
        `sensitivity: ${done}/${todo.length} keys, ${Math.round((Date.now() - began) / 1000)}s`,
      )
  }
  await Promise.all(tabs.map((tab) => tab.page.close()))
  await mkdir(args.out, { recursive: true })
  await writeFile(mapFile, `${JSON.stringify(map)}\n`)
  console.log(`sensitivity map → ${mapFile} (${todo.length} keys rendered)`)
  return map
}

const sheetsOf = (rows: string[]) =>
  new Set(rows.map((row) => sheetOf.get(row.split(" ")[1] ?? "") ?? ""))

interface Step {
  key: string
  value: Value
  before: number
  after: number
  fixed: string[]
  broke: string[]
}

const browser = await launch()
let result: { diff: Diff; first: Score; last: Score; steps: Step[] }
try {
  const map = await sensitivity(browser)
  const tabs = await openTabs(browser, start.id)
  let diff: Diff = {}
  let measured = await render(tabs, diff)
  const first = score(reference, measured)
  let current = first
  const steps: Step[] = []
  console.log(
    `start: ${start.id}, ${current.off} rows off (score ${current.score.toFixed(1)})`,
  )
  for (let round = 1; round <= Number(args.rounds); round++) {
    const off = new Set(
      current.rows.filter((row) => !row.ok && !row.missing).map(rowId),
    )
    if (!off.size) break
    const state = stateOf(diff)
    const printed = new Set([fingerprint(state)])
    const candidates: { key: string; value: Value; rows?: string[] }[] = []
    for (const key of KEYS) {
      const axis = (SCHEMA as Record<string, Axis>)[key] as Axis
      const value = (state as Record<string, Value>)[key] ?? null
      // Numbers go coarse first, then a few steps either side.
      const numeric = axis.value.type === "number"
      const options = optionsOf(
        axis,
        value,
        followsOf(key),
        numeric && round > 1 ? 3 : undefined,
      ).filter((_, i) => !numeric || round > 1 || i % 4 === 0)
      for (const option of options) {
        const print = fingerprint(stateOf({ ...diff, [key]: option }))
        if (printed.has(print)) continue
        printed.add(print)
        const rows =
          map.keys[key]?.[String(option)] ?? map.keys[key]?.["*"]
        if (rows && !rows.some((row) => off.has(row))) continue
        candidates.push({ key, value: option, rows })
      }
    }
    console.log(
      `round ${round}: ${candidates.length} candidates touch the ${off.size} off rows`,
    )
    const tried: (Step & { measured: Measured; rows?: string[] })[] = []
    for (const candidate of candidates) {
      const sheets = candidate.rows ? sheetsOf(candidate.rows) : undefined
      const next = { ...diff, [candidate.key]: candidate.value }
      const read = overlay(measured, await render(tabs, next, sheets))
      const after = score(reference, read)
      if (after.score < current.score - 0.01) {
        const was = new Set(current.rows.filter((row) => row.ok).map(rowId))
        const now = new Set(after.rows.filter((row) => row.ok).map(rowId))
        tried.push({
          key: candidate.key,
          value: candidate.value,
          before: current.score,
          after: after.score,
          fixed: [...now].filter((row) => !was.has(row)),
          broke: [...was].filter((row) => !now.has(row)),
          measured: read,
          rows: candidate.rows,
        })
      }
    }
    if (!tried.length) break
    // The best, then the next ones that touch other rows, each kept only if
    // the full render still scores lower.
    tried.sort((a, b) => a.after - b.after)
    const touched = new Set<string>()
    let kept = 0
    for (const step of tried) {
      if (step.rows?.some((row) => touched.has(row)) || (kept && !step.rows))
        continue
      const next = { ...diff, [step.key]: step.value }
      const read = await render(tabs, next)
      const after = score(reference, read)
      if (after.score >= current.score - 0.01) continue
      steps.push({
        ...step,
        before: current.score,
        after: after.score,
        measured: undefined,
      } as Step)
      console.log(
        `  ${step.key}: ${JSON.stringify(step.value)} → score ${after.score.toFixed(1)}, ${after.off} off`,
      )
      diff = next
      measured = read
      current = after
      kept++
      for (const row of step.rows ?? []) touched.add(row)
    }
    await render(tabs, diff)
  }
  result = { diff, first, last: current, steps }
} finally {
  await browser.close()
}

// The changes kept, the preset's full diff over Origin, and what is left.
const { diff, first, last, steps } = result
const final = stateOf(diff) as Record<string, Value>
const draft = Object.fromEntries(
  Object.keys(SCHEMA)
    .filter(
      (key) =>
        JSON.stringify(final[key]) !==
        JSON.stringify((DEFAULTS as Record<string, Value>)[key]),
    )
    .map((key) => [key, final[key]]),
)
const { gaps, unfiled } = residualGaps(last.rows, PROBE)

console.log(`\n# Fit: ${pack} from ${start.id} (probe ${PROBE})\n`)
console.log(
  `${first.off} rows off → ${last.off} (score ${first.score.toFixed(1)} → ${last.score.toFixed(1)}).\n`,
)
if (steps.length) {
  console.log("| key | value | fixed | broke |")
  console.log("| --- | --- | --- | --- |")
  for (const step of steps)
    console.log(
      `| ${step.key} | ${JSON.stringify(step.value)} | ${step.fixed.join(", ")} | ${step.broke.join(", ")} |`,
    )
} else console.log("No change scores lower.")
console.log(
  `\n## Draft diff\n\n\`\`\`ts\n${JSON.stringify(draft, null, 2)}\n\`\`\``,
)
console.log("\n## Residual rows by look\n")
for (const gap of gaps)
  console.log(
    `- \`${gap.look}\`: ${(gap.rows ?? []).map((row) => `${row.mode} ${row.part} ${row.prop} ${row.reference} (ours ${row.preset})`).join("; ")}`,
  )
if (unfiled.length)
  console.log(
    `- no look: ${unfiled.map((row) => `${row.mode} ${row.part} ${row.prop}`).join(", ")}`,
  )

await mkdir(resolve(args.out, pack), { recursive: true })
const outFile = resolve(args.out, pack, "fit.json")
await writeFile(
  outFile,
  `${JSON.stringify({ probe: PROBE, build: BUILD, from: start.id, before: { off: first.off, score: first.score }, after: { off: last.off, score: last.score }, steps, changes: diff, draft, gaps, unfiled }, null, 1)}\n`,
)
console.log(`\nfit → ${outFile}`)

if (args["write-gaps"]) {
  const file = resolve(REFS, pack, "gaps.json")
  const existing: GapsFile = existsSync(file)
    ? await readJson(file)
    : { gaps: [] }
  const kept = existing.gaps.filter((gap) => !gap.source.startsWith("fit "))
  await writeFile(
    file,
    `${JSON.stringify({ gaps: [...kept, ...gaps] }, null, 2)}\n`,
  )
  console.log(`gaps → ${file} (${gaps.length} fit entries)`)
}
