import type { RegistryItem } from '@/registry/types'

const conversationMeta = {
  name: 'conversation',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/conversation/base.tsx',
      target: 'ui/conversation.tsx',
    },
  ],
  registryDependencies: ['button'],
} satisfies RegistryItem

export default conversationMeta
