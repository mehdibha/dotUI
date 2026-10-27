/**
 * Frozen copies of a pack's blocks (composed pieces: a repository header, a
 * booking card) at full size, and the landmarks of the pages they sit on:
 * the Blocks tab of the system's page on ds.dotui.org. Run from www/.
 *
 *   pnpm presets:blocks --pack <id> [--only <name,…>]
 *     Opens each public page of refs/<id>/targets.json that lists `blocks`,
 *     in each mode it shows, and freezes each block as a part file,
 *     .scratch-refs/<id>/<date>/blocks/<name>-<mode>.json, with an .html
 *     beside. A block with `before` steps (a dialog) gets a load of its own,
 *     and its box is the overlay's. Writes ../directory/systems/<id>/
 *     blocks.json, keeping what it holds for pages this run didn't open.
 *   pnpm presets:blocks --pack <id> --connect <port> --pages <file>
 *       [--private <file>]
 *     The signed-in pages instead, in new tabs of the person's own Chrome
 *     (started with --remote-debugging-port); <file> maps page keys to real
 *     URLs. Their copies are redacted: images grey, and text the product
 *     doesn't ship swapped for fake text (scrub.ts). --private
 *     (.scratch-refs/private.txt) lists what must never show, one per line:
 *     a copy that still shows one is left out.
 */
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import puppeteer, { type Browser, type Page } from "puppeteer"

import { snippet, type Step, type Target } from "../src/probe"
import {
  documentOf,
  type PartFile,
  type Snapshot,
  snapshotSnippet,
} from "../src/snapshot"
import {
  type BlockTarget,
  focusable,
  launch,
  type Mode,
  openPage,
  type PackPage,
  pause,
  productWords,
  readPrivates,
  REFS,
  runSteps,
  scrubCopies,
  settle,
  shim,
  SRC,
  versionOf,
} from "./preset-pages"

const { values: args } = parseArgs({
  options: {
    pack: { type: "string" },
    only: { type: "string" },
    connect: { type: "string" },
    pages: { type: "string" },
    private: { type: "string", default: ".scratch-refs/private.txt" },
    out: { type: "string" },
  },
})
if (!args.pack) {
  console.error("--pack <id> is required")
  process.exit(1)
}
const pack = args.pack
const SIGNED_IN = !!args.connect
const PRIVATES = SIGNED_IN ? readPrivates(args.private) : []
const WORDS = productWords()
const VERSION = versionOf(
  resolve(import.meta.dirname, "blocks.ts"),
  resolve(SRC, "snapshot.ts"),
)
const today = new Date().toISOString().slice(0, 10)
const OUT = resolve(`.scratch-refs/${pack}/${today}/blocks`)
const systemFile = resolve(
  args.out ?? `../directory/systems/${pack}/blocks.json`,
)
const only = args.only ? new Set(args.only.split(",")) : undefined
const readJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await readFile(file, "utf8"))

type Box = [number, number, number, number]
interface Block {
  name: string
  page: string
  /** An overlay's steps; its box is then in the viewport. */
  pass?: Step[]
  box: Box
  copies: Partial<Record<Mode, string>>
  redacted?: true
}
interface PageLayout {
  key: string
  modes: Mode[]
  viewport: { width: number; height: number }
  height: number
  regions: { role: string; box: Box }[]
}
interface BlocksFile {
  version: 1
  slug: string
  provenance: {
    method: "script"
    extractor: string
    sources: {
      kind: "live-site"
      url: string
      ref: null
      retrievedAt: string
      snapshot: null
    }[]
    notes: null
  }
  /** `census`: this tool's version, the field spec.json's census has. */
  capture: { census: string; date: string }
  blocks: Block[]
  pages: PageLayout[]
}

const VIEWPORT_HEIGHT = 900

/** Scrolls to the end and back, a viewport at a time, so what loads in view
 *  (lazy images, a footer) is there; at most 30 viewports. Returns the
 *  page's height. */
