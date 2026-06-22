import type { RegistryItem } from '@/registry/types'

const contextMenuMeta = {
  name: 'context-menu',
  type: 'registry:ui',
  group: 'menus-lists',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/context-menu/base.tsx',
      target: 'ui/context-menu.tsx',
    },
    {
      type: 'registry:ui',
      path: 'ui/context-menu/use-context-menu-trigger.ts',
      target: 'ui/use-context-menu-trigger.ts',
    },
  ],
  dependencies: ['react-aria', 'react-stately'],
  registryDependencies: ['menu', 'popover'],
} satisfies RegistryItem

export default contextMenuMeta
