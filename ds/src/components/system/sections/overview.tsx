import { SystemOverview } from '@/components/explorer/system-overview'
import type { RosterEntry, SystemWithColors } from '@/data/schema'

import { Section } from '../primitives'

export function OverviewSection({
  system,
  rosterEntry,
}: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  return (
    <Section
      title="Overview"
      kicker="Spectrum 2"
      intro="Adobe's cross-product design language, rebuilt. Everything below is measured from the source of truth — the open spectrum-design-data token repository and the React Spectrum S2 implementation — then made explorable: real ramps, real scales, live playgrounds."
    >
      <SystemOverview system={system} rosterEntry={rosterEntry} />
    </Section>
  )
}
