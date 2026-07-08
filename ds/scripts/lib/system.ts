// The contract every per-system pipeline config implements. Configs stay thin:
// a snapshot source (what to vendor) and an extract() that parses ONLY the
// committed snapshot into a ColorsFile.
import type { ColorsFile } from '../../src/data/schema'
import type { SnapshotSource } from './snapshot'

export interface SystemConfig {
  slug: string
  source: SnapshotSource
  /** Parse the vendored snapshot at `sourcesDir` into a colors file. Pure and
      deterministic — no network, no timestamps. */
  extract: (sourcesDir: string) => ColorsFile
}
