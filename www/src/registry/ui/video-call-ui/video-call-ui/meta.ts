import type { RegistryItem } from '@/registry/types'

const videoCallUiMeta = {
  name: 'video-call-ui',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/video-call-ui/base.tsx',
      target: 'ui/video-call-ui.tsx',
    },
  ],
  registryDependencies: ['avatar', 'button', 'focus-styles'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--video-call-ui-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default videoCallUiMeta
