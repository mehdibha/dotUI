import type { RegistryItem } from '@/registry/types'

const attachmentMeta = {
  name: 'attachment',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/attachment/base.tsx',
      target: 'ui/attachment.tsx',
    },
  ],
  registryDependencies: ['button'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--attachment-radius',
      default: '--radius-md',
    },
  },
} satisfies RegistryItem

export default attachmentMeta
