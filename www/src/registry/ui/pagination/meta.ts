import type { RegistryItem } from '@/registry/types'

const paginationMeta = {
  name: 'pagination',
  type: 'registry:ui',
  group: 'navigation',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/pagination/base.tsx',
      target: 'ui/pagination.tsx',
    },
  ],
  registryDependencies: ['button'],
} satisfies RegistryItem

export default paginationMeta
