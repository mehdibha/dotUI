import type { RegistryItem } from '@/registry/types'

const responsiveMeta = {
  name: 'responsive',
  type: 'registry:lib',
  files: [
    {
      path: 'lib/responsive/index.tsx',
      type: 'registry:lib',
      target: 'lib/responsive.tsx',
    },
  ],
  registryDependencies: ['use-mobile'],
} satisfies RegistryItem

export default responsiveMeta
