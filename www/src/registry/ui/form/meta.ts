import type { RegistryItem } from '@/registry/types'

const formMeta = {
  name: 'form',
  type: 'registry:ui',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/form/base.tsx',
      target: 'ui/form.tsx',
    },
  ],
} satisfies RegistryItem

export default formMeta
