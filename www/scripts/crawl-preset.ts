/**
 * The census (src/modules/preset-lab/census.ts) over a product's pages:
 * every element each page paints or labels, its role and about 40 values, at
 * rest and hovered, pressed and focused, in both modes. Then the looks per
 * role (census.json) and the model (refs/<id>/model.json, see model.ts).
 * Run from www/.
 *
 *   tsx scripts/crawl-preset.ts --pack <id> [--url <url>]… [--follow <n>] [--open <n>]
 *     Headless, the pack's public pages with their mode, dark URL, storage,
 *     steps, settle and width (targets.json), each distinct `before` step
 *     list as one more pass (what it opens). --url keeps only those pages
 *     (any page, in the pack or not); --follow adds up to n same-site pages
 *     linked from them, --open up to n popups per page (aria-haspopup),
 *     each opened by a click on a fresh load.
 *
 *   tsx scripts/crawl-preset.ts --pack <id> --connect <port> --pages <file> [--mode light|dark|both]
 *     The same in a Chrome you are signed in to, started with
 *     --remote-debugging-port=<port> (the local capture's research Chrome),
 *     in new tabs of your profile. <file> maps each page key, with account
 *     segments as placeholders, to its real URL; real URLs are never
 *     written. Modes are emulated (prefers-color-scheme): a product with an
 *     appearance setting needs it set by hand, one mode per run. Clicks only
 *     with --passes (a pack page's `before` steps).
 *
 *   tsx scripts/crawl-preset.ts --pack <id> --from <census dir>…
 *     Rebuilds census.json and the model from saved pages, no browser: how a
 *     public run and a signed-in one become one model.
 *
 *   tsx scripts/crawl-preset.ts --pack <id> --drift
 *     Re-runs the headless census and prints what moved against the
 *     committed model, on the pages both share. Writes no model: rebuild it
 *     with --from to keep the signed-in pages.
 *
 * Writes <out>/pages/<page>-<pass>-<mode>.json, <out>/census.json, the
 * model, and frozen copies of each look's sample at rest and in its states
 * (--copies per pass, 40 by default; redacted with --connect) as
 * <out>/crops/<look>-<state>-<mode>.{json,html}, which /internal/compare
 * lists as parts. <out> is .scratch-refs/<id>/<date>/census by default.
 */
import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import puppeteer, {
  type Browser,
  type ElementHandle,
  type Page,
} from "puppeteer"

import {
  type CensusElement,
  type CensusPage,
  censusSnippet,
  changed,
  cluster,
  groupOf,
  type Inventory,
  lookKeys,
  type State,
  trim,
  type Values,
} from "../src/modules/preset-lab/census"
import {
  buildModel,
  diffModels,
  type Model,
  summarize,
} from "../src/modules/preset-lab/model"
import type {
  Pack,
  Page as PackPage,
  Step,
} from "../src/modules/preset-lab/probe"
import {
  COPY_AREA,
  type PartFile,
  type Snapshot,
  snapshotSnippet,
} from "../src/modules/preset-lab/snapshot"
import {
  focusable,
  launch,
  type Mode,
  openPage,
  pause,
  pool,
  PROBE,
  REFS,
  runSteps,
  say,
  shim,
  versionOf,
} from "./preset-pages"

const { values: args } = parseArgs({
  options: {
    pack: { type: "string" },
    url: { type: "string", multiple: true, default: [] },
    follow: { type: "string", default: "0" },
    open: { type: "string", default: "0" },
    connect: { type: "string" },
    pages: { type: "string" },
    passes: { type: "boolean", default: false },
    mode: { type: "string", default: "both" },
    from: { type: "string", multiple: true, default: [] },
    drift: { type: "boolean", default: false },
    out: { type: "string" },
    max: { type: "string", default: "5000" },
    states: { type: "string", default: "80" },
    copies: { type: "string", default: "40" },
    concurrency: { type: "string", default: "2" },
  },
})

