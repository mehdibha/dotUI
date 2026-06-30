import type { RegistryItem } from '@/registry/types'

const commentThreadMeta = {
  name: 'comment-thread',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/comment-thread/base.tsx',
      target: 'ui/comment-thread.tsx',
    },
  ],
  registryDependencies: ['avatar', 'button'],
} satisfies RegistryItem

export default commentThreadMeta
