import type { RegistryItem } from '@/registry/types'

const reactAriaTokenFieldMeta = {
  name: 'react-aria-token-field',
  type: 'registry:lib',
  files: [
    {
      path: 'lib/react-aria-token-field/index.ts',
      type: 'registry:lib',
      target: 'lib/react-aria-token-field/index.ts',
    },
    {
      path: 'lib/react-aria-token-field/segment-list.ts',
      type: 'registry:lib',
      target: 'lib/react-aria-token-field/segment-list.ts',
    },
    {
      path: 'lib/react-aria-token-field/state.ts',
      type: 'registry:lib',
      target: 'lib/react-aria-token-field/state.ts',
    },
    {
      path: 'lib/react-aria-token-field/use-token-field.ts',
      type: 'registry:lib',
      target: 'lib/react-aria-token-field/use-token-field.ts',
    },
    {
      path: 'lib/react-aria-token-field/token-field.tsx',
      type: 'registry:lib',
      target: 'lib/react-aria-token-field/token-field.tsx',
    },
  ],
} satisfies RegistryItem

export default reactAriaTokenFieldMeta