if (!args.pack) {
  console.error("--pack <id> is required")
  process.exit(1)
}
const pack = args.pack
const MODES = (args.mode === "both" ? ["light", "dark"] : [args.mode]) as Mode[]
if (!MODES.every((m) => m === "light" || m === "dark")) {
  console.error("--mode must be light, dark or both")
  process.exit(1)
}
const CENSUS = versionOf("census.ts", "probe.ts")
const today = new Date().toISOString().slice(0, 10)
const OUT = resolve(args.out ?? `.scratch-refs/${pack}/${today}/census`)
const modelFile = resolve(REFS, pack, "model.json")
// Signed-in pages keep no text, values or images in their copies.
const REDACT = !!args.connect
const readJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await readFile(file, "utf8")) as T

/** Roles a pointer or the keyboard can change. */
const INTERACTIVE = new Set([
  "button",
  "link",
  "tab",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "checkbox",
  "radio",
  "switch",
  "textbox",
  "searchbox",
  "combobox",
  "slider",
  "spinbutton",
  "treeitem",
  "row",
  "cell",
])

/** One element per look of a pass, most-used looks first: the ones whose
 *  states and custom properties are read. */
function representatives(elements: CensusElement[], only?: Set<string>) {
  const looks = new Map<string, CensusElement[]>()
  for (const element of elements) {
    if (only && !only.has(element.role)) continue
    const keys = lookKeys(element.role)
    const sig = `${groupOf(element)} ${JSON.stringify(keys.map((key) => element.values[key] ?? ""))}`
    looks.set(sig, [...(looks.get(sig) ?? []), element])
  }
  return [...looks.values()]
    .sort((a, b) => b.length - a.length)
    .map(([first]) => first as CensusElement)
}

/* Frozen copies (snapshot.ts) of each look's sample, at rest and in each
   state read: what /internal/compare shows beside our part. Kept per page,
   pass and mode, by census id. */
type Copies = Record<number, Partial<Record<"rest" | State, Snapshot>>>
const COPIES = new Map<string, Copies>()
const copiesOf = (key: string, pass: string, mode: Mode) =>
  `${key}|${pass}|${mode}`
const BOXLESS = new Set([
  "page",
  "text",
  "paragraph",
  "label",
  "time",
  "blockquote",
  "main",
  "region",
  "list",
  "listitem",
  "group",
  "article",
  "banner",
  "contentinfo",
  "complementary",
  "navigation",
])

const freeze = async (page: Page, ids: number[]) =>
  ids.length
    ? ((await page.evaluate(
        snapshotSnippet({
          attribute: "data-census",
          redact: REDACT,
          keys: ids.map(String),
        }),
      )) as Record<string, Snapshot>)
    : {}

const finish = (page: Page) =>
  page.evaluate(() => {
    for (const animation of document.getAnimations())
      if (animation.effect?.getComputedTiming().iterations !== Infinity)
        try {
          animation.finish()
        } catch {
          // Some animations can't finish (an infinite delay).
        }
  })

const read = async (page: Page, id: number, focus = false) =>
  (
    (await page.evaluate(
      censusSnippet({ kind: "read", ids: [id], focus }),
    )) as Record<string, Values>
  )[id] ?? null

/* Hovered with the pointer (so script-driven hovers show too), pressed and
   focused forced through the DevTools protocol plus a keyboard round trip,
   so CSS and script focus rings both show. Each state is undone before the
   next. Only what a state changes is kept. */