const scrollThrough = async (page: Page) => {
  const height = await page.evaluate(async () => {
    const end = () =>
      Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight ?? 0,
      )
    for (let y = 0, n = 0; y < end() && n < 30; y += innerHeight, n++) {
      scrollTo(0, y)
      await new Promise((done) => setTimeout(done, 200))
    }
    scrollTo(0, 0)
    return end()
  })
  await page
    .waitForNetworkIdle({ idleTime: 500, timeout: 4000 })
    .catch(() => {})
  await settle(page)
  return height
}

/* The page's landmarks, as an accessibility tree would expose them. */
const regions = (page: Page) =>
  page.evaluate(() => {
    const ROLES = new Set([
      "banner",
      "navigation",
      "main",
      "complementary",
      "contentinfo",
      "search",
      "form",
      "dialog",
      "alertdialog",
    ])
    const SECTIONING = "article, aside, main, nav, section"
    const named = (el: Element) =>
      ["aria-label", "aria-labelledby", "title"].some((a) => el.hasAttribute(a))
    const roleOf = (el: Element) => {
      const role = el.getAttribute("role")?.trim().split(/\s+/)[0]
      if (role) return ROLES.has(role) ? role : null
      switch (el.localName) {
        case "header":
          return el.parentElement?.closest(SECTIONING) ? null : "banner"
        case "footer":
          return el.parentElement?.closest(SECTIONING) ? null : "contentinfo"
        case "nav":
          return "navigation"
        case "main":
          return "main"
        case "aside":
          return "complementary"
        case "search":
          return "search"
        case "form":
          return named(el) ? "form" : null
        case "dialog":
          return (el as HTMLDialogElement).open ? "dialog" : null
      }
      return null
    }
    const found: { role: string; box: [number, number, number, number] }[] = []
    for (const el of document.querySelectorAll("body *")) {
      const role = roleOf(el)
      if (!role) continue
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) continue
      if (getComputedStyle(el).visibility === "hidden") continue
      found.push({
        role,
        box: [rect.x + scrollX, rect.y + scrollY, rect.width, rect.height].map(
          Math.round,
        ) as [number, number, number, number],
      })
    }
    return found
  })

type Frozen = Record<string, { box: Box; snapshot: Snapshot; redact: boolean }>

/** Finds each block as the probe finds a part, tags it, and freezes it.
 *  Boxes are on the page, or in the viewport for an `overlay`. */
async function freeze(
  page: Page,
  targets: Record<string, BlockTarget>,
  overlay = false,
): Promise<Frozen> {
  const names = Object.keys(targets)
  const found = (await page.evaluate(
    snippet(targets as Record<string, Target>, { mark: true }),
  )) as Record<string, unknown>
  const missing = names.filter((name) => !found[name])
  if (missing.length) console.warn(`  not found: ${missing.join(", ")}`)
  const out: Frozen = {}
  for (const redact of [false, true]) {
    const keys = names.filter(
      (name) =>
        found[name] && (SIGNED_IN || !!targets[name]?.redact) === redact,
    )
    if (!keys.length) continue
    const boxes = (await page.evaluate(
      (keys: string[], overlay: boolean) => {
        const out: Record<string, number[]> = {}
        for (const key of keys) {
          const el = document.querySelector(`[data-probe-part="${key}"]`)
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const [x, y] = overlay ? [0, 0] : [scrollX, scrollY]
          out[key] = [rect.x + x, rect.y + y, rect.width, rect.height].map(
            Math.round,
          )
        }
        return out
      },
      keys,
      overlay,
    )) as Record<string, Box>
    const marked = (await page.evaluate(
      snapshotSnippet({ attribute: "data-probe-part", keys, redact }),
    )) as Record<string, Snapshot>
    const copies = redact ? await scrubCopies(marked, WORDS, PRIVATES) : marked
    for (const key of keys)
      if (copies[key] && boxes[key])
        out[key] = { box: boxes[key], snapshot: copies[key], redact }
  }
  return out
}

