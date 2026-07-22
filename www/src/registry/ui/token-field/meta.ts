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
    // base.tsx imports @/lib/react-aria-token-field, which has no installable
    // registry item — ship its files until lib items become publishable.
    {
      type: 'registry:lib',
      path: 'lib/react-aria-token-field/index.ts',
      target: 'lib/react-aria-token-field/index.ts',
    },
    {
      type: 'registry:lib',
      path: 'lib/react-aria-token-field/segment-list.ts',
      target: 'lib/react-aria-token-field/segment-list.ts',
    },
    {
      type: 'registry:lib',
      path: 'lib/react-aria-token-field/state.ts',
      target: 'lib/react-aria-token-field/state.ts',
    },
    {
      type: 'registry:lib',
      path: 'lib/react-aria-token-field/use-token-field.ts',
      target: 'lib/react-aria-token-field/use-token-field.ts',
    },
    {
      type: 'registry:lib',
      path: 'lib/react-aria-token-field/token-field.tsx',
      target: 'lib/react-aria-token-field/token-field.tsx',
    },
  ],
  registryDependencies: ['field'],
} satisfies RegistryItem

export default tokenFieldMeta
