import type { RegistryItem } from '@/registry/types'

const richTextEditorMeta = {
  name: 'rich-text-editor',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/rich-text-editor/base.tsx',
      target: 'ui/rich-text-editor.tsx',
    },
  ],
  registryDependencies: ['toggle-button', 'button', 'focus-styles'],
  dependencies: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/pm'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--rich-text-editor-radius',
      default: 'var(--radius-lg)',
    },
  },
} satisfies RegistryItem

export default richTextEditorMeta
