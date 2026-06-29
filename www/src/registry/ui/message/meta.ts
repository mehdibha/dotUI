import type { RegistryItem } from '@/registry/types'

const messageMeta = {
  name: 'message',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/message/base.tsx',
      target: 'ui/message.tsx',
    },
  ],
  registryDependencies: ['avatar'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--message-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default messageMeta
