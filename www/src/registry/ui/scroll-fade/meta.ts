import type { RegistryItem } from '@/registry/types'

const scrollFadeMeta = {
  name: 'scroll-fade',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/scroll-fade/base.tsx',
      target: 'ui/scroll-fade.tsx',
    },
    {
      type: 'registry:ui',
      path: 'ui/scroll-fade/use-scroll-fade.ts',
      target: 'ui/use-scroll-fade.ts',
    },
  ],
} satisfies RegistryItem

export default scrollFadeMeta
