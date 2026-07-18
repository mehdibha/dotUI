import type { RegistryItem } from '@/registry/types'

const gridListMeta = {
  name: 'grid-list',
  type: 'registry:ui',
  group: 'menus-lists',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/grid-list/base.tsx',
      target: 'ui/grid-list.tsx',
    },
  ],
  registryDependencies: ['checkbox', 'text', 'loader'],
  dependencies: ['react-aria-components'],
  params: {
    highlight: {
      kind: 'enum',
      default: 'subtle',
      values: ['subtle', 'accent'] as const,
      description: 'How focused/active items are highlighted.',
    },
  },
} satisfies RegistryItem

export default gridListMeta
