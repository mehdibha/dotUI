import type { RegistryItem } from '@/registry/types'

const loaderMeta = {
  name: 'loader',
  type: 'registry:ui',
  group: 'progress',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/loader/base.spinner.tsx',
      target: 'ui/loader.tsx',
    },
  ],
  params: {
    style: {
      kind: 'enum',
      default: 'spinner',
      values: ['spinner', 'ring'] as const,
      files: {
        spinner: [
          {
            type: 'registry:ui',
            path: 'ui/loader/base.spinner.tsx',
            target: 'ui/loader.tsx',
          },
        ],
        ring: [
          {
            type: 'registry:ui',
            path: 'ui/loader/base.ring.tsx',
            target: 'ui/loader.tsx',
          },
        ],
      },
    },
  },
} satisfies RegistryItem

export default loaderMeta
