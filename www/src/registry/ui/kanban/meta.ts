import type { RegistryItem } from '@/registry/types'

const kanbanMeta = {
  name: 'kanban',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/kanban/base.tsx',
      target: 'ui/kanban.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
  dependencies: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--kanban-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default kanbanMeta
