import type { RegistryItem } from '@/registry/types'

const focusStylesMeta = {
  name: 'focus-styles',
  type: 'registry:lib',
  files: [
    {
      path: 'lib/focus-styles/basic.ts',
      type: 'registry:lib',
      target: 'lib/focus-styles.ts',
    },
  ],
} satisfies RegistryItem

export default focusStylesMeta
