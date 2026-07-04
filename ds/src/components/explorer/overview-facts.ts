// PLACEHOLDER capability facts not yet captured as structured data. Every field
// is optional so the overview renders only what exists, and the UI flags all of
// these as estimates ("est"). Replace per-slug values with real figures over
// time — one object edit, no UI change. This is the single fake-data surface:
// anything derivable from a system's real data (themes, tokens, ramps, layers,
// contrast pairs) is computed in the component and must never live here.
export interface OverviewFacts {
  /** Number of production components the system ships. */
  componentCount?: number
  /** Size of the first-party icon set. */
  iconCount?: number
  /** Name of the first-party icon set. */
  iconSetName?: string
  /** Omit the field to mean "unknown"; use "system fonts" when that is the real answer. */
  typefaceName?: string
  /** Count of motion/animation tokens (durations + easings). */
  motionTokenCount?: number
}

export const overviewFacts: Record<string, OverviewFacts> = {
  // Linear: closed corporate DS; Inter with tuned features; no public component
  // library and no first-party icon set (both intentionally omitted).
  linear: {
    typefaceName: 'Inter (tuned)',
    motionTokenCount: 6,
  },
  // Radix Colors + Themes: OSS primitives with Radix Icons; ships no own typeface.
  radix: {
    componentCount: 35,
    iconCount: 300,
    iconSetName: 'Radix Icons',
    typefaceName: 'system fonts',
    motionTokenCount: 0,
  },
  // Adobe Spectrum 2: broad component set, large Workflow icon library, Adobe
  // Clean typeface, documented motion tokens.
  'spectrum-2': {
    componentCount: 50,
    iconCount: 959,
    iconSetName: 'Spectrum Workflow',
    typefaceName: 'Adobe Clean',
    motionTokenCount: 8,
  },
}

export function getFacts(slug: string): OverviewFacts {
  return overviewFacts[slug] ?? {}
}
