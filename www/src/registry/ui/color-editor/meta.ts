import type { RegistryItem } from '@/registry/types'

const colorEditorMeta = {
  name: 'color-editor',
  type: 'registry:ui',
  group: 'color-swatches',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/color-editor/base.tsx',
      target: 'ui/color-editor.tsx',
    },
  ],
  registryDependencies: [
    'color-area',
    'color-field',
    'color-slider',
    'input',
    'select',
  ],
  params: {
    style: {
      kind: 'enum',
      default: 'default',
      values: ['default', 'hammamet'] as const,
    },
  },
} satisfies RegistryItem

export default colorEditorMeta
