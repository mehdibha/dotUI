import type { RegistryItem } from '@/registry/types'

const numberFieldMeta = {
  name: 'number-field',
  type: 'registry:ui',
  group: 'inputs',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/number-field/base.tsx',
      target: 'ui/number-field.tsx',
    },
  ],
  registryDependencies: ['input', 'field', 'button', 'group'],
} satisfies RegistryItem

export default numberFieldMeta
