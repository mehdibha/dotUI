import { useTweak } from '@/dev/tweaker'

import { ExportSectionOriginal } from './original'
import { ExportSectionVariant1 } from './variant-1'
import { ExportSectionVariant2 } from './variant-2'
import { ExportSectionVariant3 } from './variant-3'
import { ExportSectionVariant4 } from './variant-4'

const DESIGNS = {
  'Original (#488)': ExportSectionOriginal,
  '1 · Branch tree': ExportSectionVariant1,
  '2 · Branching trunk': ExportSectionVariant2,
  '3 · Ruled table': ExportSectionVariant3,
  '4 · Manifest card': ExportSectionVariant4,
}

export function ExportSection() {
  const design = useTweak('Design', {
    type: 'select',
    options: [
      'Original (#488)',
      '1 · Branch tree',
      '2 · Branching trunk',
      '3 · Ruled table',
      '4 · Manifest card',
    ],
    default: 'Original (#488)',
    group: 'Export section',
  })

  const Design = DESIGNS[design]
  return <Design />
}