async function readStates(
  page: Page,
  elements: CensusElement[],
  copies: Copies,
) {
  const cdp = await page.createCDPSession()
  await cdp.send("DOM.enable")
  await cdp.send("CSS.enable")
  await cdp.send("DOM.getDocument", { depth: -1, pierce: true })
  const url = page.url()
  const force = async (handle: ElementHandle, classes: string[]) => {
    const { nodeId } = await cdp.send("DOM.requestNode", {
      objectId: handle.remoteObject().objectId as string,
    })
    await cdp.send("CSS.forcePseudoState", {
      nodeId,
      forcedPseudoClasses: classes,
    })
  }
  for (const element of elements) {
    if (page.url() !== url) break
    const handle = await page.$(`>>> [data-census="${element.id}"]`)
    if (!handle) continue
    const states: Partial<Record<State, Values>> = {}
    const copy = async (state: State) => {
      const frozen =
        copies[element.id] && (await freeze(page, [element.id]))[element.id]
      if (frozen)
        copies[element.id] = { ...copies[element.id], [state]: frozen }
    }
    try {
      await handle.hover()
      await pause(60)
      await finish(page)
      const hover = await read(page, element.id)
      // The pointer may have scrolled the page, which moves nothing a look
      // is made of.
      if (hover) states.hover = changed(element.values, hover)
      await copy("hover")
      await page.mouse.move(0, 0)
      await force(handle, ["hover", "active"])
      await finish(page)
      const pressed = await read(page, element.id)
      if (pressed) states.pressed = changed(element.values, pressed)
      await copy("pressed")
      await force(handle, [])
      if (element.focusable) {
        await handle.focus()
        await page.keyboard.press("Tab")
        await page.keyboard.down("Shift")
        await page.keyboard.press("Tab")
        await page.keyboard.up("Shift")
        if (!(await handle.evaluate((el) => el === document.activeElement)))
          await handle.focus()
        await force(handle, ["focus", "focus-visible", "focus-within"])
        await finish(page)
        const focus = await read(page, element.id, true)
        if (focus) states.focus = changed(element.values, focus)
        await copy("focus")
        await force(handle, [])
        await handle.evaluate((el) => (el as HTMLElement).blur?.())
      }
    } catch {
      // Detached or covered: keep what was read.
    } finally {
      await page.keyboard.press("Escape").catch(() => {})
      await handle.dispose()
    }
    for (const [state, values] of Object.entries(states) as [State, Values][]) {
      delete values.width
      if (!Object.keys(values).length) delete states[state]
    }
    if (Object.keys(states).length) element.states = states
  }
  await cdp.detach()
}

/** One pass over the page as it stands: the walk, the states of each
 *  interactive look, and the custom properties behind every look. */
async function pass(
  page: Page,
  key: string,
  mode: Mode,
  name: string,
  start: number,
): Promise<CensusPage> {
  const walked = (await page.evaluate(
    censusSnippet({
      kind: "walk",
      max: Number(args.max),
      fresh: name !== "rest",
      start,
    }),
  )) as {
    elements: CensusElement[]
    truncated: number
    viewport: CensusPage["viewport"]
    reads: CensusPage["reads"]
  }
  const { elements } = walked
  // The most used looks with a box small enough to copy.
  const copied = representatives(elements)
    .filter(
      ({ role, box: [, , w, h] }) =>
        !BOXLESS.has(role) && w * h > 0 && w * h <= COPY_AREA,
    )
    .slice(0, Number(args.copies))
  const copies: Copies = Object.fromEntries(
    Object.entries(
      await freeze(
        page,
        copied.map((element) => element.id),
      ),
    ).map(([id, rest]) => [id, { rest }]),
  )
  COPIES.set(copiesOf(key, name, mode), copies)
  await readStates(
    page,
    representatives(elements, INTERACTIVE).slice(0, Number(args.states)),
    copies,
  )
  const { vars, tokens } = (await page.evaluate(
    censusSnippet({
      kind: "vars",
      ids: representatives(elements)
        .slice(0, 400)
        .map((element) => element.id),
    }),
  )) as { vars: Record<string, Values>; tokens: Record<string, string> }
  for (const element of elements) {
    if (vars[element.id]) element.vars = vars[element.id]
    element.values = trim(element.values)
  }
  return {
    key,
    mode,
    probe: PROBE,
    pass: name,
    viewport: walked.viewport,
    elements,
    ...(Object.keys(tokens).length ? { tokens } : {}),
    ...(walked.truncated ? { truncated: walked.truncated } : {}),
    reads: walked.reads,
  }
}

