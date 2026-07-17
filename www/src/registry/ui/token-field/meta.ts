import type { RegistryItem } from '@/registry/types'

const tokenFieldMeta = {
  name: 'token-field',
  type: 'registry:ui',
  group: 'inputs',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/token-field/base.tsx',
      target: 'ui/token-field.tsx',
    },
  ],
  registryDependencies: ['field', 'react-aria-token-field'],
} satisfies RegistryItem

export default tokenFieldMeta
