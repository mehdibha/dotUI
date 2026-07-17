import type { RegistryItem } from '@/registry/types'

const tokenFieldMeta = {
  name: 'token-field',
  type: 'registry:lib',
  files: [
    {
      path: 'lib/token-field/index.ts',
      type: 'registry:lib',
      target: 'lib/token-field/index.ts',
    },
    {
      path: 'lib/token-field/segment-list.ts',
      type: 'registry:lib',
      target: 'lib/token-field/segment-list.ts',
    },
    {
      path: 'lib/token-field/state.ts',
      type: 'registry:lib',
      target: 'lib/token-field/state.ts',
    },
    {
      path: 'lib/token-field/use-token-field.ts',
      type: 'registry:lib',
      target: 'lib/token-field/use-token-field.ts',
    },
    {
      path: 'lib/token-field/token-field.tsx',
      type: 'registry:lib',
      target: 'lib/token-field/token-field.tsx',
    },
  ],
} satisfies RegistryItem

export default tokenFieldMeta
