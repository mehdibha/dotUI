import { DemosIndex } from '@/registry/__generated__/demos'

/**
 * Data layer for the standalone `/charts` showcase. Live demo components come
 * from the generated `DemosIndex` (lazy). The "Show code" modal additionally
 * pulls each variant's raw source on demand (see below).
 */

/** Lazy demo component for a demo key, or `undefined` if it doesn't exist. */
export function getDemoComponent(key: string) {
  return DemosIndex[key]?.component
}

/** Package managers offered in the install section, in display order. */
export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

/** Family id from a demo key: `chart-bar/demos/multiple` → `chart-bar`. */
export function familyOf(demoKey: string): string {
  return demoKey.slice(0, demoKey.indexOf('/'))
}

/**
 * The registry items to install for a variant: its family, plus any other
 * registry UI components the variant's source imports (e.g. the interactive
 * area chart pulls in `select`). The chart primitive and sibling chart families
 * are skipped — installing the family item already brings the primitive along.
 */
export function installItems(demoKey: string, source: string | null): string[] {
  const family = familyOf(demoKey)
  if (!source) return [family]
  const extras = new Set<string>()
  for (const match of source.matchAll(/@\/components\/ui\/([a-z0-9-]+)/g)) {
    const name = match[1]
    // Skip the chart primitive and sibling chart families — installing the
    // family item already pulls those in.
    if (name && name !== 'chart' && !name.startsWith('chart-')) {
      extras.add(name)
    }
  }
  return [family, ...[...extras].sort()]
}

/** The shadcn install command per package manager for a set of registry items. */
export function installCommands(
  items: string[],
): Record<PackageManager, string> {
  const arg = `shadcn@latest add ${items.map((i) => `@dotui/${i}`).join(' ')}`
  return {
    npm: `npx ${arg}`,
    pnpm: `pnpm dlx ${arg}`,
    yarn: `yarn dlx ${arg}`,
    bun: `bunx ${arg}`,
  }
}

// Raw demo sources, lazily loaded per variant — only the opened variant's
// source is fetched. Keyed by file path; matched to a demo key by suffix.
const rawDemoSources = import.meta.glob(
  '../../registry/ui/chart-*/demos/*.tsx',
  { query: '?raw', import: 'default' },
) as Record<string, () => Promise<string>>

/**
 * Rewrite a demo's source the way the docs display it: registry imports become
 * the installed `@/*` paths, the default export is unwrapped, and tabs become
 * spaces. (Mirrors the docs transformer's full-source output; the ts-morph
 * preview pass it also runs is build-only and unneeded here.)
 */
function toDisplaySource(raw: string): string {
  return raw
    .replace(/@\/registry\/ui\//g, '@/ui/')
    .replace(/@\/registry\//g, '@/')
    .replace('export default function', 'export function')
    .replace(/\t/g, '  ')
    .trim()
}

const sourceCache = new Map<string, Promise<string | null>>()

/**
 * A cached promise of a variant's display source, or `null` if the file is
 * missing. Cached so React's `use()` gets a stable promise across renders.
 */
export function demoSource(demoKey: string): Promise<string | null> {
  let promise = sourceCache.get(demoKey)
  if (!promise) {
    const suffix = `${demoKey}.tsx`
    const entry = Object.entries(rawDemoSources).find(([p]) =>
      p.endsWith(suffix),
    )
    promise = entry ? entry[1]().then(toDisplaySource) : Promise.resolve(null)
    sourceCache.set(demoKey, promise)
  }
  return promise
}

/**
 * Polar families render in a square box; cartesian families fill the card width.
 * Forcing a cartesian aspect on a polar chart squashes the pie/radar, so each
 * card branches its sizing on this set.
 */
export const POLAR_FAMILIES = new Set([
  'chart-pie',
  'chart-radar',
  'chart-radial',
])

export interface ChartFamily {
  /** Registry item id, e.g. `chart-bar`. */
  id: string
  /** Tab label noun, e.g. `Bar`. */
  name: string
}

export const CHART_FAMILIES = [
  { id: 'chart-bar', name: 'Bar' },
  { id: 'chart-line', name: 'Line' },
  { id: 'chart-area', name: 'Area' },
  { id: 'chart-pie', name: 'Pie' },
  { id: 'chart-radar', name: 'Radar' },
  { id: 'chart-radial', name: 'Radial' },
] as const satisfies readonly ChartFamily[]

/** Variant entries for a family, derived from the demo index (always in sync). */
export function variantsFor(
  familyId: string,
): { key: string; label: string }[] {
  const prefix = `${familyId}/demos/`
  return Object.keys(DemosIndex)
    .filter((key) => key.startsWith(prefix))
    .map((key) => ({
      key,
      label: key.slice(prefix.length).replace(/-/g, ' '),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/** Total number of shipped chart variants across every family. */
export function totalVariantCount(): number {
  return CHART_FAMILIES.reduce((sum, f) => sum + variantsFor(f.id).length, 0)
}
