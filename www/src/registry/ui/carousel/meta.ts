import type { RegistryItem } from '@/registry/types'

const carouselMeta = {
  name: 'carousel',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/carousel/base.tsx',
      target: 'ui/carousel.tsx',
    },
  ],
  registryDependencies: ['button'],
  dependencies: ['embla-carousel-react'],
} satisfies RegistryItem

export default carouselMeta
