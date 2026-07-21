/**
 * Ground-truth reference screenshots for high-fidelity presets (issue #484, Phase 0).
 *
 * Manifest-driven: each entry names a live design-system doc page + a selector for its
 * primary component showcase. Every entry is captured in light AND dark and written to
 *   src/modules/preset-lab/refs/<system>/<component>-<light|dark>.png
 * That filename convention is load-bearing — the fidelity harness resolves images by it.
 *
 * Usage:  tsx scripts/capture-refs.mts [system] [component]   (run from www/; args filter)
 */
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer, { type Browser, type Page } from 'puppeteer'

type Theme = 'light' | 'dark'
type RefEntry = {
  system: string
  component: string
  url: string
  /** CSS selector for the showcase block; the `nth` match is captured. */
  selector: string
  nth?: number
  /** Selector proving the page is ready (defaults to `selector`; differs when `action` creates the target). */
  ready?: string
  /** Optional pre-capture step (e.g. open an overlay) run after the theme is set. */
  action?: (page: Page) => Promise<void>
}

const REFS_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/modules/preset-lab/refs',
)
const VIEWPORT = { width: 1280, height: 900, deviceScaleFactor: 2 }

// Geist docs render each example as a bordered card; the first card is the primary showcase.
const GEIST_CARD = 'div.rounded-lg.border.bg-background-100'
const geist = (
  component: string,
  slug = component,
  extra: Partial<RefEntry> = {},
): RefEntry => ({
  system: 'vercel',
  component,
  url: `https://vercel.com/geist/${slug}`,
  selector: GEIST_CARD,
  ...extra,
})

const manifest: RefEntry[] = [
  geist('button'),
  geist('input'),
  geist('tabs'),
  // Geist's boolean switch is "Toggle" (/geist/switch is their segmented control).
  geist('switch', 'toggle'),
  geist('badge'),
  geist('checkbox'),
  geist('tooltip'),
  // Command menu is an overlay, not static: open it, then capture the dialog panel.
  geist('command', 'button', {
    selector: '[cmdk-dialog]',
    ready: GEIST_CARD,
    action: async (page) => {
      await page.keyboard.down('Meta')
      await page.keyboard.press('KeyK')
      await page.keyboard.up('Meta')
      await page.waitForSelector('[cmdk-dialog]', { timeout: 5000 })
      await sleep(400)
    },
  }),
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function gotoWithRetry(
  page: Page,
  url: string,
  waitFor: string,
  tries = 3,
): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      const resp = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      })
      const status = resp?.status() ?? 0
      if (status >= 400) throw new Error(`HTTP ${status}`)
      await page.waitForSelector(waitFor, { timeout: 20000 })
      return
    } catch (err) {
      if (attempt >= tries) throw err
      await sleep(1000 * attempt)
    }
  }
}

/** Geist reads theme from an `html` class + colorScheme; set both, provider has already run. */
async function setTheme(page: Page, theme: Theme): Promise<void> {
  await page.evaluate((t: Theme) => {
    const html = document.documentElement
    html.classList.remove('light-theme', 'dark-theme')
    html.classList.add(`${t}-theme`)
    html.style.colorScheme = t
  }, theme)
  await sleep(250)
}

async function capture(
  browser: Browser,
  entry: RefEntry,
  theme: Theme,
): Promise<void> {
  const page = await browser.newPage()
  try {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ])
    await page.setViewport(VIEWPORT)
    await gotoWithRetry(page, entry.url, entry.ready ?? entry.selector)
    await setTheme(page, theme)
    if (entry.action) await entry.action(page)

    const target = (await page.$$(entry.selector))[entry.nth ?? 0]
    if (!target)
      throw new Error(`selector matched no element: ${entry.selector}`)
    await sleep(150)

    const out = resolve(
      REFS_DIR,
      entry.system,
      `${entry.component}-${theme}.png`,
    )
    await mkdir(dirname(out), { recursive: true })
    await target.screenshot({ path: out })
    console.log(`  ok   ${entry.system}/${entry.component}-${theme}.png`)
  } finally {
    await page.close()
  }
}

const [filterSystem, filterComponent] = process.argv.slice(2)
const entries = manifest.filter(
  (e) =>
    (!filterSystem || e.system === filterSystem) &&
    (!filterComponent || e.component === filterComponent),
)

// `headless: 'shell'` composites reliably; the new headless mode hangs screenshotting
// vercel.com's continuously-animated background (Page.captureScreenshot never returns).
const browser = await puppeteer.launch({
  headless: 'shell',
  protocolTimeout: 60000,
  args: [
    '--disable-gpu',
    '--hide-scrollbars',
    '--run-all-compositor-stages-before-draw',
  ],
})
const failures: string[] = []
try {
  for (const entry of entries) {
    for (const theme of ['light', 'dark'] as const) {
      try {
        await capture(browser, entry, theme)
      } catch (err) {
        const id = `${entry.system}/${entry.component}-${theme}`
        console.error(`  FAIL ${id}: ${(err as Error).message}`)
        failures.push(id)
      }
    }
  }
} finally {
  await browser.close()
}

console.log(
  `\n${entries.length * 2 - failures.length} captured, ${failures.length} failed`,
)
if (failures.length > 0) process.exit(1)
