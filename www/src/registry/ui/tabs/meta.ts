import type { RegistryItem } from '@/registry/types'

const tabsMeta = {
  name: 'tabs',
  type: 'registry:ui',
  group: 'navigation',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/tabs/base.tsx',
      target: 'ui/tabs.tsx',
    },
    // base.tsx imports @/lib/context, which has no installable registry item —
    // ship the file with tabs until lib items become publishable.
    {
      type: 'registry:lib',
      path: 'lib/context/index.tsx',
      target: 'lib/context.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
} satisfies RegistryItem

export default tabsMeta
