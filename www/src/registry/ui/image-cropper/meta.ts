import type { RegistryItem } from '@/registry/types'

const imageCropperMeta = {
  name: 'image-cropper',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/image-cropper/base.tsx',
      target: 'ui/image-cropper.tsx',
    },
  ],
  registryDependencies: ['button', 'slider'],
  dependencies: ['react-easy-crop'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--image-cropper-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default imageCropperMeta
