import type { RegistryItem } from '@/registry/types'

const textareaCaretMeta = {
  name: 'textarea-caret',
  type: 'registry:lib',
  files: [
    {
      path: 'lib/textarea-caret/index.ts',
      type: 'registry:lib',
      target: 'lib/textarea-caret.ts',
    },
  ],
} satisfies RegistryItem

export default textareaCaretMeta
