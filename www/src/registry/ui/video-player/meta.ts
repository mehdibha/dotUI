import type { RegistryItem } from '@/registry/types'

const videoPlayerMeta = {
  name: 'video-player',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/video-player/base.tsx',
      target: 'ui/video-player.tsx',
    },
  ],
  registryDependencies: ['button', 'slider'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--video-player-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default videoPlayerMeta
