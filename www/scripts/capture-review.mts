/**
 * Screenshots a preset composed, for a visual review: the landing's cards
 * panel, every showcase card and every studio block, plus the captured
 * system's blocks on ds.dotui.org to compare against.
 *
 *   tsx scripts/capture-review.mts --preset <id|all> [--mode light|dark|both]
 *     [--only landing,cards,blocks,refs] [--port 5173] [--out .scratch-review]
 *     [--ds https://ds.dotui.org]
 *
 * Writes <out>/<preset>/landing-<mode>.png, cards/<card>-<mode>.png,
 * blocks/<block>-<mode>.png and refs/<block>-<mode>.png, at DPR 2. Refs are
 * taken only in the modes the system was captured in. Run from www/.
 */
import { existsSync, readFileSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"
import { parseArgs } from "node:util"
import puppeteer, { type Browser, type Page } from "puppeteer"

import { executablePath } from "@dotui/capture/chromium"

import { PRESET_CATALOG } from "../src/modules/presets/__generated__/catalog"

type Preset = (typeof PRESET_CATALOG)[number]

const { values: args } = parseArgs({
  options: {
    preset: { type: "string", default: "all" },
    mode: { type: "string", default: "both" },
    only: { type: "string", default: "landing,cards,blocks,refs" },
    port: { type: "string", default: "5173" },
    out: { type: "string", default: ".scratch-review" },
    ds: { type: "string", default: "https://ds.dotui.org" },
  },
})

const BASE = `http://localhost:${args.port}`
const MODES = args.mode === "both" ? ["light", "dark"] : [args.mode]
if (!MODES.every((m) => m === "light" || m === "dark")) {
  console.error(`--mode must be light, dark or both`)
  process.exit(1)
}
const ONLY = new Set(args.only.split(","))
// The blocks index globs its modules (Vite only), so read its slugs as text.
const BLOCKS = [
  ...readFileSync(
    "src/modules/studio/preview/blocks/index.ts",
    "utf8",
  ).matchAll(/slug: "([^"]+)"/g),
].map((match) => match[1] ?? "")
const presets =
  args.preset === "all"
    ? PRESET_CATALOG
    : PRESET_CATALOG.filter((p) => p.id === args.preset)
if (presets.length === 0) {
  console.error(
    `unknown preset "${args.preset}". Presets: ${PRESET_CATALOG.map((p) => p.id).join(", ")}`,
  )
  process.exit(1)
}

// Loops (spinners, skeletons) freeze on their first frame; one-shot entry
// animations jump to their end; caret and transitions are switched off.
const FREEZE_CSS = `*,*::before,*::after{transition:none!important;caret-color:transparent!important}`
const freezeAnimations = () => {
  for (const animation of document.getAnimations()) {
    if (animation.effect?.getComputedTiming().iterations === Infinity) {
      animation.pause()
      animation.currentTime = 0
    } else {
      animation.finish()
    }
  }
}
// The landing's site header and fade masks would cover the cards.
const LANDING_CSS = `header{display:none!important}[role=tabpanel],[role=tabpanel] *{mask:none!important}`

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: FREEZE_CSS })
  await sleep(400)
  await page.evaluate(freezeAnimations)
  await sleep(100)
}

async function open(
  browser: Browser,
  mode: string,
  width: number,
  height = 900,
): Promise<{ page: Page; errors: string[] }> {
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (err) => errors.push(String(err)))
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: mode },
  ])
  return { page, errors }
}

// /preview/* renders the current selection, which lives in localStorage.
async function selectPreset(page: Page, id: string) {
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
  await page.evaluate((preset) => {
    localStorage.setItem(
      "dotui:current",
      JSON.stringify({ kind: "preset", id: preset }),
    )
  }, id)
}

async function landing(browser: Browser, preset: Preset, mode: string) {
  const { page, errors } = await open(browser, mode, 1440)
  try {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 60000 })
    // Clicks before hydration go nowhere: retry until the tab takes.
    const tab = `[role=tab][data-key="${preset.id}"]`
    await page.waitForSelector(tab)
    for (let i = 0; i < 20; i++) {
      await page.click(tab)
      await sleep(300)
      const selected = await page.$eval(tab, (node) =>
        node.getAttribute("aria-selected"),
      )
      if (selected === "true") break
    }
    await page.addStyleTag({ content: LANDING_CSS })
    await settle(page)
    const panel = await page.waitForSelector("[role=tabpanel]")
    await panel?.screenshot({ path: path(preset, `landing-${mode}.png`) })
    report(preset, `landing-${mode}`, errors)
  } finally {
    await page.close()
  }
}

