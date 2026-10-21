/**
 * Measures presets and the products they recreate with the same probe
 * (src/modules/preset-lab/probe.ts), then diffs the two. Run from www/.
 *
 *   tsx scripts/measure-preset.mts --preset <id> [--mode light|dark|both] [--port 5173] [--baseline <file>]
 *     Measures the preset's specimen sheets (dev server running) into
 *     <out>/<id>/measures.json and, when refs/<id>/tokens.json exists, prints
 *     reference vs preset for every property the reference measured, then
 *     what moved since the baseline (default: the previous run's measures).
 *
 *   tsx scripts/measure-preset.mts --pack <id> [--url <url>] [--shots <dir>]
 *     Measures the pack's public pages (refs/<id>/targets.json) headless, runs
 *     each page's steps and each part's focus and `before` steps, and merges
 *     the results into refs/<id>/tokens.json. A page key that isn't a URL is
 *     a file in the pack's folder (a local harness page). `--shots` also
 *     saves each part as <dir>/<part>-<mode>.png, for presets:compare.
 *
 *   tsx scripts/measure-preset.mts --pack <id> --url <url> --merge <file> [--mode light|dark]
 *     Merges a signed-in page's measures (the snippet's output, saved as
 *     JSON) into refs/<id>/tokens.json.
 *
 *   tsx scripts/measure-preset.mts --snippet (--pack <id> | --targets <file>) [--url <url>]
 *     Prints the probe as JavaScript expressions for a signed-in tab driven
 *     by Claude in Chrome: one for the plain parts, one per part with steps.
 *
 *   tsx scripts/measure-preset.mts --url <url> --targets <file> [--mode light|dark]
 *     Measures any page headless and prints its measures as JSON.
 *
 * A targets file maps part names (see SPECIMEN_TARGETS) to Targets. A pack's
 * targets.json maps page URLs to Pages (see probe.ts).
 */
import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import puppeteer, { type Browser, type KeyInput, type Page } from "puppeteer"

import {
  compareMeasures,
  compareRuns,
  type Row,
} from "../src/modules/preset-lab/compare"
import {
  type Measures,
  type Pack,
  type Page as PackPage,
  type Prop,
  PROPS,
  type ReferenceTokens,
  SPECIMEN_TARGETS,
  type Step,
  ownedProps,
  snippet,
  type Target,
} from "../src/modules/preset-lab/probe"
import { executablePath } from "./chromium"

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
    baseline: { type: "string" },
    shots: { type: "string" },
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
  // Seven characters, as %h grows with the clone's object count.
  const sha = git("log", "-1", "--format=%H").slice(0, 7)
  return git("status", "--porcelain") ? `${sha}+dirty` : sha
})()

