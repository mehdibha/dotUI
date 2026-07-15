import type { RegistryItem } from '@/registry/types'

const qrCodeMeta = {
  name: 'qr-code',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/qr-code/base.squares.tsx',
      target: 'ui/qr-code.tsx',
    },
  ],
  dependencies: ['uqr'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--qr-code-radius',
      default: '--radius-lg',
    },
    style: {
      kind: 'enum',
      default: 'squares',
      values: ['squares', 'rounded', 'dots'] as const,
      files: {
        squares: [
          {
            type: 'registry:ui',
            path: 'ui/qr-code/base.squares.tsx',
            target: 'ui/qr-code.tsx',
          },
        ],
        rounded: [
          {
            type: 'registry:ui',
            path: 'ui/qr-code/base.rounded.tsx',
            target: 'ui/qr-code.tsx',
          },
        ],
        dots: [
          {
            type: 'registry:ui',
            path: 'ui/qr-code/base.dots.tsx',
            target: 'ui/qr-code.tsx',
          },
        ],
      },
    },
  },
} satisfies RegistryItem

export default qrCodeMeta
