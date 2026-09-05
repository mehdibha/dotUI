/**
 * Write the registry's resolved output into a consumer template, in-process,
 * without the shadcn CLI — for looking at real consumer files while working.
 *
 *   pnpm examples:preview [--example <name>] [--watch]
 *
 * Runs the publisher the way `/r/$name` does for every publishable, formats,
 * and writes the files where the CLI would put them (`src/components/ui`,
 * `src/hooks`, `src/lib`) plus the stylesheet rendered from the init item's
 * CSS fields. With the template's own dev server running, every save to the
 * registry shows up through HMR. `--watch` re-runs on changes under
 * `www/src/registry` and `www/src/publisher`.
 *
 * This is a preview, never the committed output: the CLI reprints every file
 * in its own style and wires fonts per framework, so what lands in `examples/`
 * comes only from `pnpm smoke:examples`. Don't commit what this writes.
 */

import { spawn, spawnSync } from "node:child_process"
import { mkdirSync, watch, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { resolveRequestPreset } from "@/lib/registry-preset"
import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables"
import { CN_UTILS_TS, emitInitItem } from "@/publisher/emit-theme"
import { renderStylesheet } from "@/publisher/emit-v0"
import { consumerPath, publishItem } from "@/publisher/serve"
import { encodePreset } from "@/modules/create/preset/codec"
import { PRESETS } from "@/modules/presets/presets-data"

const WWW_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const REPO_DIR = path.resolve(WWW_DIR, "..")
const EXAMPLES_DIR = path.join(REPO_DIR, "examples")

// Mirrors `examples/scripts/smoke.ts` — add a template in both places.
const EXAMPLES: Record<string, { preset: string; stylesheet: string }> = {
  "origin-next": { preset: "origin", stylesheet: "src/app/globals.css" },
  "origin-tanstack-start": { preset: "origin", stylesheet: "src/styles.css" },
  "spotify-next": { preset: "spotify", stylesheet: "src/app/globals.css" },
  "spotify-tanstack-start": { preset: "spotify", stylesheet: "src/styles.css" },
}

function parseArgs(argv: string[]): { examples: string[]; watch: boolean } {
  let examples = Object.keys(EXAMPLES)
  let watchMode = false
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--watch") {
      watchMode = true
    } else if (arg === "--example" && argv[i + 1]) {
      const name = argv[++i] ?? ""
      if (!(name in EXAMPLES)) {
        console.error(
          `error: unknown example "${name}" (expected ${Object.keys(EXAMPLES).join(" | ")})`,
        )
        process.exit(2)
      }
      examples = [name]
    } else {
      console.error(`error: unexpected argument "${arg}"`)
      process.exit(2)
    }
  }
  return { examples, watch: watchMode }
}

function write(cwd: string, rel: string, content: string): void {
  const abs = path.join(cwd, rel)
  mkdirSync(path.dirname(abs), { recursive: true })
  writeFileSync(abs, content, "utf8")
}

async function materialize(example: string): Promise<void> {
  const { preset: presetId, stylesheet } = EXAMPLES[example] ?? {}
  const source = PRESETS.find((p) => p.id === presetId)
  if (!stylesheet || !source) throw new Error(`unknown example ${example}`)
  const cwd = path.join(EXAMPLES_DIR, example)
  const encodedPreset = encodePreset(source.designSystem)
  const preset = await resolveRequestPreset(encodedPreset)

  let files = 0
  for (const name of PUBLISHABLE_NAMES) {
    const item = await publishItem({
      name,
      preset,
      origin: "https://dotui.org",
      encodedPreset,
    })
    for (const file of item?.files ?? []) {
      if (file.content == null) continue
      write(cwd, consumerPath(file.path), file.content)
      files++
    }
  }
  write(cwd, "src/lib/utils.ts", CN_UTILS_TS)

  // The stylesheet as the init item's CSS fields render; `shadcn init` merges
  // the same fields into the consumer's file. Fonts are not wired here, so a
  // preset's faces fall back to the system stack.
  const init = emitInitItem({
    baseRegistryCss,
    preset,
    encodedPreset,
    registryRoot: "https://dotui.org",
  })
  write(
    cwd,
    stylesheet,
    renderStylesheet({ css: init.css, cssVars: init.cssVars }),
  )
  console.log(`${example}: ${files} files + ${stylesheet}`)
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  if (!options.watch) {
    for (const example of options.examples) await materialize(example)
    return
  }

  // Watch mode re-execs a one-shot run per change so publishables reload: the
  // registry build rewrites `__generated__/publishables`, and a long-lived
  // process would keep the first import.
  const args = options.examples.flatMap((name) => ["--example", name])
  let timer: NodeJS.Timeout | undefined
  let running = false
  let queued = false
  const rerun = () => {
    if (running) {
      queued = true
      return
    }
    running = true
    spawnSync("pnpm", ["build:registry"], { cwd: REPO_DIR, stdio: "ignore" })
    const child = spawn(
      path.join(WWW_DIR, "node_modules/.bin/tsx"),
      [fileURLToPath(import.meta.url), ...args],
      { cwd: WWW_DIR, stdio: "inherit" },
    )
    child.on("exit", () => {
      running = false
      if (queued) {
        queued = false
        rerun()
      }
    })
  }
  for (const dir of ["src/registry", "src/publisher"]) {
    watch(path.join(WWW_DIR, dir), { recursive: true }, (_event, file) => {
      if (file?.includes("__generated__")) return
      clearTimeout(timer)
      timer = setTimeout(rerun, 300)
    })
  }
  console.log(
    `watching www/src/registry and www/src/publisher — ctrl-c to stop`,
  )
  rerun()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
