import type { RegistryItem } from '@/registry/types'

const chartMeta = {
  name: 'chart',
  type: 'registry:ui',
  group: 'charts',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/chart/base.tsx',
      target: 'ui/chart.tsx',
    },
  ],
  dependencies: ['recharts'],
} satisfies RegistryItem

export default chartMeta
