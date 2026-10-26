/* What the capture tools share: the package's paths and probe version,
   launching the headless browser, opening a reference page in a mode, the
   steps a pack's pages run, and scrubbing a redacted page's copies. */
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer, { type Browser, type KeyInput, type Page } from "puppeteer"

import type {
  Page as ProbePage,
  ReferenceTokens,
  Step,
  Target,
} from "../src/probe"
import { literals, privatesOf, scrub } from "../src/scrub"
import type { Snapshot } from "../src/snapshot"
import { executablePath } from "./chromium"

/** A pack page as `openPage` loads it. Options that change only how the page
 *  loads live here, not in probe.ts, so adding one doesn't make a new probe. */
export interface PackPage extends ProbePage {
  /** Cookies set on the page's host before load, in both modes (a theme
   *  behind an opt-in: The Guardian's web dark mode). */
  cookies?: Record<string, string>
  /** Elements removed after load and the page's steps: a consent banner
   *  fixed over the page that crops would show instead of the part. */
  hide?: string[]
  /** More census passes, each on a fresh load: steps that open what the
   *  census can't find a trigger for (a dialog behind a plain button, a
   *  date picker). The probe never reads them. */
  passes?: Step[][]
  /** Composed pieces (a repository header, a booking card), found as parts
   *  are, that `presets:blocks` freezes whole. Named in kebab-case, unique
   *  across the pack. */
  blocks?: Record<string, BlockTarget>
}

/** `redact`: copied with its text scrubbed and images grey on a public page
 *  too, for a block that shows private people (a review, a host). */
export type BlockTarget = Target & { redact?: boolean }

export type Mode = "light" | "dark"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
export const SRC = resolve(ROOT, "src")
export const REFS = resolve(ROOT, "refs")

/** The newest commit that changed these files or folders (seven characters,
 *  "+dirty" with local edits), so readings from different versions aren't
 *  mixed up. A file's history follows exact moves and skips them, so moving
 *  the probe doesn't make it a new probe. */
export function versionOf(...paths: string[]) {
  const git = (...cmd: string[]) =>
    execFileSync("git", cmd, { encoding: "utf8" }).trim()
  const last = paths
    .map((path) => {
      const follow = statSync(path).isFile()
        ? ["--follow", "-M100%", "--diff-filter=r"]
        : []
      return git("log", "-1", "--format=%ct %H", ...follow, "--", path)
    })
    .sort()
    .at(-1)
  // Seven characters, as %h grows with the clone's object count.
  const sha = last?.split(" ")[1]?.slice(0, 7) ?? "unknown"
  return git("status", "--porcelain", "--", ...paths) ? `${sha}+dirty` : sha
}

/** The probe and the diff: off counts and tokens compare only within one. */
export const PROBE = versionOf(
  resolve(SRC, "probe.ts"),
  resolve(SRC, "compare.ts"),
)

/** A pack's reference: tokens.json, with what the pixel probe read from
 *  screenshots (pixel.json) under it, prop by prop, where tokens.json has
 *  nothing. `pixel` lists the "<mode> <part> <prop>" it filled. */
export function readReference(pack: string) {
  const read = (name: string): ReferenceTokens | undefined => {
    const file = resolve(REFS, pack, name)
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : undefined
  }
  const reference = read("tokens.json")
  const pixel = read("pixel.json")
  if (!reference) return undefined
  const filled: string[] = []
  for (const mode of ["light", "dark"] as const)
    for (const [part, measure] of Object.entries(pixel?.[mode] ?? {})) {
      const has = reference[mode]?.[part] ?? {}
      for (const prop of Object.keys(measure ?? {}))
        if (!(prop in has)) filled.push(`${mode} ${part} ${prop}`)
      reference[mode] = {
        ...reference[mode],
        [part]: { ...measure, ...reference[mode]?.[part] },
      }
    }
  return Object.assign(reference, { pixel: filled })
}

export const launch = () =>
  puppeteer.launch({
    headless: "shell",
    executablePath,
    args: [
      // Headless reports no mouse, so `@media (hover: hover)` rules (every
      // Tailwind v4 hover) and `(pointer: fine)` ones never apply: report a
      // desktop's.
      "--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4",
      // Cloud containers run as root, where Chrome's sandbox refuses to
      // start.
      ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
    ],
  })

