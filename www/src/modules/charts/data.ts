import { DemosIndex } from '@/registry/__generated__/demos'

/**
 * Data layer for the standalone `/charts` showcase. Live demo components come
 * from the generated `DemosIndex` (lazy). The showcase displays them only — no
 * source is shown here, so (unlike the docs) we don't pull in raw `?raw` text.
 */

/** Lazy demo component for a demo key, or `undefined` if it doesn't exist. */
export function getDemoComponent(key: string) {
  return DemosIndex[key]?.component
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
  /** One-line description shown under the tab. */
  tagline: string
}

export const CHART_FAMILIES = [
  {
    id: 'chart-bar',
    name: 'Bar',
    tagline: 'Compare values across categories.',
  },
  {
    id: 'chart-line',
    name: 'Line',
    tagline: 'Trends and change over time.',
  },
  {
    id: 'chart-area',
    name: 'Area',
    tagline: 'Magnitude and cumulative totals.',
  },
  {
    id: 'chart-pie',
    name: 'Pie',
    tagline: 'Parts of a whole, at a glance.',
  },
  {
    id: 'chart-radar',
    name: 'Radar',
    tagline: 'Multivariate comparison on shared axes.',
  },
  {
    id: 'chart-radial',
    name: 'Radial',
    tagline: 'Progress and proportion, in the round.',
  },
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
