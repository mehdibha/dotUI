import type { RegistryItem } from '@/registry/types'

const videoPlayerMeta = {
  name: 'video-player',
  type: 'registry:ui',
  group: 'media',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/video-player/base.tsx',
      target: 'ui/video-player.tsx',
    },
  ],
  registryDependencies: ['button', 'slider'],
  dependencies: ['react-aria'],
  params: {
    'controls-style': {
      kind: 'enum',
      default: 'overlay',
      values: ['overlay', 'floating', 'bar'] as const,
      // description: "Placement and surface of the control bar.",
    },
    'accent-color': {
      kind: 'scalar',
      type: 'color',
      cssVar: '--video-player-accent',
      default: '--color-fg',
      // description: "Color of the seek bar fill.",
    },
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--video-player-radius',
      default: '--radius-lg',
      // description: "Corner radius of the player.",
    },
    'seek-size': {
      kind: 'scalar',
      type: 'spacing',
      cssVar: '--video-player-seek-size',
      default: 'calc(var(--spacing) * 1)',
      minValue: 0.5,
      maxValue: 3,
      step: 0.25,
      // description: "Thickness of the seek bar track.",
    },
    'seek-thumb': {
      kind: 'enum',
      default: 'hover',
      values: ['hover', 'always', 'hidden'] as const,
      // description: "When the seek bar thumb is visible.",
    },
  },
} satisfies RegistryItem

export default videoPlayerMeta