const TARGET_KEYS = new Set([
  "selector",
  "text",
  "within",
  "withinNth",
  "nth",
  "surface",
  "box",
  "ink",
  "focus",
  "before",
  "only",
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

const stepped = (target: Target) => target.focus || target.before

/** What a page writes for its parts (see `ownedProps`): also applied on
 *  `--merge`, to a snippet result. */
function owned(measures: Measures, targets: Record<string, Target>) {
  for (const [part, target] of Object.entries(targets)) {
    const measure = measures[part]
    if (!measure) continue
    const keep = ownedProps(part, target)
    for (const prop of Object.keys(measure) as Prop[])
      if (!keep.includes(prop)) delete measure[prop]
  }
  return measures
}

const say = (step: Step) =>
  "click" in step
    ? `click ${step.click}`
    : "hover" in step
      ? `hover ${step.hover}`
      : "focus" in step
        ? `focus ${step.focus}`
        : "wait" in step
          ? `wait for ${step.wait}`
          : `press ${step.press}`

if (args.snippet) {
  const targets = Object.entries(await readTargets())
  const walk =
    args.pack &&
    ((await readJson(packFile(args.pack))) as Pack)[args.url ?? ""]?.steps
  if (walk?.length)
    console.log(
      `// After each load, before any probe: ${walk.map(say).join("; ")}.\n`,
    )
  console.log(
    `// Plain parts: run in the tab.\n${snippet(
      Object.fromEntries(targets.filter(([, target]) => !stepped(target))),
      { owned: true },
    )}`,
  )
  for (const [part, target] of targets.filter(([, target]) =>
    stepped(target),
  )) {
    const steps = (target.before ?? []).map(say)
    if (target.focus)
      steps.push(
        "run this (it focuses the part), press Tab then Shift+Tab, and run it again",
      )
    const after = !target.before
      ? "press Escape"
      : walk?.length
        ? "reload the tab and redo the steps at the top"
        : "reload the tab"
    console.log(
      `\n// ${part}: ${steps.join("; ")}. Keep the last result, then ${after}.\n${snippet({ [part]: target }, { focus: !!target.focus, owned: true })}`,
    )
  }
  process.exit(0)
}

const launch = () =>
  puppeteer.launch({
    headless: "shell",
    executablePath,
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

async function runSteps(page: Page, steps: Step[]) {
  for (const step of steps) {
    if ("press" in step) {
      await page.keyboard.press(step.press as KeyInput)
      continue
    }
    const selector =
      "click" in step
        ? step.click
        : "hover" in step
          ? step.hover
          : "focus" in step
            ? step.focus
            : step.wait
    await page
      .waitForSelector(selector, { visible: true, timeout: 15000 })
      .catch(async (error) => {
        if (await page.$(selector))
          throw new Error(`step ${JSON.stringify(step)}: found, but hidden`)
        throw error
      })
    if ("click" in step) await page.click(selector)
    else if ("hover" in step) await page.hover(selector)
    else if ("focus" in step) await page.focus(selector)
  }
}

/** A part as it shows, with a margin for rings and shadows, once its
 *  animations end (overlays fade in). */
async function shoot(page: Page, part: string, mode: Mode) {
  if (!args.shots) return
  const el = await page.$(`>>> [data-probe-part="${part}"]`)
  if (!el) return
  // Parts below the fold or inside a scrolled panel crop blank otherwise.
  await el.evaluate((node) =>
    node.scrollIntoView({ block: "nearest", inline: "nearest" }),
  )
  await page
    .waitForFunction(
      () =>
        document
          .getAnimations()
          .every(
            (a) =>
              a.playState !== "running" ||
              a.effect?.getComputedTiming().iterations === Infinity,
          ),
      { timeout: 3000 },
    )
    .catch(() => {})
  const box = await el.boundingBox()
  if (!box) return
  const [left, top] = await page.evaluate(() => [
    window.scrollX,
    window.scrollY,
  ])
  const x = Math.max(0, box.x + left - 16)
  const y = Math.max(0, box.y + top - 16)
  await mkdir(args.shots, { recursive: true })
  await page.screenshot({
    path: resolve(args.shots, `${part}-${mode}.png`),
    clip: { x, y, width: box.width + 32, height: box.height + 32 },
  })
}

/** One part after its focus and `before` steps, read once its transitions
 *  settle, then undone with Escape. */
async function measureStepped(
  page: Page,
  mode: Mode,
  part: string,
  target: Target,
) {
  let measure: Measures = { [part]: null }
  try {
    await runSteps(page, target.before ?? [])
    if (target.focus) {
      // Tab away and back, so the focus comes from the keyboard.
      await page.evaluate(snippet({ [part]: target }, { focus: true }))
      await page.keyboard.press("Tab")
      await page.keyboard.down("Shift")
      await page.keyboard.press("Tab")
      await page.keyboard.up("Shift")
    }
    // Until two reads agree on a match: tooltips open after a delay.
    let last = ""
    for (let tries = 0; tries < 30; tries++) {
      await pause(150)
      const read = JSON.stringify(
        await page.evaluate(
          snippet({ [part]: target }, { mark: true, owned: true }),
        ),
      )
      if (read === last && !read.endsWith(":null}")) break
      last = read
    }
    measure = JSON.parse(last)
    await shoot(page, part, mode)
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
 *  with steps on its own, on a fresh load after a part that opened
 *  something. */
async function measurePage(
  browser: Browser,
  url: string,
  mode: Mode,
  {
    parts: targets,
    storage,
    steps = [],
    width = 1440,
    settle = 1500,
  }: PackPage,
): Promise<Measures> {
  // Its own context, so pages measured side by side don't share a theme
  // through localStorage (next-themes syncs it across tabs).
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  try {
    await page.setViewport({ width, height: 900 })
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
    const load = async () => {
      await page.goto(url, { waitUntil: "load", timeout: 60000 })
      // Docs sites keep connections open, so a short quiet spell is enough;
      // apps still hydrate after it.
      await page
        .waitForNetworkIdle({ idleTime: 500, timeout: 10000 })
        .catch(() => {})
      await pause(settle)
      await runSteps(page, steps)
    }
    await load()
    const plain = Object.fromEntries(
      Object.entries(targets).filter(([, target]) => !stepped(target)),
    )
    const measures: Measures = await page.evaluate(
      snippet(plain, { mark: true, owned: true }),
    )
    for (const part of Object.keys(plain)) await shoot(page, part, mode)
    // The probe skips hidden elements; say so rather than a bare "no match".
    for (const [part, { selector, within }] of Object.entries(plain)) {
      const chain = [within, selector].filter(Boolean).join(" ")
      if (measures[part] || !chain) continue
      const hidden = (await page.$$(chain)).length
      if (hidden)
        console.warn(
          `${part} on ${url} (${mode}): "${chain}" matches ${hidden} element(s), none visible at ${width}px`,
        )
    }
    // A closed overlay can leave the page changed (a dialog that remounts
    // its trigger), so a part after one starts from a fresh load.
    let opened = false
    for (const [part, target] of Object.entries(targets)) {
      if (!stepped(target)) continue
      // One part failing (a walk that won't repeat) keeps the page's others.
      try {
        if (opened) await load()
        Object.assign(measures, await measureStepped(page, mode, part, target))
      } catch (error) {
        console.warn(
          `${part} on ${url} (${mode}) failed after a reload; page steps must replay the same walk on every load: ${(error as Error).message}`,
        )
      }
      opened = !!target.before?.length
    }
    return owned(measures, targets)
  } finally {
    await context.close()
  }
}

/** Writes measures into a pack's tokens.json part by part, keeping the parts
 *  they don't cover (signed-in pages, token-table values) and dropping props
 *  the probe no longer reads. */
async function mergeTokens(
  id: string,
  results: { url: string; mode: Mode; measures: Measures }[],
) {
  const file = tokensFile(id)
  const tokens: ReferenceTokens = existsSync(file) ? await readJson(file) : {}
  for (const { url, mode, measures } of results)
    for (const [part, measure] of Object.entries(measures)) {
      const stored = (tokens[mode] ??= {})
      if (measure) stored[part] = measure
      else console.warn(`no match: ${part} on ${url} (${mode})`)
    }
  for (const measures of [tokens.light, tokens.dark])
    for (const measure of Object.values(measures ?? {}))
      for (const prop of Object.keys(measure ?? {}))
        if (!PROPS.includes(prop as Prop)) delete measure?.[prop as Prop]
  const { fonts, light, dark } = tokens
  await writeFile(
    file,
    `${JSON.stringify({ probe: PROBE, fonts, light, dark }, null, 2)}\n`,
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
  const measures = owned(await readJson(args.merge), page.parts)
  await mergeTokens(args.pack, [{ url: args.url ?? "", mode, measures }])
  process.exit(0)
}

if (args.pack) {
  const pack: Pack = await readJson(packFile(args.pack))
  const folder = pathToFileURL(`${resolve(REFS, args.pack)}/`)
  const address = (key: string) => new URL(key, folder).href
  const jobs = Object.entries(pack)
    .filter(([url, page]) => !page.signedIn && (!args.url || url === args.url))
    .flatMap(([url, page]) =>
      (page.dark
        ? [
            { url, mode: "light" as const },
            { url: page.dark, mode: "dark" as const },
          ]
        : (page.mode ? [page.mode] : (["light", "dark"] as const)).map(
            (mode) => ({ url, mode }),
          )
      ).map((job) => ({ ...job, page })),
    )
  const skipped = Object.entries(pack).filter(([, page]) => page.signedIn)
  const signedIn = () =>
    skipped.length &&
    console.log(
      `Signed-in pages to measure in Chrome and --merge: ${skipped.map(([url]) => url).join(", ")}`,
    )
  if (jobs.length === 0) {
    console.log("No public pages to measure; tokens.json is unchanged.")
    signedIn()
    process.exit(0)
  }
  const browser = await launch()
  try {
    const results = await pool(jobs, async (job) => {
      let measures: Measures = {}
      try {
        measures = await measurePage(
          browser,
          address(job.url),
          job.mode,
          job.page,
        )
      } catch (error) {
        console.warn(`${job.url} (${job.mode}): ${(error as Error).message}`)
      }
      return { ...job, measures }
    })
    for (const [url, page] of Object.entries(pack)) {
      if (page.mode || page.dark) continue
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
  signedIn()
  process.exit(0)
}

if (args.url) {
  const targets = await readTargets()
  const browser = await launch()
  try {
    const [mode = "light"] = MODES
    console.log(
      JSON.stringify(
        await measurePage(browser, args.url, mode, { parts: targets }),
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

const outFile = resolve(args.out, preset, "measures.json")
const baselineFile = args.baseline ? resolve(args.baseline) : outFile
const baseline: ReferenceTokens | null = existsSync(baselineFile)
  ? await readJson(baselineFile)
  : null
// The reference each run diffed against, so a re-measured pack shows too.
const snapshotFile = resolve(dirname(outFile), "reference.json")
const previousFile = resolve(dirname(baselineFile), "reference.json")
const previous: ReferenceTokens | null = existsSync(previousFile)
  ? await readJson(previousFile)
  : null
await mkdir(dirname(outFile), { recursive: true })
await writeFile(outFile, `${JSON.stringify(measured, null, 2)}\n`)
console.log(`measures → ${outFile}`)

if (!existsSync(tokensFile(preset))) {
  console.log(`no reference at ${tokensFile(preset)}: nothing to diff`)
  process.exit(0)
}
const reference: ReferenceTokens = await readJson(tokensFile(preset))
await writeFile(snapshotFile, `${JSON.stringify(reference, null, 2)}\n`)
if (reference.probe !== PROBE && reference.probe !== "tokens")
  console.log(
    `\nThe reference was measured with probe ${reference.probe ?? "(unrecorded)"}, the specimens with ${PROBE}: re-run --pack ${preset} (and --merge its signed-in pages) for a like-for-like diff.`,
  )
let failing = 0
const missing = new Set<string>()
const moved: (ReturnType<typeof compareRuns>[number] & { mode: Mode })[] = []
for (const mode of MODES) {
  const rows = compareMeasures(
    reference[mode] ?? {},
    measured[mode] ?? {},
    reference.fonts,
  )
  const before: Row[] = baseline?.[mode]
    ? compareMeasures(reference[mode] ?? {}, baseline[mode], reference.fonts)
    : []
  moved.push(
    ...compareRuns(before, rows).map((change) => ({ ...change, mode })),
  )
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
if (baseline) {
  const probeNote =
    baseline.probe === PROBE
      ? ""
      : ` (measured with probe ${baseline.probe ?? "(unrecorded)"}: some moves come from the probe)`
  console.log(`\n## Since ${baselineFile}${probeNote}\n`)
  if (moved.length === 0) console.log("Nothing moved.")
  else {
    console.log("| mode | part | prop | before | now | |")
    console.log("| --- | --- | --- | --- | --- | --- |")
    for (const { mode, part, prop, before, after, kind } of moved)
      console.log(
        `| ${mode} | ${part} | ${prop} | ${before.preset} (${before.ok ? "ok" : before.delta}) | ${after.preset} (${after.ok ? "ok" : after.delta}) | ${kind} |`,
      )
    const count = (kind: string) =>
      moved.filter((change) => change.kind === kind).length
    console.log(
      `\n${["fixed", "broke", "closer", "further", "changed"]
        .map((kind) => `${count(kind)} ${kind}`)
        .join(", ")}`,
    )
  }
}
if (previous) {
  const changed = MODES.flatMap((mode) => {
    const [was, now] = [previous[mode] ?? {}, reference[mode] ?? {}]
    return [...new Set([...Object.keys(was), ...Object.keys(now)])].flatMap(
      (part) =>
        [
          ...new Set([
            ...Object.keys(was[part] ?? {}),
            ...Object.keys(now[part] ?? {}),
          ]),
        ].flatMap((prop) => {
          const before = was[part]?.[prop as Prop] ?? "—"
          const after = now[part]?.[prop as Prop] ?? "—"
          return before === after ? [] : [{ mode, part, prop, before, after }]
        }),
    )
  })
  if (changed.length) {
    console.log(`\n## Reference changes since ${previousFile}\n`)
    console.log("| mode | part | prop | before | now |")
    console.log("| --- | --- | --- | --- | --- |")
    for (const { mode, part, prop, before, after } of changed)
      console.log(`| ${mode} | ${part} | ${prop} | ${before} | ${after} |`)
  }
}
