import type { RegistryItem } from '@/registry/types'

const linkMeta = {
  name: 'link',
  type: 'registry:ui',
  group: 'buttons',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/link/base.tsx',
      target: 'ui/link.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
} satisfies RegistryItem

export default linkMeta
