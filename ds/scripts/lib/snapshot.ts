// Snapshot: fetch a system's raw source into ds/sources/<slug>/ and write a
// manifest that pins exactly what was captured. Two source kinds:
//   - repo: files at a pinned git SHA via raw.githubusercontent.com. `ref`
//     pins the bytes, so `retrievedAt` is only informational.
//   - live-site: a deployed stylesheet, stamped with `retrievedAt` (the ref is
//     the run date). Seam left for future systems; only `repo` is exercised now.
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export interface RepoSource {
  kind: 'repo'
  /** GitHub repo URL, e.g. https://github.com/shadcn-ui/ui. */
  repo: string
  /** Pinned commit SHA. */
  ref: string
  /** Upstream path → local basename under sources/<slug>/. */
  files: { upstreamPath: string; as: string }[]
}

export interface LiveSiteSource {
  kind: 'live-site'
  /** Site the stylesheets belong to, e.g. https://linear.app. */
  site: string
  /** Stylesheet URL → local basename under sources/<slug>/. */
  files: { url: string; as: string }[]
}

export type SnapshotSource = RepoSource | LiveSiteSource

export interface ManifestFile {
  path: string
  upstreamPath: string | null
  url: string
  sha256: string
}

export interface Manifest {
  kind: SnapshotSource['kind']
  repo: string | null
  ref: string | null
  retrievedAt: string
  files: ManifestFile[]
}

function sha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex')
}

/** ISO day (UTC) — the manifest and provenance both stamp days, never times. */
export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

function rawUrl(repo: string, ref: string, upstreamPath: string): string {
  const slug = repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
  return `https://raw.githubusercontent.com/${slug}/${ref}/${upstreamPath}`
}

/** Fetch every file, write it under sources/<slug>/, and emit manifest.json. */
export async function snapshot(
  source: SnapshotSource,
  sourcesDir: string,
): Promise<Manifest> {
  fs.mkdirSync(sourcesDir, { recursive: true })

  const files: ManifestFile[] = []
  if (source.kind === 'repo') {
    for (const file of source.files) {
      const url = rawUrl(source.repo, source.ref, file.upstreamPath)
      const buffer = await fetchBuffer(url)
      fs.writeFileSync(path.join(sourcesDir, file.as), buffer)
      files.push({
        path: file.as,
        upstreamPath: file.upstreamPath,
        url,
        sha256: sha256(buffer),
      })
    }
  } else {
    for (const file of source.files) {
      const buffer = await fetchBuffer(file.url)
      fs.writeFileSync(path.join(sourcesDir, file.as), buffer)
      files.push({
        path: file.as,
        upstreamPath: null,
        url: file.url,
        sha256: sha256(buffer),
      })
    }
  }

  files.sort((a, b) => a.path.localeCompare(b.path))

  const manifest: Manifest = {
    kind: source.kind,
    repo: source.kind === 'repo' ? source.repo : source.site,
    ref: source.kind === 'repo' ? source.ref : null,
    retrievedAt: today(),
    files,
  }
  fs.writeFileSync(
    path.join(sourcesDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
  return manifest
}

export function readManifest(sourcesDir: string): Manifest {
  return JSON.parse(
    fs.readFileSync(path.join(sourcesDir, 'manifest.json'), 'utf8'),
  ) as Manifest
}

/** Check every vendored file still hashes to its manifest entry — catches
    hand-edits of snapshots. Returns the mismatching paths (empty = clean). */
export function verifySnapshot(sourcesDir: string): string[] {
  const manifest = readManifest(sourcesDir)
  const bad: string[] = []
  for (const file of manifest.files) {
    const full = path.join(sourcesDir, file.path)
    if (!fs.existsSync(full)) {
      bad.push(`${file.path} (missing)`)
      continue
    }
    if (sha256(fs.readFileSync(full)) !== file.sha256) bad.push(file.path)
  }
  return bad
}

export { sha256 }
