import type { RegistryItem } from '@/registry/types'

const fileUploadMeta = {
  name: 'file-upload',
  type: 'registry:ui',
  group: 'drop-zone',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/file-upload/base.tsx',
      target: 'ui/file-upload.tsx',
    },
  ],
  registryDependencies: ['drop-zone', 'file-trigger', 'progress-bar', 'button'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--file-upload-radius',
      default: '--radius-md',
    },
  },
} satisfies RegistryItem

export default fileUploadMeta
