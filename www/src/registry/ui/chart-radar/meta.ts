import type { RegistryItem } from '@/registry/types'

const chartRadarMeta = {
  name: 'chart-radar',
  type: 'registry:ui',
  group: 'charts',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/chart-radar/base.tsx',
      target: 'ui/chart-radar.tsx',
    },
  ],
  dependencies: ['recharts'],
  registryDependencies: ['chart', 'card'],
} satisfies RegistryItem

export default chartRadarMeta
