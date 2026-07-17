import type { RegistryItem } from '@/registry/types'

const mentionMeta = {
  name: 'mention',
  type: 'registry:ui',
  group: 'pickers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/mention/base.tsx',
      target: 'ui/mention.tsx',
    },
  ],
  registryDependencies: [
    'menu',
    'popover',
    'react-aria-token-field',
    'token-field',
  ],
} satisfies RegistryItem

export default mentionMeta
