import type { RegistryItem } from '@/registry/types'

const chartBarMeta = {
  name: 'chart-bar',
  type: 'registry:ui',
  group: 'charts',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/chart-bar/base.tsx',
      target: 'ui/chart-bar.tsx',
    },
  ],
  dependencies: ['recharts'],
  registryDependencies: ['chart', 'card'],
} satisfies RegistryItem

export default chartBarMeta