async function cards(browser: Browser, preset: Preset, mode: string) {
  // Wide enough for the six canvas columns at the roomiest density.
  const { page, errors } = await open(browser, mode, 2800, 1200)
  try {
    await selectPreset(page, preset.id)
    await page.goto(`${BASE}/preview/cards?mode=${mode}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    })
    await page.waitForSelector("[data-showcase-card]")
    await settle(page)
    const keys = await page.$$eval("[data-showcase-card]", (nodes) =>
      nodes.map((node) => node.getAttribute("data-showcase-card") ?? ""),
    )
    await mkdir(path(preset, "cards"), { recursive: true })
    for (const key of keys) {
      // Off-screen cards skip rendering (content-visibility): bring each in,
      // and keep room around it for its shadow.
      const box = await page.$eval(
        `[data-showcase-card="${key}"] > *`,
        async (node) => {
          node.scrollIntoView({ block: "center" })
          await new Promise(requestAnimationFrame)
          const rect = node.getBoundingClientRect()
          return {
            x: Math.max(0, rect.x + scrollX - 16),
            y: Math.max(0, rect.y + scrollY - 16),
            width: rect.width + 32,
            height: rect.height + 40,
          }
        },
      )
      await sleep(100)
      await page.screenshot({
        path: path(preset, `cards/${key}-${mode}.png`),
        clip: box,
        captureBeyondViewport: true,
      })
    }
    report(preset, `cards (${keys.length})-${mode}`, errors)
  } finally {
    await page.close()
  }
}

async function blocks(browser: Browser, preset: Preset, mode: string) {
  const { page, errors } = await open(browser, mode, 1440)
  try {
    await selectPreset(page, preset.id)
    await mkdir(path(preset, "blocks"), { recursive: true })
    for (const slug of BLOCKS) {
      await page.goto(`${BASE}/preview/${slug}?mode=${mode}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      })
      await settle(page)
      await page.screenshot({
        path: path(preset, `blocks/${slug}-${mode}.png`),
        fullPage: true,
      })
    }
    report(preset, `blocks (${BLOCKS.length})-${mode}`, errors)
  } finally {
    await page.close()
  }
}

type Captured = { blocks: { name: string; copies: Record<string, string> }[] }

async function refs(browser: Browser, preset: Preset, mode: string) {
  const file = resolve(`../directory/systems/${preset.id}/blocks.json`)
  if (!existsSync(file)) return console.log(`  --   ${preset.id}: no blocks`)
  const captured = JSON.parse(readFileSync(file, "utf8")) as Captured
  const names = captured.blocks
    .filter((block) => block.copies[mode])
    .map((block) => block.name)
  if (names.length === 0) return
  const { page, errors } = await open(browser, mode, 1440)
  try {
    await page.goto(`${args.ds}/systems/${preset.id}/blocks`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    })
    await mkdir(path(preset, "refs"), { recursive: true })
    for (const name of names) {
      const article = await page.$(`#block-${name}`)
      if (!article) continue
      await article.scrollIntoView()
      // Copies load once seen.
      await page
        .waitForFunction(
          (id) =>
            !document.getElementById(id)?.textContent?.includes("Loading…"),
          { timeout: 30000 },
          `block-${name}`,
        )
        .catch(() => {})
      await settle(page)
      await article.screenshot({
        path: path(preset, `refs/${name}-${mode}.png`),
      })
    }
    report(preset, `refs (${names.length})-${mode}`, errors)
  } finally {
    await page.close()
  }
}

const path = (preset: Preset, file: string) =>
  resolve(args.out, preset.id, file)

function report(preset: Preset, what: string, errors: string[]) {
  console.log(`  ok   ${preset.id}/${what}`)
  for (const error of errors) console.warn(`       pageerror: ${error}`)
}

const STEPS = { landing, cards, blocks, refs }

const browser = await puppeteer.launch({
  headless: "shell",
  executablePath,
  protocolTimeout: 120000,
  args: [
    "--hide-scrollbars",
    "--font-render-hinting=none",
    // Cloud containers run as root, where Chrome's sandbox refuses to start.
    ...(process.getuid?.() === 0 ? ["--no-sandbox"] : []),
  ],
})
const failures: string[] = []
try {
  for (const preset of presets) {
    await mkdir(resolve(args.out, preset.id), { recursive: true })
    for (const [name, step] of Object.entries(STEPS)) {
      if (!ONLY.has(name)) continue
      for (const mode of MODES) {
        try {
          await step(browser, preset, mode)
        } catch (err) {
          console.error(
            `  FAIL ${preset.id}/${name}-${mode}: ${(err as Error).message}`,
          )
          failures.push(`${preset.id}/${name}-${mode}`)
        }
      }
    }
  }
} finally {
  await browser.close()
}
if (failures.length > 0) process.exit(1)
