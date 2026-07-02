import type { BlockRegistryItem } from '@/registry/types'

const file = (variant: 'centered' | 'split' | 'minimal') =>
  ({
    type: 'registry:component',
    path: `blocks/login/base.${variant}.tsx`,
    target: 'components/login.tsx',
  }) as const

const loginMeta = {
  name: 'login',
  type: 'registry:block',
  category: 'page',
  description: 'A sign-in screen with email and password.',
  registryDependencies: [
    'button',
    'card',
    'checkbox',
    'field',
    'input',
    'link',
    'text-field',
  ],
  // Default (no preset) ships the `centered` variant.
  files: [file('centered')],
  params: {
    // The single tweak. Each named variant is its own composition file,
    // resolved at publish to one canonical `components/login.tsx` (the
    // `loader` enum-with-files mechanism, at screen scale).
    variant: {
      kind: 'enum',
      default: 'centered',
      values: ['centered', 'split', 'minimal'],
      files: {
        centered: [file('centered')],
        split: [file('split')],
        minimal: [file('minimal')],
      },
    },
  },
  display: {
    title: 'Login',
    description: 'A sign-in screen with email and password.',
    variantLabels: {
      centered: 'Centered',
      split: 'Split',
      minimal: 'Minimal',
    },
  },
} satisfies BlockRegistryItem

export default loginMeta
