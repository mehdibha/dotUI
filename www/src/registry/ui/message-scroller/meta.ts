import type { RegistryItem } from '@/registry/types'

const messageScrollerMeta = {
  name: 'message-scroller',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/message-scroller/base.tsx',
      target: 'ui/message-scroller.tsx',
    },
  ],
  registryDependencies: ['button'],
} satisfies RegistryItem

export default messageScrollerMeta
