import { existsSync, readdirSync } from "node:fs"

const PLAYWRIGHT = "/opt/pw-browsers"

/** The browser the preset tools launch: Puppeteer's own download, unless
 *  PUPPETEER_EXECUTABLE_PATH names one or a cloud container ships
 *  Playwright's Chromium instead. */
export const executablePath = (() => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH)
    return process.env.PUPPETEER_EXECUTABLE_PATH
  if (!existsSync(PLAYWRIGHT)) return undefined
  const shell = readdirSync(PLAYWRIGHT).find((dir) =>
    dir.startsWith("chromium_headless_shell-"),
  )
  return shell && `${PLAYWRIGHT}/${shell}/chrome-linux/headless_shell`
})()
