import type { RegistryItem } from '@/registry/types'

const timePickerMeta = {
  name: 'time-picker',
  type: 'registry:ui',
  group: 'pickers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/time-picker/base.tsx',
      target: 'ui/time-picker.tsx',
    },
  ],
  registryDependencies: ['button', 'dialog', 'field', 'input', 'popover'],
} satisfies RegistryItem

export default timePickerMeta
