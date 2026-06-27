import type { RegistryItem } from '@/registry/types'

const chartLineMeta = {
  name: 'chart-line',
  type: 'registry:ui',
  group: 'charts',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/chart-line/base.tsx',
      target: 'ui/chart-line.tsx',
    },
  ],
  dependencies: ['recharts'],
  registryDependencies: ['chart', 'card'],
} satisfies RegistryItem

export default chartLineMeta
