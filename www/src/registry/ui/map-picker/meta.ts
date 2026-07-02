import type { RegistryItem } from '@/registry/types'

const mapPickerMeta = {
  name: 'map-picker',
  type: 'registry:ui',
  group: 'containers',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/map-picker/base.tsx',
      target: 'ui/map-picker.tsx',
    },
  ],
  registryDependencies: ['button'],
  dependencies: ['leaflet', 'react-leaflet', '@types/leaflet'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--map-picker-radius',
      default: '--radius-lg',
    },
  },
} satisfies RegistryItem

export default mapPickerMeta
