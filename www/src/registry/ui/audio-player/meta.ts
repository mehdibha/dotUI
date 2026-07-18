import type { RegistryItem } from '@/registry/types'

const audioPlayerMeta = {
  name: 'audio-player',
  type: 'registry:ui',
  group: 'media',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/audio-player/base.tsx',
      target: 'ui/audio-player.tsx',
    },
  ],
  registryDependencies: ['button', 'slider'],
  params: {
    style: {
      kind: 'enum',
      default: 'plain',
      values: ['plain', 'soft', 'card'] as const,
      description: 'How the player surface is rendered.',
    },
    'seek-thumb': {
      kind: 'enum',
      default: 'visible',
      values: ['visible', 'on-hover', 'hidden'] as const,
      description: 'When the seek slider thumb is shown.',
    },
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--audio-player-radius',
      default: '--radius-lg',
    },
    shadow: {
      kind: 'scalar',
      type: 'shadow',
      cssVar: '--audio-player-shadow',
      default: 'none',
    },
  },
} satisfies RegistryItem

export default audioPlayerMeta
