import type { RegistryItem } from '@/registry/types'

const sortableListMeta = {
  name: 'sortable-list',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/sortable-list/base.tsx',
      target: 'ui/sortable-list.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
  dependencies: [
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/modifiers',
    '@dnd-kit/utilities',
  ],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--sortable-list-radius',
      default: '--radius-md',
    },
  },
} satisfies RegistryItem

export default sortableListMeta
