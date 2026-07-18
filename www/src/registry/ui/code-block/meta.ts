import type { RegistryItem } from '@/registry/types'

const codeBlockMeta = {
  name: 'code-block',
  type: 'registry:ui',
  group: 'containers',
  dependencies: ['shiki'],
  files: [
    {
      type: 'registry:ui',
      path: 'ui/code-block/base.tsx',
      target: 'ui/code-block.tsx',
    },
    // base.tsx imports @/registry/lib/highlight, which has no installable
    // registry item — ship the file with code-block until lib items become
    // publishable.
    {
      type: 'registry:lib',
      path: 'lib/highlight/index.ts',
      target: 'lib/highlight.ts',
    },
  ],
  registryDependencies: ['button'],
  params: {
    style: {
      kind: 'enum',
      default: 'default',
      values: ['default', 'monastir'] as const,
    },
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--code-block-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default codeBlockMeta
