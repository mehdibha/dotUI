/**
 * Regenerate the consumer templates with the real shadcn CLI.
 *
 * Each template in `examples/` is a preset × framework app with the registry's
 * resolved output committed: styles collapsed to the preset, icon imports
 * swapped, params inlined — what a consumer actually gets, browsable and
 * type-checked in one place. This script is the only thing that writes those
 * files. Per template:
 *   1. Remove everything a previous run generated.
 *   2. `pnpm install` the scaffold (each template is its own pnpm workspace root).
 *   3. `shadcn init <origin>/r/init?preset=…` — the exact command the docs
 *      give, with the template's preset baked in.
 *   4. `shadcn add @dotui/<name>` for every item in `<origin>/r/registry.json`.
 *   5. A production build, then `tsc --noEmit`, then checks that the theme's
 *      fonts survived into the built output.
 *
 * Commit the result. CI runs the same script and fails if the committed
 * template differs, so a registry change shows up in the PR as the files it
 * changes for consumers. The publisher's tests never invoke the CLI — this is
 * the only check on where files land and how imports resolve (#706 lived in
 * that gap for three months).
 *
 * Usage:
 *   node examples/scripts/smoke.ts [--origin <url>] [--example <name>]
 *
 * With no `--origin` the script builds the registry and serves this checkout
 * with the www dev server (reusing one already running on its port). Pass a
 * Vercel preview or production to regenerate from a deployment instead. Preset
 * encoding always comes from this checkout (`www/scripts/encode-preset.ts`),
 * the same way the create page encodes it in the browser.
 */

