import type { RegistryItem } from '@/registry/types'

const toastMeta = {
  name: 'toast',
  type: 'registry:ui',
  group: 'feedback',
  dependencies: ['@base-ui/react'],
  files: [
    {
      type: 'registry:ui',
      path: 'ui/toast/base.tsx',
      target: 'ui/toast.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
} satisfies RegistryItem

export default toastMeta
