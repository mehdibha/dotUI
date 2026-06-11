import type { RegistryItem } from '@/registry/types'

const tableMeta = {
  name: 'table',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/table/base.tsx',
      target: 'ui/table.tsx',
    },
  ],
  registryDependencies: ['checkbox', 'focus-styles', 'loader'],
} satisfies RegistryItem

export default tableMeta
