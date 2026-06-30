import type { RegistryItem } from '@/registry/types'

const codeEditorMeta = {
  name: 'code-editor',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/code-editor/base.tsx',
      target: 'ui/code-editor.tsx',
    },
  ],
  dependencies: ['@uiw/react-codemirror', '@codemirror/lang-javascript'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--code-editor-radius',
      default: '--radius-lg',
      // description: "Radius of the code editor container.",
    },
  },
} satisfies RegistryItem

export default codeEditorMeta