/** A unique selector for a popup trigger, so a fresh load can find it. */
const triggers = (page: Page, max: number) =>
  page.evaluate((max) => {
    const path = (el: Element): string => {
      if (
        el.id &&
        document.querySelectorAll(`#${CSS.escape(el.id)}`).length === 1
      )
        return `#${CSS.escape(el.id)}`
      const parent = el.parentElement
      if (!parent) return el.localName
      const index = [...parent.children]
        .filter((child) => child.localName === el.localName)
        .indexOf(el)
      return `${path(parent)} > ${el.localName}:nth-of-type(${index + 1})`
    }
    return [
      ...document.querySelectorAll(
        '[aria-haspopup]:not([aria-haspopup="false"]), [aria-expanded="false"]',
      ),
    ]
      .filter(
        (el) => el.checkVisibility() && el.getBoundingClientRect().width > 0,
      )
      .slice(0, max)
      .map(path)
  }, max)

interface Job {
  key: string
  url: string
  mode: Mode
  settings: Omit<PackPage, "parts">
  passes: Step[][]
}

const slug = (key: string) =>
  key
    .replace(/^[a-z]+:\/\//, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)

async function crawl(
  job: Job,
  open: (job: Job) => Promise<{
    page: Page
    load: () => Promise<void>
    close: () => Promise<void>
  }>,
) {
  const { page, load, close } = await open(job)
  const pages: CensusPage[] = []
  try {
    page.on("dialog", (dialog) => void dialog.dismiss())
    await load()
    pages.push(await pass(page, job.key, job.mode, "rest", 0))
    const passes = [
      ...job.passes,
      ...(await triggers(page, Number(args.open))).map((selector): Step[] => [
        { click: selector },
      ]),
    ]
    for (const [i, steps] of passes.entries()) {
      try {
        await load()
        await page.evaluate(censusSnippet({ kind: "seen" }))
        await runSteps(page, steps)
        await pause(400)
        await finish(page)
        pages.push(
          await pass(
            page,
            job.key,
            job.mode,
            steps.map(say).join("; "),
            (i + 1) * 100000,
          ),
        )
      } catch (error) {
        console.warn(
          `${job.key} (${job.mode}) pass "${steps.map(say).join("; ")}": ${(error as Error).message}`,
        )
      }
    }
  } catch (error) {
    console.warn(`${job.key} (${job.mode}): ${(error as Error).message}`)
  } finally {
    await close()
  }
  for (const [i, censusPage] of pages.entries()) {
    const file = resolve(OUT, "pages", `${slug(job.key)}-${i}-${job.mode}`)
    await writeFile(`${file}.json`, `${JSON.stringify(censusPage)}\n`)
    const copies = COPIES.get(copiesOf(job.key, censusPage.pass, job.mode))
    if (copies && Object.keys(copies).length)
      await writeFile(
        `${file}.copies.json`,
        `${JSON.stringify({ key: job.key, pass: censusPage.pass, mode: job.mode, copies })}\n`,
      )
  }
  const count = pages.reduce((sum, p) => sum + p.elements.length, 0)
  console.log(
    `${job.key} (${job.mode}): ${pages.length} pass${pages.length === 1 ? "" : "es"}, ${count} elements`,
  )
  return pages
}

/** Same-site links from the start pages, for --follow. */
async function discover(browser: Browser, jobs: Job[], max: number) {
  const known = new Set(jobs.map((job) => job.url))
  const found: Job[] = []
  for (const job of jobs.filter((job) => job.mode === MODES[0])) {
    if (found.length >= max) break
    const { page, load, close } = await openPage(
      browser,
      job.url,
      job.mode,
      job.settings,
    )
    try {
      await load()
      const origin = new URL(job.url).origin
      const links = await page.$$eval("a[href]", (anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).href),
      )
      for (const link of links) {
        const url = new URL(link)
        url.hash = ""
        if (url.origin !== origin || known.has(url.href) || found.length >= max)
          continue
        if (
          /\.(pdf|zip|png|jpe?g|svg|mp4)$/i.test(url.pathname) ||
          /log-?out|sign-?out/i.test(url.pathname)
        )
          continue
        known.add(url.href)
        for (const mode of MODES)
          found.push({
            key: url.href,
            url: url.href,
            mode,
            settings: { ...job.settings, steps: [] },
            passes: [],
          })
      }
    } catch (error) {
      console.warn(`${job.url}: ${(error as Error).message}`)
    } finally {
      await close()
    }
  }
  return found
}

