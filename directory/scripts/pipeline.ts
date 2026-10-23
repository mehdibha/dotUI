// Pipeline dispatcher: snapshot | extract | drift <slug>|--all.
// Discovers per-system configs from scripts/systems/*.ts. Each config is a thin
// wrapper over the shared toolkit in scripts/lib/.
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { colorsFileSchema, componentsFileSchema } from "../src/data/schema"
import { evaluateDrift } from "./lib/drift"
import { snapshot, verifySnapshot } from "./lib/snapshot"
import type { SystemConfig } from "./lib/system"

const root = path.resolve(import.meta.dirname, "..")
const systemsConfigDir = path.join(root, "scripts", "systems")
const sourcesRoot = path.join(root, "sources")
const systemsDataRoot = path.join(root, "systems")

async function loadConfigs(): Promise<SystemConfig[]> {
  if (!fs.existsSync(systemsConfigDir)) return []
  const files = fs
    .readdirSync(systemsConfigDir)
    .filter((f) => f.endsWith(".ts"))
    .sort()
  const configs: SystemConfig[] = []
  for (const file of files) {
    const mod = (await import(
      pathToFileURL(path.join(systemsConfigDir, file)).href
    )) as {
      default?: SystemConfig
    }
    if (mod.default) configs.push(mod.default)
  }
  return configs
}

function sourcesDirFor(slug: string): string {
  return path.join(sourcesRoot, slug)
}

function colorsPathFor(slug: string): string {
  return path.join(systemsDataRoot, slug, "colors.json")
}

function componentsPathFor(slug: string): string {
  return path.join(systemsDataRoot, slug, "components.json")
}

// One data axis a config can produce: its extractor, output path, and schema.
// Extraction and drift iterate these so both axes follow identical rules.
function artifactsFor(config: SystemConfig) {
  const artifacts = []
  if (config.extract) {
    artifacts.push({
      label: "colors",
      out: colorsPathFor(config.slug),
      schema: colorsFileSchema,
      run: config.extract,
    })
  }
  if (config.extractComponents) {
    artifacts.push({
      label: "components",
      out: componentsPathFor(config.slug),
      schema: componentsFileSchema,
      run: config.extractComponents,
    })
  }
  if (artifacts.length === 0) {
    throw new Error(
      `config "${config.slug}" declares no extractor (extract / extractComponents)`,
    )
  }
  return artifacts
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}

async function runSnapshot(config: SystemConfig): Promise<void> {
  const dir = sourcesDirFor(config.slug)
  const manifest = await snapshot(config.source, dir)
  console.log(
    `[snapshot] ${config.slug}: ${manifest.files.length} file(s) → ${path.relative(root, dir)}`,
  )
}

async function runExtract(config: SystemConfig): Promise<void> {
  const dir = sourcesDirFor(config.slug)
  if (!fs.existsSync(path.join(dir, "manifest.json"))) {
    throw new Error(
      `no snapshot for "${config.slug}" — run: pnpm snapshot ${config.slug}`,
    )
  }
  const bad = verifySnapshot(dir)
  if (bad.length > 0) {
    throw new Error(
      `snapshot for "${config.slug}" fails manifest verification (hand-edited?): ${bad.join(", ")}`,
    )
  }
  for (const artifact of artifactsFor(config)) {
    // Validate before writing so a broken extractor never lands a bad file.
    const parsed = artifact.schema.parse(artifact.run(dir))
    fs.mkdirSync(path.dirname(artifact.out), { recursive: true })
    fs.writeFileSync(artifact.out, stableJson(parsed))
    console.log(
      `[extract] ${config.slug}: → ${path.relative(root, artifact.out)}`,
    )
  }
}

async function runDrift(config: SystemConfig): Promise<number> {
  const dir = sourcesDirFor(config.slug)
  const bad = verifySnapshot(dir)
  if (bad.length > 0) {
    console.error(
      `[drift] ${config.slug}: snapshot fails manifest verification (hand-edited?): ${bad.join(", ")}`,
    )
    return 1
  }
  let exitCode = 0
  for (const artifact of artifactsFor(config)) {
    if (!fs.existsSync(artifact.out)) {
      console.error(
        `[drift] ${config.slug}: no committed ${artifact.label}.json — run extract first`,
      )
      exitCode = Math.max(exitCode, 1)
      continue
    }
    const committed = artifact.schema.parse(
      JSON.parse(fs.readFileSync(artifact.out, "utf8")),
    )
    const fresh = artifact.schema.parse(artifact.run(dir))
    const result = evaluateDrift(committed, fresh)
    const tag = result.changed ? "✗" : "✓"
    console.log(
      `[drift] ${tag} ${config.slug} (${artifact.label}): ${result.message}`,
    )
    if (result.changed) {
      for (const line of result.diffs.slice(0, 100)) console.log(`    ${line}`)
      if (result.diffs.length > 100) {
        console.log(`    … and ${result.diffs.length - 100} more`)
      }
    }
    exitCode = Math.max(exitCode, result.exitCode)
  }
  return exitCode
}

async function main() {
  const [command, target] = process.argv.slice(2)
  if (
    !command ||
    !["snapshot", "extract", "drift"].includes(command) ||
    !target
  ) {
    console.error(
      "usage: tsx scripts/pipeline.ts snapshot|extract|drift <slug>|--all",
    )
    process.exit(2)
  }

  const configs = await loadConfigs()
  const selected =
    target === "--all" ? configs : configs.filter((c) => c.slug === target)

  if (selected.length === 0) {
    console.error(
      `no config matched "${target}" — known: ${configs.map((c) => c.slug).join(", ") || "(none)"}`,
    )
    process.exit(2)
  }

  let exitCode = 0
  for (const config of selected) {
    if (command === "snapshot") await runSnapshot(config)
    else if (command === "extract") await runExtract(config)
    else if (command === "drift")
      exitCode = Math.max(exitCode, await runDrift(config))
  }
  process.exit(exitCode)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
