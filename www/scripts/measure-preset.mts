/**
 * Measures presets and the products they recreate with the same probe
 * (src/modules/preset-lab/probe.ts), then diffs the two. Run from www/.
 *
 *   tsx scripts/measure-preset.mts --preset <id> [--mode light|dark|both] [--port 5173]
 *     Measures the preset's specimen sheets (dev server running) into
 *     <out>/<id>/measures.json and, when refs/<id>/tokens.json exists, prints
 *     reference vs preset for every property the reference measured.
 *
 *   tsx scripts/measure-preset.mts --pack <id> [--url <url>]
 *     Measures the pack's public pages (refs/<id>/targets.json) headless, runs
 *     each part's focus and `before` steps, and merges the results into
 *     refs/<id>/tokens.json.
 *
 *   tsx scripts/measure-preset.mts --pack <id> --url <url> --merge <file> [--mode light|dark]
 *     Merges a signed-in page's measures (the snippet's output, saved as
 *     JSON) into refs/<id>/tokens.json.
 *
 *   tsx scripts/measure-preset.mts --snippet (--pack <id> | --targets <file>) [--url <url>]
 *     Prints the probe as one JavaScript expression, for a signed-in tab
 *     driven by Claude in Chrome.
 *
 *   tsx scripts/measure-preset.mts --url <url> --targets <file> [--mode light|dark]
 *     Measures any page headless and prints its measures as JSON.
 *
 * A targets file maps part names (see SPECIMEN_TARGETS) to Targets. A pack's
 * targets.json maps page URLs to { mode?, signedIn?, parts }.
 */
import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import puppeteer, { type Browser, type KeyInput, type Page } from "puppeteer"

import { compareMeasures } from "../src/modules/preset-lab/compare"
import {
  type Measures,
  type Pack,
  type ReferenceTokens,
  SPECIMEN_TARGETS,
  snippet,
  type Target,
} from "../src/modules/preset-lab/probe"

const { values: args } = parseArgs({
  options: {
    preset: { type: "string" },
    pack: { type: "string" },
    url: { type: "string" },
    merge: { type: "string" },
    snippet: { type: "boolean", default: false },
    targets: { type: "string" },
    mode: { type: "string", default: "both" },
    port: { type: "string", default: "5173" },
    out: { type: "string", default: ".scratch-specimens" },
    concurrency: { type: "string", default: "4" },
  },
})

type Mode = "light" | "dark"

const LAB = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/modules/preset-lab",
)
const REFS = resolve(LAB, "refs")
const MODES = (args.mode === "both" ? ["light", "dark"] : [args.mode]) as Mode[]
if (!MODES.every((m) => m === "light" || m === "dark")) {
  console.error("--mode must be light, dark or both")
  process.exit(1)
}

/* The commit that last changed the probe or the compare, so measures and
   off counts from different versions aren't mixed up. */
const PROBE = (() => {
  const files = [resolve(LAB, "probe.ts"), resolve(LAB, "compare.ts")]
  const git = (...cmd: string[]) =>
    execFileSync("git", [...cmd, "--", ...files], { encoding: "utf8" }).trim()
  const sha = git("log", "-1", "--format=%h")
  return git("status", "--porcelain") ? `${sha}+dirty` : sha
})()

const TARGET_KEYS = new Set([
  "selector",
  "text",
  "within",
  "nth",
  "surface",
  "box",
  "ink",
  "focus",
  "before",
  "skip",
])
const isTargets = (value: unknown): value is Record<string, Target> =>
  typeof value === "object" &&
  value !== null &&
  Object.values(value).every(
    (target) =>
      typeof target === "object" &&
      target !== null &&
      Object.keys(target).every((key) => TARGET_KEYS.has(key)),
  )

const readJson = async (file: string) =>
  JSON.parse(await readFile(file, "utf8"))
const packFile = (id: string) => resolve(REFS, id, "targets.json")
const tokensFile = (id: string) => resolve(REFS, id, "tokens.json")

/** The parts to measure: a bare targets file, or one page of a pack. */
const readTargets = async (): Promise<Record<string, Target>> => {
  const file = args.pack ? packFile(args.pack) : args.targets
  if (!file) {
    console.error("--pack <id> or --targets <file> is required")
    process.exit(1)
  }
  const json: unknown = await readJson(file)
  if (isTargets(json)) return json
  const parts = (json as Pack)[args.url ?? ""]?.parts
  if (!isTargets(parts)) {
    console.error(
      `${file}: expected { "<part>": Target }, or a pack's { "<url>": { parts } } with --url naming one of its pages`,
    )
    process.exit(1)
  }
  return parts
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

/** Runs jobs a few at a time; docs pages can take seconds each. */
async function pool<T, R>(items: T[], run: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await run(items[index] as T)
    }
  }
  await Promise.all(
    Array.from({ length: Number(args.concurrency) }, () => worker()),
  )
  return results
}