async function headless(): Promise<CensusPage[]> {
  const packFile = resolve(REFS, pack, "targets.json")
  const targets: Pack = existsSync(packFile) ? await readJson(packFile) : {}
  const folder = pathToFileURL(`${resolve(REFS, pack)}/`)
  const jobs: Job[] = []
  for (const [
    key,
    { parts, signedIn, mode, dark, ...settings },
  ] of Object.entries(targets)) {
    if (signedIn || (args.url.length && !args.url.includes(key))) continue
    const passes = [
      ...new Map(
        Object.values(parts)
          .filter((target) => target.before?.length)
          .map((target) => [
            JSON.stringify(target.before),
            target.before as Step[],
          ]),
      ).values(),
    ]
    const url = new URL(key, folder).href
    const modes = dark ? (["light", "dark"] as Mode[]) : mode ? [mode] : MODES
    for (const m of modes.filter((m) => MODES.includes(m)))
      jobs.push({
        key,
        url: m === "dark" && dark ? new URL(dark, folder).href : url,
        mode: m,
        settings,
        passes,
      })
  }
  for (const url of args.url.filter((url) => !targets[url]))
    for (const mode of MODES)
      jobs.push({ key: url, url, mode, settings: {}, passes: [] })
  if (!jobs.length) {
    console.error(
      `${pack}: no public pages in targets.json; pass --url, or --connect for signed-in pages`,
    )
    process.exit(1)
  }
  const browser = await launch()
  try {
    jobs.push(...(await discover(browser, jobs, Number(args.follow))))
    const open = (job: Job) =>
      openPage(browser, job.url, job.mode, job.settings)
    return (
      await pool(jobs, (job) => crawl(job, open), Number(args.concurrency))
    ).flat()
  } finally {
    await browser.close()
  }
}

/* Signed in: new tabs in the person's own Chrome (their cookies), one at a
   time, closed after; nothing in the profile is changed. */
async function connected(): Promise<CensusPage[]> {
  if (!args.pages) {
    console.error(
      '--connect needs --pages <file>: { "<page key>": "<real url>" }',
    )
    process.exit(1)
  }
  const urls: Record<string, string> = await readJson(resolve(args.pages))
  const targets: Pack = existsSync(resolve(REFS, pack, "targets.json"))
    ? await readJson(resolve(REFS, pack, "targets.json"))
    : {}
  const port = args.connect as string
  const browser = await puppeteer.connect({
    browserURL: /^\d+$/.test(port) ? `http://127.0.0.1:${port}` : port,
    defaultViewport: null,
  })
  const open = async (job: Job) => {
    const page = await browser.newPage()
    await shim(page)
    await page.setViewport({ width: job.settings.width ?? 1440, height: 900 })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: job.mode },
    ])
    await focusable(page)
    const load = async () => {
      await page.goto(job.url, { waitUntil: "load", timeout: 60000 })
      await page
        .waitForNetworkIdle({ idleTime: 500, timeout: 10000 })
        .catch(() => {})
      await pause(job.settings.settle ?? 2500)
      await runSteps(page, job.settings.steps ?? [])
    }
    return { page, load, close: () => page.close() }
  }
  try {
    const pages: CensusPage[] = []
    for (const [key, url] of Object.entries(urls))
      for (const mode of MODES) {
        const known = targets[key]
        const passes = args.passes
          ? Object.values(known?.parts ?? {}).flatMap((target) =>
              target.before?.length ? [target.before] : [],
            )
          : []
        pages.push(
          ...(await crawl(
            {
              key,
              url,
              mode,
              settings: {
                settle: known?.settle,
                steps: args.passes ? known?.steps : [],
                width: known?.width,
              },
              passes,
            },
            open,
          )),
        )
      }
    return pages
  } finally {
    await browser.disconnect()
  }
}