interface Job {
  key: string
  url: string
  mode: Mode
  settings: PackPage
  blocks: Record<string, BlockTarget>
}
interface Opened {
  page: Page
  load: () => Promise<void>
  close: () => Promise<void>
}

async function run(job: Job, open: (job: Job) => Promise<Opened>) {
  console.log(`${job.key} (${job.mode})`)
  const frozen: Frozen = {}
  const opened = await open(job)
  let layout: PageLayout | undefined
  try {
    const { page } = opened
    await opened.load()
    const height = await scrollThrough(page)
    layout = {
      key: job.key,
      modes: [job.mode],
      viewport: {
        width: job.settings.width ?? 1440,
        height: VIEWPORT_HEIGHT,
      },
      height,
      regions: await regions(page),
    }
    const rest = Object.fromEntries(
      Object.entries(job.blocks).filter(([, t]) => !t.before?.length),
    )
    Object.assign(frozen, await freeze(page, rest))
    for (const [name, target] of Object.entries(job.blocks)) {
      if (!target.before?.length) continue
      try {
        await opened.load()
        await runSteps(page, target.before)
        await pause(300)
        await settle(page)
        Object.assign(frozen, await freeze(page, { [name]: target }, true))
      } catch (error) {
        console.warn(`  ${name}: ${(error as Error).message.split("\n")[0]}`)
      }
    }
  } finally {
    await opened.close()
  }
  return { job, layout, frozen }
}

const packFile = resolve(REFS, pack, "targets.json")
const targets: Record<string, PackPage> = existsSync(packFile)
  ? await readJson(packFile)
  : {}
const folder = pathToFileURL(`${resolve(REFS, pack)}/`)
if (SIGNED_IN && !args.pages) {
  console.error(
    '--connect needs --pages <file>: { "<page key>": "<real url>" }',
  )
  process.exit(1)
}
const urls: Record<string, string> = args.pages
  ? await readJson(resolve(args.pages))
  : {}

// A name on two pages is one block: the first page's.
const seen = new Set<string>()
const jobs: Job[] = []
for (const [key, page] of Object.entries(targets)) {
  if (!page.blocks || !!page.signedIn !== SIGNED_IN) continue
  if (SIGNED_IN && !urls[key]) continue
  const blocks = Object.fromEntries(
    Object.entries(page.blocks).filter(([name]) => {
      if (only && !only.has(name)) return false
      if (seen.has(name)) {
        console.warn(`${name}: also on an earlier page, skipped on ${key}`)
        return false
      }
      return true
    }),
  )
  for (const name of Object.keys(blocks)) seen.add(name)
  if (only && !Object.keys(blocks).length) continue
  const url = SIGNED_IN ? (urls[key] as string) : new URL(key, folder).href
  const modes: Mode[] =
    page.dark || !page.mode ? ["light", "dark"] : [page.mode]
  for (const mode of modes)
    jobs.push({
      key,
      url: mode === "dark" && page.dark ? new URL(page.dark, folder).href : url,
      mode,
      settings: page,
      blocks,
    })
}
if (!jobs.length) {
  console.error(
    `${pack}: no ${SIGNED_IN ? "signed-in" : "public"} pages with blocks in targets.json`,
  )
  process.exit(1)
}

