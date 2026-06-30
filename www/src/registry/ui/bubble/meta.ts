import type { RegistryItem } from '@/registry/types'

const bubbleMeta = {
  name: 'bubble',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/bubble/base.tsx',
      target: 'ui/bubble.tsx',
    },
  ],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--bubble-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default bubbleMeta
