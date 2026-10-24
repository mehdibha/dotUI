/* What the preset tools share: the preset lab's paths and probe version,
   launching the headless browser, opening a reference page in a mode, and
   the steps a pack's pages run. */
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer, { type Browser, type KeyInput, type Page } from "puppeteer"

import type {
  Page as PackPage,
  ReferenceTokens,
  Step,
} from "../src/modules/preset-lab/probe"
import { executablePath } from "./chromium"

export type Mode = "light" | "dark"

export const LAB = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/modules/preset-lab",
)
export const REFS = resolve(LAB, "refs")

/** The commit that last changed these preset-lab files (seven characters,
 *  "+dirty" with local edits), so readings from different versions aren't
 *  mixed up. */
export function versionOf(...files: string[]) {
  const paths = files.map((file) => resolve(LAB, file))
  const git = (...cmd: string[]) =>
    execFileSync("git", [...cmd, "--", ...paths], { encoding: "utf8" }).trim()
  // Seven characters, as %h grows with the clone's object count.
  const sha = git("log", "-1", "--format=%H").slice(0, 7)
  return git("status", "--porcelain") ? `${sha}+dirty` : sha
}

/** The probe and the diff: off counts and tokens compare only within one. */
export const PROBE = versionOf("probe.ts", "compare.ts")

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
    // Cloud containers run as root, where Chrome's sandbox refuses to start.
    args: process.getuid?.() === 0 ? ["--no-sandbox"] : [],
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
    steps = [],
    width = 1440,
    settle: wait = 1500,
  }: Omit<PackPage, "parts">,
) {
  const context = await browser.createBrowserContext()
  let page: Page
  try {
    page = await context.newPage()
    await shim(page)
    await page.setViewport({ width, height: 900 })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: mode },
    ])
    await focusable(page)
    // Some sites turn away a "HeadlessChrome" user agent (Notion).
    await page.setUserAgent(
      (await browser.userAgent()).replace("HeadlessChrome", "Chrome"),
    )
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
    await page.goto(url, { waitUntil: "load", timeout: 60000 })
    // Docs sites keep connections open, so a short quiet spell is enough;
    // apps still hydrate after it.
    await page
      .waitForNetworkIdle({ idleTime: 500, timeout: 10000 })
      .catch(() => {})
    await pause(wait)
    await runSteps(page, steps)
  }
  return { page, load, close: () => context.close() }
}
