import type { RegistryItem } from '@/registry/types'

export const registryBase = [
  {
    name: 'base',
    type: 'registry:style',
    extends: 'none',
    dependencies: [
      'tailwind-variants',
      // peer of tailwind-variants (its internal twMerge); cn uses cnfast now
      'tailwind-merge',
      'cnfast',
      'react-aria-components',
      'tailwindcss-react-aria-components',
      'tw-animate-css',
      'tailwindcss-autocontrast',
    ],
    css: {
      '@plugin tailwindcss-react-aria-components': {},
      '@plugin tailwindcss-autocontrast': {},
    },

    registryDependencies: ['utils', 'focus-styles', 'theme'],
    files: [],
  },
] as const satisfies RegistryItem[]
