import type { RegistryItem } from '@/registry/types'

const segmentedControlMeta = {
  name: 'segmented-control',
  type: 'registry:ui',
  group: 'buttons',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/segmented-control/base.tsx',
      target: 'ui/segmented-control.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
} satisfies RegistryItem

export default segmentedControlMeta
