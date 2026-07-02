import type { RegistryItem } from '@/registry/types'

const notificationFeedMeta = {
  name: 'notification-feed',
  type: 'registry:ui',
  group: 'feedback',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/notification-feed/base.tsx',
      target: 'ui/notification-feed.tsx',
    },
  ],
  registryDependencies: ['avatar', 'button'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--notification-feed-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default notificationFeedMeta