const pause = (ms: number) => new Promise((done) => setTimeout(done, ms))

/** One part after its focus and `before` steps, read once its transitions
 *  settle, then undone with Escape. */
async function measureStepped(page: Page, part: string, target: Target) {
  let measure: Measures = { [part]: null }
  try {
    for (const step of target.before ?? []) {
      if ("click" in step) await page.click(step.click)
      else if ("hover" in step) await page.hover(step.hover)
      else await page.keyboard.press(step.press as KeyInput)
    }
    if (target.focus) {
      // Tab away and back, so the focus comes from the keyboard.
      await page.evaluate(snippet({ [part]: target }, { focus: true }))
      await page.keyboard.press("Tab")
      await page.keyboard.down("Shift")
      await page.keyboard.press("Tab")
      await page.keyboard.up("Shift")
    }
    let last = ""
    for (let tries = 0; tries < 15; tries++) {
      await pause(150)
      const read = JSON.stringify(
        await page.evaluate(snippet({ [part]: target })),
      )
      if (read === last) break
      last = read
    }
    measure = JSON.parse(last)
  } catch (error) {
    console.warn(`${page.url()} · ${part}: ${(error as Error).message}`)
  }
  await page.keyboard.press("Escape")
  await page.mouse.move(0, 0)
  await page.evaluate("document.activeElement?.blur()")
  await pause(200)
  return measure
}

/** One public page in one mode: plain parts in one pass, then each part
 *  with steps on its own. */
async function measurePage(
  browser: Browser,
  url: string,
  mode: Mode,
  targets: Record<string, Target>,
  storage?: string,
): Promise<Measures> {
  const page = await browser.newPage()
  try {
    await page.setViewport({ width: 1440, height: 900 })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: mode },
    ])
    // Pages run side by side; each acts as the focused tab, as :focus-visible
    // needs.
    const cdp = await page.createCDPSession()
    await cdp.send("Emulation.setFocusEmulationEnabled", { enabled: true })
    // Some sites turn away a "HeadlessChrome" user agent (Notion).
    await page.setUserAgent(
      (await browser.userAgent()).replace("HeadlessChrome", "Chrome"),
    )
    if (storage)
      await page.evaluateOnNewDocument(
        `localStorage.setItem(${JSON.stringify(storage)}, ${JSON.stringify(mode)})`,
      )
    await page.goto(url, { waitUntil: "load", timeout: 60000 })
    // Docs sites keep connections open, so a short quiet spell is enough;
    // apps still hydrate after it.
    await page
      .waitForNetworkIdle({ idleTime: 500, timeout: 10000 })
      .catch(() => {})
    await pause(1500)
    const stepped = (target: Target) => target.focus || target.before
    const measures: Measures = await page.evaluate(
      snippet(
        Object.fromEntries(
          Object.entries(targets).filter(([, target]) => !stepped(target)),
        ),
      ),
    )
    for (const [part, target] of Object.entries(targets))
      if (stepped(target))
        Object.assign(measures, await measureStepped(page, part, target))
    for (const [part, target] of Object.entries(targets))
      for (const prop of target.skip ?? []) delete measures[part]?.[prop]
    return measures
  } finally {
    await page.close()
  }
}

/** Writes measures into a pack's tokens.json, keeping what they don't cover
 *  (signed-in pages, parts of other pages). */
async function mergeTokens(
  id: string,
  results: { url: string; mode: Mode; measures: Measures }[],
) {
  const file = tokensFile(id)
  const tokens: ReferenceTokens = existsSync(file) ? await readJson(file) : {}
  for (const { url, mode, measures } of results)
    for (const [part, measure] of Object.entries(measures)) {
      if (measure) (tokens[mode] ??= {})[part] = measure
      else console.warn(`no match: ${part} on ${url} (${mode})`)
    }
  const { light, dark } = tokens
  await writeFile(
    file,
    `${JSON.stringify({ probe: PROBE, light, dark }, null, 2)}\n`,
  )
  console.log(`tokens → ${file} (probe ${PROBE})`)
}

if (args.pack && args.merge) {
  const page = ((await readJson(packFile(args.pack))) as Pack)[args.url ?? ""]
  const mode = page?.mode ?? MODES[0]
  if (!page || (!page.mode && MODES.length > 1)) {
    console.error(
      "--merge needs --url naming a page of the pack, and --mode unless the page sets one",
    )
    process.exit(1)
  }
  const measures: Measures = await readJson(args.merge)
  for (const [part, target] of Object.entries(page.parts))
    for (const prop of target.skip ?? []) delete measures[part]?.[prop]
  await mergeTokens(args.pack, [{ url: args.url ?? "", mode, measures }])
  process.exit(0)
}

