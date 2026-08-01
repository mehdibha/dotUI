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
  dependencies: ['@tanstack/charts@0.0.2', 'd3-scale'],
  devDependencies: ['@types/d3-scale'],
  registryDependencies: ['chart'],
} satisfies RegistryItem

export default chartBarMeta
