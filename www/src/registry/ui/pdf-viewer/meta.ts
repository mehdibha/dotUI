import type { RegistryItem } from '@/registry/types'

const pdfViewerMeta = {
  name: 'pdf-viewer',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/pdf-viewer/base.tsx',
      target: 'ui/pdf-viewer.tsx',
    },
  ],
  registryDependencies: ['button'],
  dependencies: ['react-pdf'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--pdf-viewer-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default pdfViewerMeta
