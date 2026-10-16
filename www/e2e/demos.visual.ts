import { readdirSync } from "node:fs"
import path from "node:path"
import { argosScreenshot } from "@argos-ci/playwright"
import { test } from "@playwright/test"

const uiDir = path.resolve(import.meta.dirname, "../src/registry/ui")
const components = readdirSync(uiDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

// Demos that show a loading state on purpose, so `aria-busy` never clears.
const alwaysBusy = new Set(["sidebar", "skeleton"])

for (const slug of components) {
  test(slug, async ({ page }, testInfo) => {
    // Calendars and date pickers highlight today; pin it so diffs stay stable.
    await page.clock.setFixedTime(new Date("2026-01-15T10:00:00Z"))
    await page.goto(`/demos/${slug}`)
    // The scroller may jump to its end after mount; pin it there and wait
    // until its position holds for a few frames.
    await page
      .locator("[data-message-scroller-viewport]")
      .evaluateAll(async (viewports) => {
        const frame = () => new Promise(requestAnimationFrame)
        let stable = 0
        while (stable < 5) {
          const before = viewports.map((viewport) => viewport.scrollTop)
          for (const viewport of viewports) {
            viewport.scrollTop = viewport.scrollHeight
          }
          await frame()
          const moved = viewports.some(
            (viewport, index) => viewport.scrollTop !== before[index],
          )
          stable = moved ? 0 : stable + 1
        }
      })
    await argosScreenshot(page, `demos/${slug} (${testInfo.project.name})`, {
      stabilize: { waitForAriaBusy: !alwaysBusy.has(slug) },
      // `content-visibility: auto` (message-scroller items) skips painting
      // offscreen content at random; paint everything for the screenshot.
      argosCSS: "* { content-visibility: visible !important; }",
    })
  })
}
