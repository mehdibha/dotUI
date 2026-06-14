import { DemosIndex } from '@/registry/__generated__/demos'

/**
 * Data layer for the standalone `/charts` showcase. Live demo components come
 * from the generated `DemosIndex` (lazy); their source — for the playground's
 * code view — is pulled in at build time as raw text via Vite's `?raw` glob, so
 * the code shown is always byte-identical to the shipped registry file.
 */

const demoSources = import.meta.glob('/src/registry/ui/chart-*/demos/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** Raw TSX source for a demo key like `chart-bar/demos/multiple`. */
export function getDemoSource(key: string): string {
  return demoSources[`/src/registry/ui/${key}.tsx`] ?? ''
}

/** Lazy demo component for a demo key, or `undefined` if it doesn't exist. */
export function getDemoComponent(key: string) {
  return DemosIndex[key]?.component
}

export interface ChartFamily {
  /** Registry item id, e.g. `chart-bar`. */
  id: string
  /** Display name, e.g. `Bar`. */
  name: string
  /** One-line description shown on the gallery card. */
  tagline: string
  /** Demo key rendered as the gallery hero. */
  hero: string
}

export const CHART_FAMILIES = [
  {
    id: 'chart-bar',
    name: 'Bar',
    tagline: 'Compare values across categories.',
    hero: 'chart-bar/demos/multiple',
  },
  {
    id: 'chart-line',
    name: 'Line',
    tagline: 'Trends and change over time.',
    hero: 'chart-line/demos/multiple',
  },
  {
    id: 'chart-area',
    name: 'Area',
    tagline: 'Magnitude and cumulative totals.',
    hero: 'chart-area/demos/stacked',
  },
  {
    id: 'chart-pie',
    name: 'Pie',
    tagline: 'Parts of a whole, at a glance.',
    hero: 'chart-pie/demos/donut-text',
  },
  {
    id: 'chart-radar',
    name: 'Radar',
    tagline: 'Multivariate comparison on shared axes.',
    hero: 'chart-radar/demos/dots',
  },
  {
    id: 'chart-radial',
    name: 'Radial',
    tagline: 'Progress and proportion, in the round.',
    hero: 'chart-radial/demos/stacked',
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