let browser: Browser
let open: (job: Job) => Promise<Opened>
if (SIGNED_IN) {
  const port = args.connect as string
  browser = await puppeteer.connect({
    browserURL: /^\d+$/.test(port) ? `http://127.0.0.1:${port}` : port,
    defaultViewport: null,
  })
  open = async (job) => {
    const page = await browser.newPage()
    WORDS.watch(page)
    await shim(page)
    await page.setViewport({
      width: job.settings.width ?? 1440,
      height: VIEWPORT_HEIGHT,
    })
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
} else {
  browser = await launch()
  open = async (job) => {
    const opened = await openPage(browser, job.url, job.mode, job.settings)
    WORDS.watch(opened.page)
    return opened
  }
}

const results = []
try {
  // One at a time: a signed-in run shares the person's browser.
  for (const job of jobs) results.push(await run(job, open))
} finally {
  if (SIGNED_IN) await browser.disconnect()
  else await browser.close()
}

await mkdir(OUT, { recursive: true })
const before: BlocksFile | undefined = existsSync(systemFile)
  ? await readJson(systemFile)
  : undefined
const blocks = new Map<string, Block>()
const layouts = new Map<string, PageLayout>()
for (const { job, layout, frozen } of results) {
  if (layout) {
    const known = layouts.get(job.key)
    if (known) known.modes.push(job.mode)
    else layouts.set(job.key, layout)
  }
  for (const [name, { box, snapshot, redact }] of Object.entries(frozen)) {
    const copy = `${name}-${job.mode}`
    const file: PartFile = {
      kind: "dotui-part",
      part: name,
      mode: job.mode,
      page: job.key,
      dpr: 1,
      snapshot,
    }
    await writeFile(resolve(OUT, `${copy}.json`), `${JSON.stringify(file)}\n`)
    await writeFile(resolve(OUT, `${copy}.html`), documentOf(snapshot))
    const pass = job.blocks[name]?.before
    const block = blocks.get(name) ?? {
      name,
      page: job.key,
      ...(pass?.length ? { pass } : {}),
      // The first mode's: the page's regions are read in it too.
      box,
      // A mode this run didn't freeze keeps its last copy, as a block it
      // froze in no mode keeps its whole record, if redacted alike.
      copies: {
        ...before?.blocks.find(
          (known) =>
            known.name === name &&
            known.page === job.key &&
            !!known.redacted === redact,
        )?.copies,
      },
      ...(redact ? { redacted: true as const } : {}),
    }
    block.copies[job.mode] = `${today}/blocks/${copy}.json`
    blocks.set(name, block)
  }
}

// What this run read replaces what the file held; the rest stays while
// targets.json still lists it.
const visited = new Set(jobs.map((job) => job.key))
const order = Object.keys(targets)
const names = order.flatMap((key) => Object.keys(targets[key]?.blocks ?? {}))
const pages = [
  ...(before?.pages.filter(
    (page) => !visited.has(page.key) && order.includes(page.key),
  ) ?? []),
  ...layouts.values(),
].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
const file: BlocksFile = {
  version: 1,
  slug: pack,
  provenance: {
    method: "script",
    extractor: "packages/capture/scripts/blocks.ts",
    // A signed-in page's key, not its real URL.
    sources: pages.map(
      (page) =>
        (!visited.has(page.key) &&
          before?.provenance.sources.find(({ url }) => url === page.key)) || {
          kind: "live-site",
          url: page.key,
          ref: null,
          retrievedAt: today,
          snapshot: null,
        },
    ),
    notes: null,
  },
  capture: { census: VERSION, date: today },
  blocks: [
    ...(before?.blocks.filter((block) => {
      const target = targets[block.page]?.blocks?.[block.name]
      // Gone from its page, or frozen before its target asked for
      // redaction: dropped.
      return (
        target && !blocks.has(block.name) && (block.redacted || !target.redact)
      )
    }) ?? []),
    ...blocks.values(),
  ].sort(
    (a, b) =>
      order.indexOf(a.page) - order.indexOf(b.page) ||
      names.indexOf(a.name) - names.indexOf(b.name),
  ),
  pages,
}
await mkdir(resolve(systemFile, ".."), { recursive: true })
await writeFile(systemFile, `${JSON.stringify(file, null, 2)}\n`)
const wanted = jobs.flatMap((job) => Object.keys(job.blocks))
const lost = [...new Set(wanted)].filter((name) => !blocks.has(name))
console.log(
  `\n${blocks.size} blocks → ${OUT}\n${systemFile}${lost.length ? `\nnot frozen: ${lost.join(", ")}` : ""}`,
)