/** Runs jobs a few at a time; docs pages can take seconds each. */
export async function pool<T, R>(
  items: T[],
  run: (item: T) => Promise<R>,
  concurrency: number,
) {
  if (!Number.isInteger(concurrency) || concurrency < 1)
    throw new Error("--concurrency must be a whole number above 0")
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await run(items[index] as T)
    }
  }
  // When one worker fails, the rest finish before the caller closes the
  // browser under them.
  const settled = await Promise.allSettled(
    Array.from({ length: concurrency }, () => worker()),
  )
  const failed = settled.find((result) => result.status === "rejected")
  if (failed) throw failed.reason
  return results
}

export const pause = (ms: number) => new Promise((done) => setTimeout(done, ms))

/** Pages run side by side; each acts as the focused tab, as :focus-visible
 *  needs. */
export async function focusable(page: Page) {
  const cdp = await page.createCDPSession()
  await cdp.send("Emulation.setFocusEmulationEnabled", { enabled: true })
}

/** tsx compiles a `__name` helper into functions passed to
 *  `page.evaluate`; the page needs a stand-in. */
export const shim = (page: Page) =>
  page.evaluateOnNewDocument("globalThis.__name = (fn) => fn")

export const say = (step: Step) =>
  "click" in step
    ? `click ${step.click}`
    : "hover" in step
      ? `hover ${step.hover}`
      : "focus" in step
        ? `focus ${step.focus}`
        : "wait" in step
          ? `wait for ${step.wait}`
          : `press ${step.press}`

export async function runSteps(page: Page, steps: Step[]) {
  for (const step of steps) {
    if ("press" in step) {
      // Puppeteer presses one key: "Meta+k" holds Meta while it presses k.
      const keys = step.press.split(/\+(?=.)/) as KeyInput[]
      const key = keys.pop() as KeyInput
      const held: KeyInput[] = []
      try {
        for (const modifier of keys) {
          await page.keyboard.down(modifier)
          held.push(modifier)
        }
        await page.keyboard.press(key)
      } finally {
        // A modifier left down would ride along on the tab's next steps.
        for (const modifier of held.reverse())
          await page.keyboard.up(modifier).catch(() => {})
      }
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

/** Waits for running animations and transitions to end (overlays fade in,
 *  focus rings grow); endless ones like spinners don't count. */
export const settle = (page: Page) =>
  page
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

/** A reference page in one mode, in its own browser context so pages read
 *  side by side don't share a theme through localStorage (next-themes syncs
 *  it across tabs). `load` (re)loads it and walks its steps; call it again
 *  to start a part from a fresh state. */
export async function openPage(
  browser: Browser,
  url: string,
  mode: Mode,
  {
    storage,
    cookies = {},
    hide = [],
    steps = [],
    width = 1440,
    settle: wait = 1500,
  }: Omit<PackPage, "parts">,
) {
  const context = await browser.createBrowserContext()
  let page: Page
  // A harness loads a live app's hashed stylesheets, which its next deploy
  // deletes; read without them, every part would be a browser default.
  const missing = new Set<string>()
  try {
    page = await context.newPage()
    await shim(page)
    await page.setViewport({ width, height: 900 })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: mode },
    ])
    await focusable(page)
    if (url.startsWith("file:")) {
      page.on("requestfailed", (request) => {
        if (request.resourceType() === "stylesheet") missing.add(request.url())
      })
      page.on("response", (response) => {
        const status = response.status()
        // A redirect answers again from where it leads.
        if (
          response.request().resourceType() !== "stylesheet" ||
          (status >= 300 && status < 400)
        )
          return
        // Chrome ignores a stylesheet served as anything but text/css.
        const type = response.headers()["content-type"]
        if (!response.ok() || (type && !/^text\/css\b/i.test(type)))
          missing.add(response.url())
      })
    }
    // Some sites turn away a "HeadlessChrome" user agent (Notion).
    await page.setUserAgent(
      (await browser.userAgent()).replace("HeadlessChrome", "Chrome"),
    )
    for (const [name, value] of Object.entries(cookies))
      await context.setCookie({ name, value, domain: new URL(url).hostname })
    if (storage)
      await page.evaluateOnNewDocument(
        `try { localStorage.setItem(${JSON.stringify(storage)}, ${JSON.stringify(mode)}) } catch {}`,
      )
  } catch (error) {
    await context.close().catch(() => {})
    throw error
  }
  const load = async () => {
    // A goto that changes only the hash keeps the document, so a hash-routed
    // dialog would keep the last part's state.
    if (page.url() !== "about:blank") await page.goto("about:blank")
    missing.clear()
    await page.goto(url, { waitUntil: "load", timeout: 60000 })
    // Docs sites keep connections open, so a short quiet spell is enough;
    // apps still hydrate after it.
    await page
      .waitForNetworkIdle({ idleTime: 500, timeout: 10000 })
      .catch(() => {})
    await pause(wait)
    if (missing.size)
      throw new Error(
        `${url}: stylesheet did not load: ${[...missing].join(" ")}`,
      )
    await runSteps(page, steps)
    for (const selector of hide)
      await page.$$eval(selector, (els) => els.forEach((el) => el.remove()))
  }
  return { page, load, close: () => context.close() }
}

