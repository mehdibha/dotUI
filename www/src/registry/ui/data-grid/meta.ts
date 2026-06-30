import type { RegistryItem } from '@/registry/types'

const dataGridMeta = {
  name: 'data-grid',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/data-grid/base.tsx',
      target: 'ui/data-grid.tsx',
    },
  ],
  registryDependencies: ['table', 'button', 'focus-styles'],
  dependencies: ['@tanstack/react-table'],
} satisfies RegistryItem

export default dataGridMeta
