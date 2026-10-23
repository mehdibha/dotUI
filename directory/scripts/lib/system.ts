// The contract every per-system pipeline config implements. Configs stay thin:
// a snapshot source (what to vendor) and extractors that parse ONLY the
// committed snapshot into data files. A config provides at least one extractor;
// each data axis is independent (components can exist without colors).
import type { ColorsFile, ComponentsFile } from "../../src/data/schema"
import type { SnapshotSource } from "./snapshot"

export interface SystemConfig {
  slug: string
  source: SnapshotSource
  /** Parse the vendored snapshot at `sourcesDir` into a colors file. Pure and
      deterministic — no network, no timestamps. */
  extract?: (sourcesDir: string) => ColorsFile
  /** Parse the vendored snapshot at `sourcesDir` into a components file. Same
      rules: pure, deterministic, offline. */
  extractComponents?: (sourcesDir: string) => ComponentsFile
}