import { spawn, spawnSync } from "node:child_process"
import {
  openSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Pinned so a CLI release can't change what a green run means. Bump on purpose.
const SHADCN = "shadcn@4.20.1"
// The www dev server's port (www/vite.config.ts).
const LOCAL_ORIGIN = "http://127.0.0.1:4444"
// What the committed `components.json` points at, whatever origin generated it.
const CANONICAL_ORIGIN = "https://dotui.org"
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

interface FrameworkSetup {
  /**
   * The Tailwind entry stylesheet the app imports. `shadcn init` appends the
   * theme to it, so it is reset to `@import "tailwindcss"` before every run.
   */
  stylesheet: string
  /** Where the production build writes CSS. */
  builtCss: string
  /**
   * Where `shadcn init` wires a `registry:font` item on this framework: the
   * `next/font/google` import in the root layout on Next.js, the `@fontsource`
   * import in the stylesheet elsewhere.
   */
  fontWiring: { file: string; needle: string }
}

const FRAMEWORKS: Record<Framework, FrameworkSetup> = {
  next: {
    stylesheet: "src/app/globals.css",
    builtCss: ".next/static",
    fontWiring: { file: "src/app/layout.tsx", needle: "next/font/google" },
  },
  "tanstack-start": {
    stylesheet: "src/styles.css",
    builtCss: "dist/client",
    fontWiring: { file: "src/styles.css", needle: '@import "@fontsource' },
  },
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
  origin: string | undefined
  examples: string[]
}

function parseArgs(argv: string[]): Options {
  let origin: string | undefined = process.env.SMOKE_ORIGIN
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
  return { origin: origin?.replace(/\/+$/, ""), examples }
}

function run(cwd: string, cmd: string, args: string[]): void {
  console.log(`\n$ ${cmd} ${args.join(" ")}`)
  const result = spawnSync(cmd, args, { cwd, stdio: "inherit" })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args[0] ?? ""} exited with ${result.status}`)
  }
}

/* ------------------------------ local registry ------------------------------ */

async function isServing(origin: string): Promise<boolean> {
  try {
    const res = await fetch(`${origin}/r/registry.json`)
    return res.ok
  } catch {
    return false
  }
}

/**
 * Serve this checkout's registry on the www dev server. Reuses a server that
 * is already answering on the port (a `pnpm dev:www` you left running);
 * otherwise builds the registry, starts vite, and returns a stop function.
 */
async function serveLocalRegistry(): Promise<() => void> {
  if (await isServing(LOCAL_ORIGIN)) {
    console.log(`registry: reusing the dev server at ${LOCAL_ORIGIN}`)
    return () => {}
  }
  run(REPO_DIR, "pnpm", ["build:registry"])
  const log = path.join(os.tmpdir(), "dotui-examples-www.log")
  const fd = openSync(log, "w")
  const child = spawn(
    "pnpm",
    [
      "--filter=www",
      "exec",
      "vite",
      "dev",
      "--port",
      "4444",
      "--host",
      "127.0.0.1",
    ],
    { cwd: REPO_DIR, stdio: ["ignore", fd, fd], detached: true },
  )
  const stop = () => {
    if (child.pid && child.exitCode === null) {
      try {
        process.kill(-child.pid, "SIGTERM")
      } catch {
        // Already gone.
      }
    }
  }
  process.on("exit", stop)
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => {
      stop()
      process.exit(130)
    })
  }
  console.log(`registry: starting the dev server (log: ${log})`)
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await isServing(LOCAL_ORIGIN)) return stop
    if (child.exitCode !== null) break
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
  stop()
  throw new Error(`www dev server did not come up; see ${log}`)
}

/* ---------------------------------- registry -------------------------------- */

/**
 * GET JSON from the registry, retrying transient failures — the dev server
 * can drop a connection while re-optimizing between templates.
 */
async function fetchJson<T>(url: string, attempts = 5): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
      return (await res.json()) as T
    } catch (error) {
      lastError = error
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
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

/** Whether the init item for this preset pulls in `registry:font` items. */
async function initHasFonts(
  origin: string,
  encodedPreset: string,
): Promise<boolean> {
  const item = await fetchJson<{ registryDependencies?: string[] }>(
    `${origin}/r/init?preset=${encodedPreset}`,
  )
  return (item.registryDependencies ?? []).some((dep) => /\/r\/font-/.test(dep))
}

async function registryNames(origin: string): Promise<string[]> {
  const url = `${origin}/r/registry.json`
  const registry = await fetchJson<{ items?: Array<{ name: string }> }>(url)
  const names = (registry.items ?? []).map((item) => item.name)
  if (names.length === 0) throw new Error(`GET ${url} lists no items`)
  return names
}

/* ----------------------------------- checks --------------------------------- */

/** Every `.css` file under `dir`, recursively. */
function cssFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...cssFiles(full))
    else if (entry.name.endsWith(".css")) out.push(full)
  }
  return out
}

/**
 * A build can pass while quietly dropping part of the theme: an `@import url()`
 * the registry appends lands after `@import "tailwindcss"`, which is invalid
 * once Tailwind expands, and bundlers strip it instead of failing. Every URL
 * import in the stylesheet must survive into the built CSS, and a preset that
 * ships fonts must have had them wired the framework's way.
 */
function checkBuiltCss(
  cwd: string,
  framework: FrameworkSetup,
  expectFonts: boolean,
): void {
  const source = readFileSync(path.join(cwd, framework.stylesheet), "utf8")
  const urls = [...source.matchAll(/@import\s+url\(\s*['"]?([^'")]+)/g)].map(
    (m) => m[1]!,
  )
  const built = cssFiles(path.join(cwd, framework.builtCss)).map((file) =>
    readFileSync(file, "utf8"),
  )
  if (built.length === 0) {
    throw new Error(`no built CSS found under ${framework.builtCss}`)
  }
  const dropped = urls.filter((url) => !built.some((css) => css.includes(url)))
  if (dropped.length > 0) {
    throw new Error(
      `built CSS dropped ${dropped.length} @import url() from ${framework.stylesheet}:\n` +
        dropped.map((url) => `  ${url}`).join("\n"),
    )
  }
  if (urls.length > 0) {
    console.log(`@import url() survived the build: ${urls.length}`)
  }

  if (!expectFonts) return
  const { file, needle } = framework.fontWiring
  if (!readFileSync(path.join(cwd, file), "utf8").includes(needle)) {
    throw new Error(`font not wired: ${file} has no ${needle}`)
  }
  if (!built.some((css) => css.includes("@font-face"))) {
    throw new Error("font not wired: built CSS has no @font-face")
  }
  console.log(`fonts wired via ${needle}`)
}

/* -------------------------------- normalizing ------------------------------- */

/**
 * The CLI writes the origin it installed from into `components.json`. The
 * committed file must point at production whatever served this run, or every
 * regeneration against a dev server or preview would show as drift.
 */
function canonicalizeOrigin(cwd: string, origin: string): void {
  if (origin === CANONICAL_ORIGIN) return
  const file = path.join(cwd, "components.json")
  const content = readFileSync(file, "utf8")
  writeFileSync(file, content.replaceAll(origin, CANONICAL_ORIGIN))
}

function dependencyNames(packageJson: string): Set<string> {
  const parsed = JSON.parse(packageJson) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  return new Set([
    ...Object.keys(parsed.dependencies ?? {}),
    ...Object.keys(parsed.devDependencies ?? {}),
  ])
}

/**
 * `pnpm add` (which the CLI runs for each item's npm dependencies) re-resolves
 * ranges to whatever is latest today, so a byte-for-byte `package.json` would
 * drift with every upstream release. Keep the committed file unless the SET of
 * dependencies changed — that is the signal worth seeing in a diff.
 */
function stabilizePackageJson(cwd: string, before: string): void {
  const file = path.join(cwd, "package.json")
  const after = readFileSync(file, "utf8")
  const was = dependencyNames(before)
  const now = dependencyNames(after)
  const added = [...now].filter((name) => !was.has(name))
  const removed = [...was].filter((name) => !now.has(name))
  if (added.length === 0 && removed.length === 0) {
    writeFileSync(file, before)
    return
  }
  console.log(
    `package.json dependencies changed` +
      (added.length ? ` +${added.join(" +")}` : "") +
      (removed.length ? ` -${removed.join(" -")}` : ""),
  )
}

/* ---------------------------------- per template ---------------------------- */

async function regenerate(
  example: string,
  origin: string,
  encodedPreset: string,
  names: string[],
) {
  const { framework: frameworkName } = EXAMPLES[example]!
  const framework = FRAMEWORKS[frameworkName]
  const cwd = path.join(EXAMPLES_DIR, example)
  console.log(`\n=== ${example} ===`)
  const expectFonts = await initHasFonts(origin, encodedPreset)
  const packageJsonBefore = readFileSync(path.join(cwd, "package.json"), "utf8")

  for (const generated of GENERATED) {
    rmSync(path.join(cwd, generated), { recursive: true, force: true })
  }
  writeFileSync(
    path.join(cwd, framework.stylesheet),
    '@import "tailwindcss";\n',
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
  canonicalizeOrigin(cwd, origin)
  stabilizePackageJson(cwd, packageJsonBefore)

  // Build first: it generates what typecheck needs (TanStack's routeTree.gen.ts,
  // Next's next-env.d.ts).
  run(cwd, "pnpm", ["build"])
  run(cwd, "pnpm", ["typecheck"])
  checkBuiltCss(cwd, framework, expectFonts)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  let stopServer = () => {}
  let origin = options.origin
  if (!origin) {
    stopServer = await serveLocalRegistry()
    origin = LOCAL_ORIGIN
  }
  console.log(`registry: ${origin}`)
  const presetIds = [
    ...new Set(options.examples.map((name) => EXAMPLES[name]!.preset)),
  ]
  const encoded = encodePresets(presetIds)
  const names = await registryNames(origin)
  console.log(`items: ${names.length} · presets: ${presetIds.join(", ")}`)

  const failures: string[] = []
  for (const example of options.examples) {
    try {
      await regenerate(
        example,
        origin,
        encoded[EXAMPLES[example]!.preset]!,
        names,
      )
      console.log(`\n✓ ${example}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`\n✗ ${example}: ${message}`)
      failures.push(example)
    }
  }
  stopServer()

  const total = options.examples.length
  console.log(`\n${total - failures.length}/${total} templates regenerated`)
  process.exit(failures.length === 0 ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
