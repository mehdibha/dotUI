/**
 * Consumer smoke test — runs the real shadcn CLI against a dotUI registry.
 *
 * The publisher's tests type-check what the registry serves, but nothing
 * exercised the CLI that consumers actually run: where it lands files, how it
 * rewrites imports, which dependencies it installs. That gap is how every
 * component installed to `src/ui/` instead of `src/components/ui/` for three
 * months (#706).
 *
 * Each example in `examples/` is a preset × framework template: a bare
 * framework scaffold with no components.json. Per example:
 *   1. Remove everything a previous run generated.
 *   2. `pnpm install` the scaffold (each example is its own pnpm workspace root).
 *   3. `shadcn init <origin>/r/init?preset=…` — the exact command the docs
 *      give, with the template's preset baked in.
 *   4. `shadcn add @dotui/<name>` for every item in `<origin>/r/registry.json`.
 *   5. A production build, then `tsc --noEmit`.
 *
 * Usage:
 *   node examples/scripts/smoke.ts [--origin <url>] [--example <name>]
 *
 * `--origin` is any deployment: a local `pnpm dev:www` (the default,
 * http://127.0.0.1:4444), a Vercel preview, or production. Preset encoding
 * always comes from this checkout (`www/scripts/encode-preset.ts`), the same
 * way the create page encodes it in the browser.
 */

import { spawnSync } from "node:child_process"
import { rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Pinned so a CLI release can't change what a green run means. Bump on purpose.
const SHADCN = "shadcn@4.20.1"
const DEFAULT_ORIGIN = "http://127.0.0.1:4444"
const EXAMPLES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
)
const REPO_DIR = path.resolve(EXAMPLES_DIR, "..")

type Framework = "next" | "tanstack-start"

// Directory name → what it exercises. Add a template here and to the
// workflow matrix.
const EXAMPLES: Record<string, { framework: Framework; preset: string }> = {
  "origin-next": { framework: "next", preset: "origin" },
  "origin-tanstack-start": { framework: "tanstack-start", preset: "origin" },
  "spotify-next": { framework: "next", preset: "spotify" },
  "spotify-tanstack-start": { framework: "tanstack-start", preset: "spotify" },
}

// The Tailwind entry stylesheet each framework's app imports. `shadcn init`
// appends the dotUI theme to it, so the smoke owns the file: it is gitignored
// and rewritten from this seed before every run. The `@source` is needed
// because the installed components live in a gitignored folder, which
// Tailwind v4 would otherwise skip when scanning for classes.
const STYLESHEET: Record<Framework, { file: string; source: string }> = {
  next: { file: "src/app/globals.css", source: "../components/ui" },
  "tanstack-start": { file: "src/styles.css", source: "./components/ui" },
}

// Everything the CLI writes. Wiped before each run so a result never depends
// on a previous one — and so `src/components/ui` is proven to be where files
// land, not where they were left.
const GENERATED = [
  "components.json",
  "src/components/ui",
  "src/hooks",
  "src/lib",
]

interface Options {
  origin: string
  examples: string[]
}

function parseArgs(argv: string[]): Options {
  let origin = process.env.SMOKE_ORIGIN ?? DEFAULT_ORIGIN
  let examples = Object.keys(EXAMPLES)
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    const value = argv[i + 1]
    if (arg === "--origin" && value) {
      origin = value
      i++
    } else if (arg === "--example" && value) {
      if (!(value in EXAMPLES)) {
        console.error(
          `error: unknown example "${value}" (expected ${Object.keys(EXAMPLES).join(" | ")})`,
        )
        process.exit(2)
      }
      examples = [value]
      i++
    } else {
      console.error(`error: unexpected argument "${arg}"`)
      process.exit(2)
    }
  }
  return { origin: origin.replace(/\/+$/, ""), examples }
}

function run(cwd: string, cmd: string, args: string[]): void {
  console.log(`\n$ ${cmd} ${args.join(" ")}`)
  const result = spawnSync(cmd, args, { cwd, stdio: "inherit" })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args[0] ?? ""} exited with ${result.status}`)
  }
}

/** Encoded `?preset=` values by preset id, from this checkout's preset data. */
function encodePresets(ids: string[]): Record<string, string> {
  const args = [
    "--filter=www",
    "exec",
    "tsx",
    "scripts/encode-preset.ts",
    ...ids,
  ]
  const result = spawnSync("pnpm", args, {
    cwd: REPO_DIR,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  })
  if (result.error) throw result.error
  if (result.status !== 0)
    throw new Error(`encode-preset exited with ${result.status}`)
  return JSON.parse(result.stdout.trim()) as Record<string, string>
}

async function registryNames(origin: string): Promise<string[]> {
  const url = `${origin}/r/registry.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  const registry = (await res.json()) as { items?: Array<{ name: string }> }
  const names = (registry.items ?? []).map((item) => item.name)
  if (names.length === 0) throw new Error(`GET ${url} lists no items`)
  return names
}

async function smoke(
  example: string,
  origin: string,
  encodedPreset: string,
  names: string[],
) {
  const { framework } = EXAMPLES[example]!
  const cwd = path.join(EXAMPLES_DIR, example)
  console.log(`\n=== ${example} ===`)
  for (const generated of GENERATED) {
    rmSync(path.join(cwd, generated), { recursive: true, force: true })
  }
  const stylesheet = STYLESHEET[framework]
  writeFileSync(
    path.join(cwd, stylesheet.file),
    `@import "tailwindcss";\n@source "${stylesheet.source}";\n`,
  )
  run(cwd, "pnpm", ["install"])
  run(cwd, "pnpm", [
    "dlx",
    SHADCN,
    "init",
    `${origin}/r/init?preset=${encodedPreset}`,
    "--yes",
  ])
  run(cwd, "pnpm", [
    "dlx",
    SHADCN,
    "add",
    ...names.map((name) => `@dotui/${name}`),
    "--yes",
    "--overwrite",
  ])
  // Build first: it generates what typecheck needs (TanStack's routeTree.gen.ts,
  // Next's next-env.d.ts).
  run(cwd, "pnpm", ["build"])
  run(cwd, "pnpm", ["typecheck"])
}

async function main() {
  const { origin, examples } = parseArgs(process.argv.slice(2))
  console.log(`registry: ${origin}`)
  const presetIds = [...new Set(examples.map((name) => EXAMPLES[name]!.preset))]
  const encoded = encodePresets(presetIds)
  const names = await registryNames(origin)
  console.log(`items: ${names.length} · presets: ${presetIds.join(", ")}`)

  const failures: string[] = []
  for (const example of examples) {
    try {
      await smoke(example, origin, encoded[EXAMPLES[example]!.preset]!, names)
      console.log(`\n✓ ${example}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`\n✗ ${example}: ${message}`)
      failures.push(example)
    }
  }

  console.log(
    `\n${examples.length - failures.length}/${examples.length} examples passed`,
  )
  process.exit(failures.length === 0 ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
