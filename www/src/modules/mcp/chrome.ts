/* The headless browser behind render: one per instance, launched on first
   use and reused. Every browser package loads by dynamic import so only the
   render path pays for it. */

import type { Browser, Page } from "puppeteer-core"

import type { Screenshotter, Shot } from "./render"
import { ToolError } from "./tools"

/** Serverless Chromium, downloaded to /tmp on cold start. Its major version
 *  must match @sparticuz/chromium-min and the Chrome puppeteer-core targets. */
const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar"

const WIDTH = 1280
const MAX_HEIGHT = 2000
const JPEG_QUALITY = 70
const LAUNCH_TIMEOUT = 30_000
const PAGE_TIMEOUT = 25_000
const MAX_PAGES = 2

/** Over a pipe, Chrome exits with this process, even when it is killed. */
const pipe = true

async function launch(): Promise<Browser> {
  const puppeteer = await import("puppeteer-core")
  if (process.env.CHROME_PATH)
    return puppeteer.launch({ executablePath: process.env.CHROME_PATH, pipe })
  if (process.platform === "linux") {
    const { default: chromium } = await import("@sparticuz/chromium-min")
    return puppeteer.launch({
      args: await puppeteer.defaultArgs({
        args: chromium.args,
        headless: "shell",
      }),
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: "shell",
      pipe,
    })
  }
  // Local development: the repo's full puppeteer (a root devDependency) and
  // the Chrome it downloaded. A variable specifier keeps it out of the build.
  const local = "puppeteer"
  const { default: full } = (await import(/* @vite-ignore */ local)) as {
    default: typeof puppeteer
  }
  return full.launch({ pipe })
}

let browser: Promise<Browser> | undefined

function getBrowser() {
  browser ??= withTimeout(launch(), LAUNCH_TIMEOUT, "Launching the browser")
    .then((b) => {
      b.on("disconnected", () => (browser = undefined))
      return b
    })
    .catch((error: unknown) => {
      browser = undefined
      throw error
    })
  return browser
}

let active = 0
const queue: (() => void)[] = []

/** A page slot; the release hands it straight to the next waiter. */
async function acquire() {
  if (active < MAX_PAGES) active++
  else await new Promise<void>((resolve) => queue.push(resolve))
  return () => {
    const next = queue.shift()
    if (next) next()
    else active--
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, what: string) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new ToolError(`${what} timed out after ${ms / 1000}s.`)),
        ms,
      )
    }),
  ]).finally(() => clearTimeout(timer))
}

const bypassHeaders = (): Record<string, string> | undefined => {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  return secret
    ? {
        "x-vercel-protection-bypass": secret,
        "x-vercel-set-bypass-cookie": "true",
      }
    : undefined
}

/** Protected deployments: the bypass goes to our own origin only, never to
 *  the font CDN and other third parties the page loads. */
async function sendBypass(page: Page, origin: string) {
  const headers = bypassHeaders()
  if (!headers) return
  await page.setRequestInterception(true)
  page.on("request", (request) => {
    if (request.isInterceptResolutionHandled()) return
    const own = new URL(request.url()).origin === origin
    void request.continue(
      own ? { headers: { ...request.headers(), ...headers } } : undefined,
    )
  })
}

/** In the page: resolve once fonts, images and the DOM have settled, with
 *  the captured range scrolled through so anything mounted on view mounts. */
async function settle(sectionTitle: string | undefined, maxHeight: number) {
  const quiet = (ms: number, max: number) =>
    new Promise<void>((resolve) => {
      let timer = setTimeout(done, ms)
      const cap = setTimeout(done, max)
      const observer = new MutationObserver(() => {
        clearTimeout(timer)
        timer = setTimeout(done, ms)
      })
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      })
      function done() {
        observer.disconnect()
        clearTimeout(timer)
        clearTimeout(cap)
        resolve()
      }
    })
  const images = () =>
    Promise.all(
      [...document.images]
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true })
              img.addEventListener("error", resolve, { once: true })
            }),
        ),
    )

  await document.fonts.ready
  await quiet(300, 4000)
  if (!document.body.innerText.trim())
    throw new Error("The page rendered nothing.")
  if (document.body.innerText.trim() === "Preview not found")
    throw new Error("Preview not found.")

  let top = 0
  let height = document.documentElement.scrollHeight
  if (sectionTitle) {
    const section = [...document.querySelectorAll("section")].find((el) =>
      el.firstElementChild?.textContent?.includes(`— ${sectionTitle}`),
    )
    if (!section) throw new Error(`Section "${sectionTitle}" not found.`)
    top = section.getBoundingClientRect().top + window.scrollY
    height = section.offsetHeight
  }
  height = Math.min(height, maxHeight)

  for (let y = top; y < top + height; y += window.innerHeight) {
    window.scrollTo(0, y)
    await new Promise(requestAnimationFrame)
  }
  window.scrollTo(0, 0)
  await images()
  await document.fonts.ready
  await quiet(200, 2000)
  for (const animation of document.getAnimations()) {
    try {
      animation.finish()
    } catch {
      // Infinite animations (spinners) cannot finish; they stay as they are.
    }
  }
  await new Promise(requestAnimationFrame)
  return {
    top: Math.round(top),
    height: Math.round(height),
    pageHeight: document.documentElement.scrollHeight,
  }
}

async function capture(page: Page, url: string, section?: string) {
  const { origin, searchParams } = new URL(url)
  const mode = searchParams.get("mode") === "dark" ? "dark" : "light"
  await sendBypass(page, origin)
  await page.setViewport({ width: WIDTH, height: 800, deviceScaleFactor: 1 })
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: mode },
    { name: "prefers-reduced-motion", value: "reduce" },
  ])
  const response = await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: PAGE_TIMEOUT,
  })
  if (response && !response.ok())
    throw new ToolError(`${url} answered HTTP ${response.status()}.`)
  const box = await page.evaluate(settle, section, MAX_HEIGHT)
  const jpeg = await page.screenshot({
    type: "jpeg",
    quality: JPEG_QUALITY,
    clip: { x: 0, y: box.top, width: WIDTH, height: box.height },
    captureBeyondViewport: true,
  })
  return { jpeg, ...box } satisfies Shot
}

export const screenshot: Screenshotter = async ({ url, section }) => {
  let browser: Browser
  try {
    browser = await getBrowser()
  } catch (error) {
    throw new ToolError(`render is unavailable here: ${message(error)}`)
  }
  const release = await acquire()
  const page = await browser.newPage().catch((error: unknown) => {
    release()
    throw new ToolError(`render is unavailable here: ${message(error)}`)
  })
  try {
    return await withTimeout(
      capture(page, url, section),
      PAGE_TIMEOUT,
      `Rendering ${url}`,
    )
  } catch (error) {
    if (error instanceof ToolError) throw error
    throw new ToolError(`Rendering ${url} failed: ${message(error)}`)
  } finally {
    release()
    void page.close().catch(() => {})
  }
}

const message = (error: unknown) =>
  error instanceof Error ? error.message : String(error)