if (args.pack) {
  const pack: Pack = await readJson(packFile(args.pack))
  const jobs = Object.entries(pack)
    .filter(([url, page]) => !page.signedIn && (!args.url || url === args.url))
    .flatMap(([url, page]) =>
      (page.mode ? [page.mode] : (["light", "dark"] as const)).map((mode) => ({
        url,
        mode,
        targets: page.parts,
        storage: page.storage,
      })),
    )
  const browser = await launch()
  try {
    const results = await pool(jobs, async (job) => ({
      ...job,
      measures: await measurePage(
        browser,
        job.url,
        job.mode,
        job.targets,
        job.storage,
      ),
    }))
    for (const [url, page] of Object.entries(pack)) {
      if (page.mode) continue
      const [light, dark] = (["light", "dark"] as const).map((mode) =>
        JSON.stringify(
          results.find((r) => r.url === url && r.mode === mode)?.measures,
        ),
      )
      if (light && light === dark)
        console.warn(
          `${url}: light and dark measure the same; if the page ignores prefers-color-scheme, give it a "mode"`,
        )
    }
    await mergeTokens(args.pack, results)
  } finally {
    await browser.close()
  }
  const skipped = Object.entries(pack).filter(([, page]) => page.signedIn)
  if (skipped.length)
    console.log(
      `Signed-in pages to measure in Chrome and --merge: ${skipped.map(([url]) => url).join(", ")}`,
    )
  process.exit(0)
}

if (args.url) {
  const targets = await readTargets()
  const browser = await launch()
  try {
    const [mode = "light"] = MODES
    console.log(
      JSON.stringify(
        await measurePage(browser, args.url, mode, targets),
        null,
        2,
      ),
    )
  } finally {
    await browser.close()
  }
  process.exit(0)
}

if (!args.preset) {
  console.error(
    "usage: --preset <id> | --pack <id> [--url <url> [--merge <file>]] | --snippet (--pack <id> | --targets <file>) | --url <url> --targets <file>",
  )
  process.exit(1)
}
const preset = args.preset

const BASE = `http://localhost:${args.port}/internal/specimens`
const bySheet = new Map<string, Record<string, Target>>()
for (const [part, { sheet, target }] of Object.entries(SPECIMEN_TARGETS))
  bySheet.set(sheet, { ...bySheet.get(sheet), [part]: target })

const measured: ReferenceTokens = { probe: PROBE }
const browser = await launch()
try {
  const jobs = MODES.flatMap((mode) =>
    [...bySheet].map(([sheet, targets]) => ({ mode, sheet, targets })),
  )
  const results = await pool(jobs, async ({ mode, sheet, targets }) => {
    const page = await browser.newPage()
    try {
      await page.setViewport({ width: 1280, height: 900 })
      await page.emulateMediaFeatures([
        { name: "prefers-color-scheme", value: mode },
      ])
      await page.goto(`${BASE}?preset=${preset}&mode=${mode}&sheet=${sheet}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      })
      await page.waitForSelector("html[data-specimen-ready]", {
        timeout: 30000,
      })
      return {
        mode,
        measures: (await page.evaluate(snippet(targets))) as Measures,
      }
    } finally {
      await page.close()
    }
  })
  for (const { mode, measures } of results)
    measured[mode] = { ...measured[mode], ...measures }
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

if (!existsSync(tokensFile(preset))) {
  console.log(`no reference at ${tokensFile(preset)}: nothing to diff`)
  process.exit(0)
}
const reference: ReferenceTokens = await readJson(tokensFile(preset))
if (reference.probe !== PROBE)
  console.log(
    `\nThe reference was measured with probe ${reference.probe ?? "(unrecorded)"}, the specimens with ${PROBE}: re-run --pack ${preset} (and --merge its signed-in pages) for a like-for-like diff.`,
  )
let failing = 0
const missing = new Set<string>()
for (const mode of MODES) {
  const rows = compareMeasures(reference[mode] ?? {}, measured[mode] ?? {})
  if (rows.length === 0) continue
  console.log(`\n## ${preset} · ${mode}\n`)
  console.log("| part | prop | reference | preset | delta | |")
  console.log("| --- | --- | --- | --- | --- | --- |")
  for (const row of rows) {
    if (row.missing) {
      missing.add(row.part)
      continue
    }
    if (!row.ok) failing++
    console.log(
      `| ${row.part} | ${row.prop} | ${row.reference} | ${row.preset} | ${row.delta} | ${row.ok ? "ok" : "**off**"} |`,
    )
  }
}
console.log(
  `\n${failing} propert${failing === 1 ? "y" : "ies"} off (probe ${PROBE})`,
)
if (missing.size)
  console.log(
    `Not on the specimens (no SPECIMEN_TARGETS entry, or the sheet doesn't render it): ${[...missing].join(", ")}`,
  )
