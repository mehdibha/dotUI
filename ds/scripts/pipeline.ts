// Pipeline dispatcher: snapshot | extract | drift <slug>|--all.
// Discovers per-system configs from scripts/systems/*.ts. Each config is a thin
// wrapper over the shared toolkit in scripts/lib/.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { colorsFileSchema } from '../src/data/schema'
import { evaluateDrift } from './lib/drift'
import { snapshot, verifySnapshot } from './lib/snapshot'
import type { SystemConfig } from './lib/system'

const root = path.resolve(import.meta.dirname, '..')
const systemsConfigDir = path.join(root, 'scripts', 'systems')
const sourcesRoot = path.join(root, 'sources')
const systemsDataRoot = path.join(root, 'systems')

async function loadConfigs(): Promise<SystemConfig[]> {
  if (!fs.existsSync(systemsConfigDir)) return []
  const files = fs
    .readdirSync(systemsConfigDir)
    .filter((f) => f.endsWith('.ts'))
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
  return path.join(systemsDataRoot, slug, 'colors.json')
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
  if (!fs.existsSync(path.join(dir, 'manifest.json'))) {
    throw new Error(
      `no snapshot for "${config.slug}" — run: pnpm snapshot ${config.slug}`,
    )
  }
  const bad = verifySnapshot(dir)
  if (bad.length > 0) {
    throw new Error(
      `snapshot for "${config.slug}" fails manifest verification (hand-edited?): ${bad.join(', ')}`,
    )
  }
  const colors = config.extract(dir)
  // Validate before writing so a broken extractor never lands a bad file.
  const parsed = colorsFileSchema.parse(colors)
  const out = colorsPathFor(config.slug)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, stableJson(parsed))
  console.log(`[extract] ${config.slug}: → ${path.relative(root, out)}`)
}

async function runDrift(config: SystemConfig): Promise<number> {
  const out = colorsPathFor(config.slug)
  if (!fs.existsSync(out)) {
    console.error(
      `[drift] ${config.slug}: no committed colors.json — run extract first`,
    )
    return 1
  }
  const committed = colorsFileSchema.parse(
    JSON.parse(fs.readFileSync(out, 'utf8')),
  )
  const dir = sourcesDirFor(config.slug)
  const fresh = colorsFileSchema.parse(config.extract(dir))
  const result = evaluateDrift(committed, fresh)
  const tag = result.changed ? '✗' : '✓'
  console.log(`[drift] ${tag} ${config.slug}: ${result.message}`)
  if (result.changed) {
    for (const line of result.diffs.slice(0, 100)) console.log(`    ${line}`)
    if (result.diffs.length > 100) {
      console.log(`    … and ${result.diffs.length - 100} more`)
    }
  }
  return result.exitCode
}

async function main() {
  const [command, target] = process.argv.slice(2)
  if (!command || !['snapshot', 'extract', 'drift'].includes(command)) {
    console.error(
      'usage: tsx scripts/pipeline.ts snapshot|extract|drift <slug>|--all',
    )
    process.exit(2)
  }

  const configs = await loadConfigs()
  const selected =
    target === '--all' || !target
      ? configs
      : configs.filter((c) => c.slug === target)

  if (selected.length === 0) {
    console.error(
      `no config matched "${target ?? '(none)'}" — known: ${configs.map((c) => c.slug).join(', ') || '(none)'}`,
    )
    process.exit(2)
  }

  let exitCode = 0
  for (const config of selected) {
    if (command === 'snapshot') await runSnapshot(config)
    else if (command === 'extract') await runExtract(config)
    else if (command === 'drift')
      exitCode = Math.max(exitCode, await runDrift(config))
  }
  process.exit(exitCode)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
