import type { RegistryItem } from '@/registry/types'

const ganttMeta = {
  name: 'gantt',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/gantt/base.tsx',
      target: 'ui/gantt.tsx',
    },
  ],
  dependencies: ['date-fns'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--gantt-radius',
      default: '--radius-sm',
    },
  },
} satisfies RegistryItem

export default ganttMeta
