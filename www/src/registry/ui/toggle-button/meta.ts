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
    // base.tsx imports @/lib/context, which has no installable registry item —
    // ship the file with toggle-button until lib items become publishable.
    {
      type: 'registry:lib',
      path: 'lib/context/index.tsx',
      target: 'lib/context.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
} satisfies RegistryItem

export default toggleButtonMeta
