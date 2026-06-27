import type { RegistryItem } from '@/registry/types'

const chartPieMeta = {
  name: 'chart-pie',
  type: 'registry:ui',
  group: 'charts',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/chart-pie/base.tsx',
      target: 'ui/chart-pie.tsx',
    },
  ],
  dependencies: ['recharts'],
  registryDependencies: ['chart', 'card'],
} satisfies RegistryItem

export default chartPieMeta
