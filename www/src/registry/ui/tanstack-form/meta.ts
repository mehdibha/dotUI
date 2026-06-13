import type { RegistryItem } from '@/registry/types'

const tanstackFormMeta = {
  name: 'tanstack-form',
  type: 'registry:ui',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/tanstack-form/base.tsx',
      target: 'ui/tanstack-form.tsx',
    },
  ],
  dependencies: ['@tanstack/react-form'],
  registryDependencies: [
    'button',
    'checkbox',
    'color-field',
    'color-picker',
    'combobox',
    'date-field',
    'date-picker',
    'field',
    'number-field',
    'radio-group',
    'search-field',
    'select',
    'slider',
    'switch',
    'text-field',
    'time-field',
  ],
} satisfies RegistryItem

export default tanstackFormMeta
