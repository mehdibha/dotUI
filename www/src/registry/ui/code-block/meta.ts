import type { RegistryItem } from '@/registry/types'

const codeBlockMeta = {
  name: 'code-block',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/code-block/base.tsx',
      target: 'ui/code-block.tsx',
    },
  ],
  registryDependencies: ['button'],
  dependencies: ['shiki'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--code-block-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default codeBlockMeta
