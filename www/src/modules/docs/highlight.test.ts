import fs from "node:fs"
import path from "node:path"
import { createHighlighterCoreSync } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import tsx from "shiki/langs/tsx.mjs"
import githubDark from "shiki/themes/github-dark.mjs"
import githubLight from "shiki/themes/github-light.mjs"
import { describe, expect, it } from "vitest"

import { tokenizeTsx } from "./highlight"

// The runtime highlighter must paint the playground sources like the build-time
// shiki output next to them on a docs page. Compares every non-whitespace
// character's color across all playground demos and caps the mismatch rate.

const MAX_MISMATCH = 0.01

const shiki = createHighlighterCoreSync({
  langs: [tsx],
  themes: [githubLight, githubDark],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
})

const FG = { light: "#24292e", dark: "#e1e4e8" }

const uiDir = path.join(import.meta.dirname, "../../registry/ui")
const playgrounds = fs
  .readdirSync(uiDir)
  .map((name) => path.join(uiDir, name, "demos/playground.tsx"))
  .filter((file) => fs.existsSync(file))

function shikiColors(code: string, mode: "light" | "dark") {
  const colors: (string | null)[] = []
  const { tokens } = shiki.codeToTokens(code, {
    lang: "tsx",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
  for (const line of tokens) {
    for (const token of line) {
      const style = token.htmlStyle as Record<string, string> | undefined
      const color = (style?.[`--shiki-${mode}`] ?? FG[mode]).toLowerCase()
      for (const _ of token.content) colors.push(color)
    }
    colors.push(null)
  }
  return colors
}

describe.each(["light", "dark"] as const)(
  "tokenizeTsx vs shiki (%s)",
  (mode) => {
    it("colors playground sources like shiki", () => {
      let total = 0
      let mismatched = 0
      const byToken = new Map<string, number>()
      for (const file of playgrounds) {
        const code = fs.readFileSync(file, "utf8")
        const expected = shikiColors(code, mode)
        let i = 0
        for (const line of tokenizeTsx(code)) {
          for (const token of line) {
            const color = token[mode].toLowerCase()
            let misses = 0
            for (const ch of token.content) {
              const want = expected[i++]
              if (/\s/.test(ch)) continue
              total++
              if (want !== color) misses++
            }
            if (misses) {
              mismatched += misses
              const key = `${JSON.stringify(token.content)} ${color} (shiki ${expected[i - 1]})`
              byToken.set(key, (byToken.get(key) ?? 0) + misses)
            }
          }
          i++
        }
      }
      const rate = mismatched / total
      const worst = [...byToken]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key, n]) => `  ${String(n).padStart(4)} ${key}`)
        .join("\n")
      expect(
        rate,
        `mismatch ${(100 * rate).toFixed(2)}%\n${worst}`,
      ).toBeLessThanOrEqual(MAX_MISMATCH)
    })
  },
)
