import type { RegistryItem } from '@/registry/types'

const textFieldMeta = {
  name: 'text-field',
  type: 'registry:ui',
  group: 'inputs',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/text-field/base.tsx',
      target: 'ui/text-field.tsx',
    },
  ],
  registryDependencies: ['field', 'input'],
} satisfies RegistryItem

export default textFieldMeta
