/**
 * Renders /internal/cover (real components under several presets) into every
 * size the cover ships in: the GitHub social preview and the site's share image.
 *
 *   pnpm build:cover [--port 5173]
 *
 * Starts its own dev server unless --port points at one already running.
 * Writes public/brand/cover/{github,og}.png, skipping any image whose render
 * matches the committed one. Run from www/.
 */
import { spawn } from "node:child_process"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { parseArgs } from "node:util"
import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"
import puppeteer from "puppeteer"

const { values: args } = parseArgs({
  options: { port: { type: "string" } },
})

const SIZES = [
  // Repo Settings → Social preview; GitHub caps uploads at 1 MB.
  { name: "github", width: 1280, height: 640, scale: 1 },
  // og:image / twitter:image, 2400×1260.
  { name: "og", width: 1200, height: 630, scale: 2 },
]

const OUT = resolve("public/brand/cover")
const FREEZE_CSS = `*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}`

const port = args.port ?? "5199"
const server = args.port
  ? undefined
  : spawn("pnpm", ["exec", "vite", "dev", "--port", port, "--strictPort"], {
      stdio: "ignore",
      detached: true,
    })
const url = `http://localhost:${port}/internal/cover`

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(url)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error(`dev server never answered on ${url}`)
}

// Repeat renders differ by a few antialiased pixels; pixelmatch's defaults
// ignore those, so CI only commits a cover that visibly changed.
async function changed(path: string, png: Uint8Array) {
  let prev: PNG
  try {
    prev = PNG.sync.read(await readFile(path))
  } catch {
    return true
  }
  const next = PNG.sync.read(Buffer.from(png))
  if (prev.width !== next.width || prev.height !== next.height) return true
  return pixelmatch(prev.data, next.data, null, next.width, next.height) > 0
}

await mkdir(OUT, { recursive: true })
const browser = await puppeteer.launch({
  headless: "shell",
  // CI runners (and containers running as root) can't use Chrome's sandbox.
  args: [
    "--hide-scrollbars",
    "--font-render-hinting=none",
    ...(process.env.CI ? ["--no-sandbox"] : []),
  ],
})
try {
  await waitForServer()
  for (const size of SIZES) {
    const page = await browser.newPage()
    const errors: string[] = []
    page.on("pageerror", (err) => errors.push(String(err)))
    await page.setViewport({
      width: size.width,
      height: size.height,
      deviceScaleFactor: size.scale,
    })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: "light" },
    ])
    await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 })
    await page.waitForSelector("html[data-cover-ready]", { timeout: 60000 })
    await page.addStyleTag({ content: FREEZE_CSS })
    const path = resolve(OUT, `${size.name}.png`)
    const png = await page.screenshot()
    if (await changed(path, png)) {
      await writeFile(path, png)
      console.log(`  ok   ${path}`)
    } else {
      console.log(`  unchanged ${path}`)
    }
    for (const error of errors) console.warn(`       pageerror: ${error}`)
    await page.close()
  }
} finally {
  await browser.close()
  // pnpm → vite: kill the whole group, not just pnpm.
  if (server?.pid) process.kill(-server.pid)
}
