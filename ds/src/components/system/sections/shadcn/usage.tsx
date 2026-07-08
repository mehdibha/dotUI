import { DerivedColorsExplorer } from '@/components/explorer/derived-colors'
import { SectionNotes } from '@/components/explorer/section-notes'
import { getSystem } from '@/data/index'

import { Block, Section } from '../../primitives'

/** Point-of-use colours extracted from shadcn's per-style component classes. */
export function UsageSection() {
  const derived = getSystem('shadcn-ui').colors?.derivedColors
  if (!derived) return null
  const notes =
    getSystem('shadcn-ui').colors?.notes.filter(
      (note) => note.section === 'usage',
    ) ?? []

  return (
    <Section
      title="Usage"
      kicker="Explore"
      intro="Beyond the declared tokens, shadcn's component styles derive colours at the point of use — token opacity modifiers, color-mix blends, and relative-oklch tints. These are extracted from style-nova, shadcn's default style, so you can see exactly where each derivation is used."
    >
      <Block>
        <DerivedColorsExplorer derived={derived} />
        <SectionNotes notes={notes} />
      </Block>
    </Section>
  )
}
