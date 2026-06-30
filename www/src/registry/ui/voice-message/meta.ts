import type { RegistryItem } from '@/registry/types'

const voiceMessageMeta = {
  name: 'voice-message',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/voice-message/base.tsx',
      target: 'ui/voice-message.tsx',
    },
  ],
  registryDependencies: ['button'],
  dependencies: ['wavesurfer.js'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--voice-message-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default voiceMessageMeta
