import type { RegistryItem } from '@/registry/types'

const ratingMeta = {
  name: 'rating',
  type: 'registry:ui',
  group: 'selection-controls',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/rating/base.tsx',
      target: 'ui/rating.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
  dependencies: ['react-aria'],
  params: {
    color: {
      kind: 'scalar',
      type: 'color',
      cssVar: '--rating-color',
      default: '--color-primary',
    },
    size: {
      kind: 'scalar',
      type: 'spacing',
      cssVar: '--rating-size',
      default: 'calc(var(--spacing) * 5)',
      minValue: 3,
      maxValue: 8,
      step: 0.25,
    },
    'default-cursor': {
      kind: 'scalar',
      type: 'cursor',
      cssVar: '--rating-cursor',
      default: '--cursor-interactive',
    },
  },
} satisfies RegistryItem

export default ratingMeta
