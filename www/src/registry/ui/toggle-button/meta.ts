import type { RegistryItem } from '@/registry/types'

const toggleButtonMeta = {
  name: 'toggle-button',
  type: 'registry:ui',
  group: 'buttons',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/toggle-button/base.tsx',
      target: 'ui/toggle-button.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
} satisfies RegistryItem

export default toggleButtonMeta
