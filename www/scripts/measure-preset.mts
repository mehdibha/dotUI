/**
 * Measures presets and the products they recreate with the same probe
 * (src/modules/preset-lab/probe.ts), then diffs the two. Run from www/.
 *
 *   tsx scripts/measure-preset.mts --preset <id> [--mode light|dark|both] [--port 5173]
 *     Measures the preset's specimen sheets (dev server running) into
 *     <out>/<id>/measures.json and, when refs/<id>/tokens.json exists, prints
 *     reference vs preset for every property the reference measured.
 *
 *   tsx scripts/measure-preset.mts --url <url> --targets <file> [--mode light|dark]
 *     Measures a public page headless and prints its measures as JSON.
 *
 *   tsx scripts/measure-preset.mts --snippet --targets <file>
 *     Prints the probe as one JavaScript expression, for a signed-in tab
 *     driven by Claude in Chrome.
 *
 * A targets file maps part names (see SPECIMEN_TARGETS) to { selector, text,
 * within, nth, surface }.
 */
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer"

import { compareMeasures } from "../src/modules/preset-lab/compare"
import {
  type Measures,
  type ReferenceTokens,
  SPECIMEN_TARGETS,
  snippet,
  type Target,
} from "../src/modules/preset-lab/probe"

const { values: args } = parseArgs({
  options: {
    preset: { type: "string" },
    url: { type: "string" },
    snippet: { type: "boolean", default: false },
    targets: { type: "string" },
    mode: { type: "string", default: "both" },
    port: { type: "string", default: "5173" },
    out: { type: "string", default: ".scratch-specimens" },
  },
})

const REFS = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/modules/preset-lab/refs",
)
const MODES = (args.mode === "both" ? ["light", "dark"] : [args.mode]) as (
  | "light"
  | "dark"
)[]
if (!MODES.every((m) => m === "light" || m === "dark")) {
  console.error("--mode must be light, dark or both")
  process.exit(1)
}

const readTargets = async (): Promise<Record<string, Target>> => {
  if (!args.targets) {
    console.error("--targets <file> is required with --url and --snippet")
    process.exit(1)
  }
  return JSON.parse(await readFile(args.targets, "utf8"))
}

if (args.snippet) {
  console.log(snippet(await readTargets()))
  process.exit(0)
}

const launch = () =>
  puppeteer.launch({
    headless: "shell",
    // Cloud containers run as root, where Chrome's sandbox refuses to start.
    args: process.getuid?.() === 0 ? ["--no-sandbox"] : [],
  })

if (args.url) {
  const targets = await readTargets()
  const browser = await launch()
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: MODES[0] },
    ])
    await page.goto(args.url, { waitUntil: "networkidle2", timeout: 60000 })
    console.log(JSON.stringify(await page.evaluate(snippet(targets)), null, 2))
  } finally {
    await browser.close()
  }
  process.exit(0)
}

if (!args.preset) {
  console.error(
    "usage: --preset <id> | --url <url> --targets <file> | --snippet --targets <file>",
  )
  process.exit(1)
}
const preset = args.preset

const BASE = `http://localhost:${args.port}/internal/specimens`
const bySheet = new Map<string, Record<string, Target>>()
for (const [part, { sheet, target }] of Object.entries(SPECIMEN_TARGETS))
  bySheet.set(sheet, { ...bySheet.get(sheet), [part]: target })

const measured: ReferenceTokens = {}
const browser = await launch()
try {
  for (const mode of MODES) {
    const measures: Measures = {}
    for (const [sheet, targets] of bySheet) {
      const page = await browser.newPage()
      try {
        await page.setViewport({ width: 1280, height: 900 })
        await page.emulateMediaFeatures([
          { name: "prefers-color-scheme", value: mode },
        ])
        await page.goto(
          `${BASE}?preset=${preset}&mode=${mode}&sheet=${sheet}`,
          { waitUntil: "networkidle0", timeout: 60000 },
        )
        await page.waitForSelector("html[data-specimen-ready]", {
          timeout: 30000,
        })
        Object.assign(measures, await page.evaluate(snippet(targets)))
      } finally {
        await page.close()
      }
    }
    measured[mode] = measures
  }
} finally {
  await browser.close()
}

const outDir = resolve(args.out, preset)
await mkdir(outDir, { recursive: true })
await writeFile(
  resolve(outDir, "measures.json"),
  `${JSON.stringify(measured, null, 2)}\n`,
)
console.log(`measures → ${resolve(outDir, "measures.json")}`)

const tokensFile = resolve(REFS, preset, "tokens.json")
if (!existsSync(tokensFile)) {
  console.log(`no reference at ${tokensFile}: nothing to diff`)
  process.exit(0)
}
const reference: ReferenceTokens = JSON.parse(
  await readFile(tokensFile, "utf8"),
)
let failing = 0
for (const mode of MODES) {
  const rows = compareMeasures(reference[mode] ?? {}, measured[mode] ?? {})
  if (rows.length === 0) continue
  console.log(`\n## ${preset} · ${mode}\n`)
  console.log("| part | prop | reference | preset | delta | |")
  console.log("| --- | --- | --- | --- | --- | --- |")
  for (const row of rows) {
    if (!row.ok) failing++
    console.log(
      `| ${row.part} | ${row.prop} | ${row.reference} | ${row.preset} | ${row.delta} | ${row.ok ? "ok" : "**off**"} |`,
    )
  }
}
console.log(`\n${failing} propert${failing === 1 ? "y" : "ies"} off`)
