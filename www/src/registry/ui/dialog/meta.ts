import type { RegistryItem } from '@/registry/types'

const dialogMeta = {
  name: 'dialog',
  type: 'registry:ui',
  group: 'overlays',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/dialog/base.tsx',
      target: 'ui/dialog.tsx',
    },
  ],
  registryDependencies: ['overlay', 'button', 'scroll-fade'],
} satisfies RegistryItem

export default dialogMeta
