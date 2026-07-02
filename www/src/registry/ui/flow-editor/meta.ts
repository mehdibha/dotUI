import type { RegistryItem } from '@/registry/types'

const flowEditorMeta = {
  name: 'flow-editor',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/flow-editor/base.tsx',
      target: 'ui/flow-editor.tsx',
    },
  ],
  dependencies: ['@xyflow/react'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--flow-editor-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default flowEditorMeta
