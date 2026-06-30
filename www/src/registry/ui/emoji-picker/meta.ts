import type { RegistryItem } from '@/registry/types'

const emojiPickerMeta = {
  name: 'emoji-picker',
  type: 'registry:ui',
  group: 'pickers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/emoji-picker/base.tsx',
      target: 'ui/emoji-picker.tsx',
    },
  ],
  registryDependencies: ['popover', 'dialog', 'button', 'focus-styles'],
  dependencies: ['frimousse'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--emoji-picker-radius',
      default: '--radius-md',
    },
  },
} satisfies RegistryItem

export default emojiPickerMeta
