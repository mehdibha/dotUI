import type { RegistryItem } from '@/registry/types'

const tooltipMeta = {
  name: 'tooltip',
  type: 'registry:ui',
  group: 'overlays',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/tooltip/base.tsx',
      target: 'ui/tooltip.tsx',
    },
  ],
  params: {
    color: {
      kind: 'enum',
      default: 'default',
      values: ['default', 'translucid'] as const,
      description: 'How the tooltip surface is rendered.',
    },
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--tooltip-radius',
      default: '--radius-sm',
    },
  },
} satisfies RegistryItem

export default tooltipMeta
