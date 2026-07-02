import type { RegistryItem } from '@/registry/types'

const lightboxMeta = {
  name: 'lightbox',
  type: 'registry:ui',
  group: 'overlays',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/lightbox/base.tsx',
      target: 'ui/lightbox.tsx',
    },
  ],
  registryDependencies: ['button', 'modal', 'dialog', 'focus-styles'],
  dependencies: [],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--lightbox-radius',
      default: '--radius-lg',
      description: 'Corner radius of the thumbnail tiles.',
    },
  },
} satisfies RegistryItem

export default lightboxMeta
