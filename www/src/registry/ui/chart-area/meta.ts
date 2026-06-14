import type { RegistryItem } from '@/registry/types'

const chartAreaMeta = {
  name: 'chart-area',
  type: 'registry:ui',
  group: 'charts',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/chart-area/base.tsx',
      target: 'ui/chart-area.tsx',
    },
  ],
  dependencies: ['recharts'],
  registryDependencies: ['chart', 'card'],
} satisfies RegistryItem

export default chartAreaMeta
