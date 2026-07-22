import type { RegistryItem } from '@/registry/types'

const avatarMeta = {
  name: 'avatar',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/avatar/base.tsx',
      target: 'ui/avatar.tsx',
    },
    // base.tsx imports @/lib/context and @/hooks/use-image-loading-status,
    // which have no installable registry items — ship the files until they
    // become publishable.
    {
      type: 'registry:lib',
      path: 'lib/context/index.tsx',
      target: 'lib/context.tsx',
    },
    {
      type: 'registry:hook',
      path: 'hooks/use-image-loading-status.ts',
      target: 'hooks/use-image-loading-status.ts',
    },
  ],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--avatar-radius',
      default: '--radius-full',
    },
  },
} satisfies RegistryItem

export default avatarMeta
