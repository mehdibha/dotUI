import type { RegistryItem } from '@/registry/types'

const sidebarMeta = {
  name: 'sidebar',
  type: 'registry:ui',
  group: 'navigation',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/sidebar/base.tsx',
      target: 'ui/sidebar.tsx',
    },
    // base.tsx imports @/hooks/use-mobile and @/lib/context, which have no
    // installable registry items — ship the files until they become publishable.
    {
      type: 'registry:hook',
      path: 'hooks/use-mobile.ts',
      target: 'hooks/use-mobile.ts',
    },
    {
      type: 'registry:lib',
      path: 'lib/context/index.tsx',
      target: 'lib/context.tsx',
    },
  ],
  registryDependencies: [
    'button',
    'drawer',
    'separator',
    'skeleton',
    'tooltip',
  ],
} satisfies RegistryItem

export default sidebarMeta
