/**
 * Screenshots /internal/specimens sheets from a running dev server.
 *
 *   tsx scripts/capture-specimens.mts --preset <id|all> [--mode light|dark|both]
 *     [--sheet <name|all>] [--port 5173] [--out .scratch-specimens]
 *
 * Writes <out>/<preset>/<sheet>-<mode>.png at 1280×900, DPR 2. Run from www/.
 */
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"
import { parseArgs } from "node:util"
import puppeteer, { type Browser } from "puppeteer"

const { values: args } = parseArgs({
  options: {
    preset: { type: "string", default: "all" },
    mode: { type: "string", default: "both" },
    sheet: { type: "string", default: "all" },
    port: { type: "string", default: "5173" },
    out: { type: "string", default: ".scratch-specimens" },
  },
})

const BASE = `http://localhost:${args.port}/internal/specimens`
const VIEWPORT = { width: 1280, height: 900, deviceScaleFactor: 2 }
const OUT = args.out
const MODES = args.mode === "both" ? ["light", "dark"] : [args.mode]
if (!MODES.every((m) => m === "light" || m === "dark")) {
  console.error(`--mode must be light, dark or both`)
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

async function catalog(browser: Browser) {
  const page = await browser.newPage()
  try {
    await page.goto(BASE, { waitUntil: "networkidle0", timeout: 60000 })
    await page.waitForSelector("#specimen-catalog", { timeout: 60000 })
    return await page.$eval("#specimen-catalog", (node) => ({
      presets: (node.getAttribute("data-presets") ?? "").split(","),
      sheets: (node.getAttribute("data-sheets") ?? "").split(","),
    }))
  } finally {
    await page.close()
  }
}

async function capture(
  browser: Browser,
  preset: string,
  sheet: string,
  mode: string,
) {
  const page = await browser.newPage()
  const errors: string[] = []
  page.on("pageerror", (err) => errors.push(String(err)))
  try {
    await page.setViewport(VIEWPORT)
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: mode },
    ])
    await page.goto(`${BASE}?preset=${preset}&mode=${mode}&sheet=${sheet}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    })
    await page.waitForSelector("html[data-specimen-ready]", { timeout: 30000 })
    await page.evaluate(() => document.fonts.ready)
    await page.addStyleTag({ content: FREEZE_CSS })
    await new Promise((r) => setTimeout(r, 400))
    await page.evaluate(freezeAnimations)
    await new Promise((r) => setTimeout(r, 100))

    const out = resolve(OUT, preset, `${sheet}-${mode}.png`)
    await mkdir(resolve(OUT, preset), { recursive: true })
    await page.screenshot({ path: out })
    console.log(`  ok   ${preset}/${sheet}-${mode}.png`)
    for (const error of errors) console.warn(`       pageerror: ${error}`)
  } finally {
    await page.close()
  }
}

const browser = await puppeteer.launch({
  headless: "shell",
  protocolTimeout: 120000,
  args: ["--hide-scrollbars", "--font-render-hinting=none"],
})
const failures: string[] = []
try {
  const known = await catalog(browser)
  const presets = args.preset === "all" ? known.presets : [args.preset]
  const sheets = args.sheet === "all" ? known.sheets : [args.sheet]
  for (const id of [...presets, ...sheets]) {
    if (!known.presets.includes(id) && !known.sheets.includes(id)) {
      throw new Error(
        `unknown "${id}". Presets: ${known.presets.join(", ")}. Sheets: ${known.sheets.join(", ")}`,
      )
    }
  }
  for (const preset of presets) {
    for (const sheet of sheets) {
      for (const mode of MODES) {
        try {
          await capture(browser, preset, sheet, mode)
        } catch (err) {
          console.error(
            `  FAIL ${preset}/${sheet}-${mode}: ${(err as Error).message}`,
          )
          failures.push(`${preset}/${sheet}-${mode}`)
        }
      }
    }
  }
} finally {
  await browser.close()
}
if (failures.length > 0) process.exit(1)