async function saved(dir: string): Promise<CensusPage[]> {
  const folder = existsSync(resolve(dir, "pages"))
    ? resolve(dir, "pages")
    : resolve(dir)
  const files = await readdir(folder)
  for (const file of files.filter((file) => file.endsWith(".copies.json"))) {
    const { key, pass, mode, copies } = await readJson<{
      key: string
      pass: string
      mode: Mode
      copies: Copies
    }>(resolve(folder, file))
    COPIES.set(copiesOf(key, pass, mode), copies)
  }
  return Promise.all(
    files
      .filter(
        (file) => file.endsWith(".json") && !file.endsWith(".copies.json"),
      )
      .map((file) => readJson<CensusPage>(resolve(folder, file))),
  )
}

/** A copy as a page of its own, on the color it sat on, its fonts loaded
 *  from where the product serves them. */
const documentOf = (copy: Snapshot) => {
  const faces = copy.fonts
    .map(
      (font) =>
        `@font-face{font-family:${JSON.stringify(font.family)};src:${font.src}${font.weight ? `;font-weight:${font.weight}` : ""}${font.style ? `;font-style:${font.style}` : ""}${font.unicodeRange ? `;unicode-range:${font.unicodeRange}` : ""}}`,
    )
    .join("\n")
  const css = `${faces}\nbody{margin:0;padding:16px;background:${copy.backdrop}}\n${copy.css}`
  // A "<" in the CSS would close the style element.
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css.replace(/</g, "\\3c ")}</style></head><body>${copy.html}</body></html>\n`
}

/** Each look's copies as /internal/compare reads parts:
 *  crops/<look>-<state>-<mode>.json, with a standalone .html beside. */
async function writeCopies(inventory: Inventory) {
  const dir = resolve(OUT, "crops")
  let written = 0
  for (const look of inventory.looks) {
    const { key, pass, mode, id, twin } = look.sample
    const sides: [Mode, number | undefined][] = [
      [mode, id],
      ["dark", mode === "light" ? twin : undefined],
    ]
    for (const [side, element] of sides) {
      const copies =
        element === undefined
          ? undefined
          : COPIES.get(copiesOf(key, pass, side))?.[element]
      for (const [state, snapshot] of Object.entries(copies ?? {})) {
        if (!snapshot) continue
        const part = `${look.id}-${state}`
        const file: PartFile = {
          kind: "dotui-part",
          part,
          mode: side,
          page: key,
          dpr: 1,
          snapshot,
        }
        if (!written++) await mkdir(dir, { recursive: true })
        await writeFile(
          resolve(dir, `${part}-${side}.json`),
          `${JSON.stringify(file)}\n`,
        )
        await writeFile(
          resolve(dir, `${part}-${side}.html`),
          documentOf(snapshot),
        )
      }
    }
  }
  if (written) console.log(`copies → ${dir} (${written})`)
}

await mkdir(resolve(OUT, "pages"), { recursive: true })
const pages = args.from.length
  ? (await Promise.all(args.from.map(saved))).flat()
  : args.connect
    ? await connected()
    : await headless()
const inventory: Inventory = cluster(pages, PROBE)
await writeFile(
  resolve(OUT, "census.json"),
  `${JSON.stringify({ census: CENSUS, ...inventory }, null, 1)}\n`,
)
console.log(
  `census → ${resolve(OUT, "census.json")} (${inventory.looks.length} looks, ${pages.length} passes, census ${CENSUS})`,
)
await writeCopies(inventory)

const model = buildModel(inventory)
if (args.drift) {
  if (!existsSync(modelFile)) {
    console.error(
      `no committed model at ${modelFile}: run without --drift first`,
    )
    process.exit(1)
  }
  const before: Model = await readJson(modelFile)
  const changes = diffModels(before, model)
  console.log(
    changes.length
      ? `\n## Drift since the committed model\n\n${changes.map((c) => `- ${c}`).join("\n")}`
      : "\nNo drift.",
  )
  process.exit(0)
}
await writeFile(modelFile, `${JSON.stringify(model, null, 1)}\n`)
console.log(`model → ${modelFile}\n`)
console.log(summarize(model))