/** Files under `root` whose path matches `test`, up to six folders deep. */
export function walk(root: string, test: (path: string) => boolean, depth = 6) {
  const out: string[] = []
  if (!existsSync(root) || depth < 0) return out
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = resolve(root, entry.name)
    if (entry.isDirectory()) out.push(...walk(path, test, depth - 1))
    else if (test(path)) out.push(path)
  }
  return out
}
export const newest = (files: string[]) =>
  files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0]

/** The words a product ships to every visitor, which a scrub keeps: the
 *  literals (scrub.ts) of the scripts and message files its watched pages
 *  load, each fetched again with no cookies, so nothing an account was
 *  sent. Only files cached for everyone count. */
export function productWords() {
  const words = new Set<string>()
  const seen = new Set<string>()
  const loads: Promise<void>[] = []
  const shared = (cache: string) =>
    !/private|no-store/.test(cache) && /immutable|max-age=\d{5,}/.test(cache)
  const read = async (url: string) => {
    try {
      const response = await fetch(url, { credentials: "omit" })
      const type = response.headers.get("content-type") ?? ""
      if (!response.ok || !/javascript|ecmascript|json/.test(type)) return
      if (/private|no-store/.test(response.headers.get("cache-control") ?? ""))
        return
      for (const word of literals(await response.text())) words.add(word)
    } catch {
      // Its words are swapped instead, which only costs labels.
    }
  }
  return {
    watch(page: Page) {
      page.on("response", (response) => {
        const url = response.url()
        const type = response.request().resourceType()
        const { protocol, pathname } = new URL(url)
        const cache = response.headers()["cache-control"] ?? ""
        if (protocol !== "https:" || seen.has(url)) return
        if (
          type === "script"
            ? /\.m?js$/.test(pathname)
              ? !/private|no-store/.test(cache)
              : shared(cache)
            : (type === "fetch" || type === "xhr") &&
              /\.json$/.test(pathname) &&
              shared(cache)
        ) {
          seen.add(url)
          loads.push(read(url))
        }
      })
    },
    async ready() {
      while (loads.length) await Promise.all(loads.splice(0))
      return words
    },
  }
}
export type ProductWords = ReturnType<typeof productWords>

/** The strings that must never show in a copy (scrub.ts), from the person's
 *  file, which stays on their computer: no redacted capture runs without. */
export function readPrivates(file: string) {
  const path = resolve(file)
  const privates = existsSync(path)
    ? privatesOf(readFileSync(path, "utf8"))
    : []
  if (!privates.length)
    throw new Error(
      `${path}: list the strings that must never show in a copy (your names, emails, handles, workspace and team names), one per line`,
    )
  return privates
}

/** Redacted copies scrubbed: a copy a private string survives is left out. */
export async function scrubCopies(
  copies: Record<string, Snapshot>,
  words: ProductWords,
  privates: readonly string[],
) {
  const known = await words.ready()
  const out: Record<string, Snapshot> = {}
  for (const [key, copy] of Object.entries(copies)) {
    const clean = scrub(copy, known, privates)
    if (clean) out[key] = clean
    else console.warn(`copy ${key}: a private string survived, left out`)
  }
  return out
}
