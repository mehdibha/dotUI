import { SystemOverview } from '@/components/explorer/system-overview'
import type { CatalogEntry, SystemWithColors } from '@/data/schema'

import { Section } from '../primitives'

export function OverviewSection({
  system,
  catalogEntry,
}: {
  system: SystemWithColors
  catalogEntry?: CatalogEntry
}) {
  return (
    <Section
      title="Overview"
      kicker="Spectrum 2"
      intro="Adobe's cross-product design language, rebuilt. Everything below is measured from the source of truth — the open spectrum-design-data token repository and the React Spectrum S2 implementation — then made explorable: real ramps, real scales, live playgrounds."
    >
      <SystemOverview system={system} catalogEntry={catalogEntry} />
    </Section>
  )
}
