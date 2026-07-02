import type { RegistryItem } from '@/registry/types'

const markdownEditorMeta = {
  name: 'markdown-editor',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/markdown-editor/base.tsx',
      target: 'ui/markdown-editor.tsx',
    },
  ],
  dependencies: ['react-markdown', 'remark-gfm'],
  registryDependencies: ['button', 'toggle-button', 'tabs', 'focus-styles'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--markdown-editor-radius',
      default: '--radius-md',
    },
  },
} satisfies RegistryItem

export default markdownEditorMeta
