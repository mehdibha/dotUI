import { lazy, type ComponentType, type LazyExoticComponent } from "react"

/**
 * Data layer for the `/docs/charts` showcase. Live demo components are globbed
 * straight from the chart families (lazy). The "Show code" modal additionally
 * pulls each variant's raw source on demand (see below).
 */

// Chart demos only. The generated `DemosIndex` covers the whole registry, and
// importing it here put that barrel — every demo's import thunk plus its
// preload map — on the static path of every docs page.
const demoModules = import.meta.glob(
  "../../registry/ui/chart-*/demos/*.tsx",
) as Record<string, () => Promise<{ default: ComponentType<object> }>>

/** Demo key for a glob path: `.../ui/chart-bar/demos/multiple.tsx` → `chart-bar/demos/multiple`. */
const keyOf = (path: string) =>
  path.slice(path.indexOf("/ui/") + 4, -".tsx".length)

const demoComponents = new Map<
  string,
  LazyExoticComponent<ComponentType<object>>
>()
for (const [path, load] of Object.entries(demoModules)) {
  demoComponents.set(keyOf(path), lazy(load))
}

/** Lazy demo component for a demo key, or `undefined` if it doesn't exist. */
export function getDemoComponent(key: string) {
  return demoComponents.get(key)
}

// Raw demo sources, lazily loaded per variant — only the opened variant's
// source is fetched.
const rawDemoSources = import.meta.glob(
  "../../registry/ui/chart-*/demos/*.tsx",
  { query: "?raw", import: "default" },
) as Record<string, () => Promise<string>>

const sourceCache = new Map<string, Promise<string | null>>()

/**
 * A cached promise of a variant's raw source, or `null` if the file is
 * missing. Cached so React's `use()` gets a stable promise across renders.
 */
export function demoSource(demoKey: string): Promise<string | null> {
  let promise = sourceCache.get(demoKey)
  if (!promise) {
    const load = rawDemoSources[`../../registry/ui/${demoKey}.tsx`]
    promise = load ? load() : Promise.resolve(null)
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
  "chart-pie",
  "chart-radar",
  "chart-radial",
])

export interface ChartFamily {
  /** Registry item id, e.g. `chart-bar`. */
  id: string
  /** Family label, e.g. `Bar chart`. */
  name: string
}

export const CHART_FAMILIES = [
  { id: "chart-bar", name: "Bar chart" },
  { id: "chart-line", name: "Line chart" },
  { id: "chart-area", name: "Area chart" },
  { id: "chart-pie", name: "Pie chart" },
  { id: "chart-radar", name: "Radar chart" },
  { id: "chart-radial", name: "Radial chart" },
  { id: "chart-heatmap", name: "Heatmap" },
] as const satisfies readonly ChartFamily[]

/** Variant entries for a family, derived from the demo index (always in sync). */
export function variantsFor(
  familyId: string,
): { key: string; label: string }[] {
  const prefix = `${familyId}/demos/`
  return [...demoComponents.keys()]
    .filter((key) => key.startsWith(prefix))
    .map((key) => ({
      key,
      label: key.slice(prefix.length).replace(/-/g, " "),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
