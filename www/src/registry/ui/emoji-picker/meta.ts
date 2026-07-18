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
  registryDependencies: ['grid-list', 'search-field', 'select', 'loader'],
  dependencies: ['react-aria-components'],
  params: {
    'cell-radius': {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--emoji-picker-cell-radius',
      default: '--radius-md',
      description: 'The radius of the highlight behind a hovered emoji.',
    },
  },
} satisfies RegistryItem

export default emojiPickerMeta
