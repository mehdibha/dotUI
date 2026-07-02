import type { RegistryItem } from '@/registry/types'

const audioPlayerMeta = {
  name: 'audio-player',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/audio-player/base.tsx',
      target: 'ui/audio-player.tsx',
    },
  ],
  registryDependencies: ['button', 'slider'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--audio-player-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default audioPlayerMeta
