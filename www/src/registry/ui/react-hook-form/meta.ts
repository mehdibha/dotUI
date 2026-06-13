import type { RegistryItem } from '@/registry/types'

const reactHookFormMeta = {
  name: 'react-hook-form',
  type: 'registry:ui',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/react-hook-form/base.tsx',
      target: 'ui/react-hook-form.tsx',
    },
  ],
  dependencies: ['react-hook-form'],
} satisfies RegistryItem

export default reactHookFormMeta
