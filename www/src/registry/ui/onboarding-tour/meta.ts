import type { RegistryItem } from '@/registry/types'

const onboardingTourMeta = {
  name: 'onboarding-tour',
  type: 'registry:ui',
  group: 'overlays',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/onboarding-tour/base.tsx',
      target: 'ui/onboarding-tour.tsx',
    },
  ],
  registryDependencies: ['button'],
  dependencies: ['driver.js'],
} satisfies RegistryItem

export default onboardingTourMeta
