import type { RegistryItem } from '@/registry/types'

const stepperMeta = {
  name: 'stepper',
  type: 'registry:ui',
  group: 'navigation',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/stepper/base.tsx',
      target: 'ui/stepper.tsx',
    },
  ],
  params: {
    'indicator-size': {
      kind: 'scalar',
      type: 'spacing',
      cssVar: '--stepper-indicator-size',
      default: 'calc(var(--spacing) * 8)',
      minValue: 6,
      maxValue: 12,
      step: 0.5,
    },
  },
} satisfies RegistryItem

export default stepperMeta
