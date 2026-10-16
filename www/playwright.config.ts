import { createArgosReporterOptions } from "@argos-ci/playwright/reporter"
import { defineConfig, devices } from "@playwright/test"

// Visual diffs of every component's demos, reviewed in Argos on each PR.
// Runs against a production build: `pnpm build:www` first.
export default defineConfig({
  testDir: "./e2e",
  testMatch: "*.visual.ts",
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({ uploadToArgos: !!process.env.CI }),
    ],
  ],
  use: {
    baseURL: "http://localhost:4173",
    ...devices["Desktop Chrome"],
    locale: "en-US",
    timezoneId: "UTC",
    launchOptions: {
      // Stable font rendering across runs, per Argos' Playwright guide.
      args: ["--disable-lcd-text", "--font-render-hinting=none"],
    },
  },
  projects: [
    { name: "light", use: { colorScheme: "light" } },
    { name: "dark", use: { colorScheme: "dark" } },
  ],
  webServer: {
    command: "pnpm preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
})
