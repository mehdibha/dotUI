import type { RegistryItem } from '@/registry/types'

const comparisonSliderMeta = {
  name: 'comparison-slider',
  type: 'registry:ui',
  group: 'sliders',
  files: [
    {
      type: 'registry:ui',
      path: 'ui/comparison-slider/base.tsx',
      target: 'ui/comparison-slider.tsx',
    },
  ],
  registryDependencies: ['focus-styles'],
  dependencies: ['react-aria'],
  params: {
    radius: {
      kind: 'scalar',
      type: 'radius',
      cssVar: '--comparison-slider-radius',
      default: '--radius-lg',
    },
    'handle-size': {
      kind: 'scalar',
      type: 'spacing',
      cssVar: '--comparison-slider-handle-size',
      default: 'calc(var(--spacing) * 8)',
      minValue: 5,
      maxValue: 12,
      step: 0.5,
    },
    'handle-color': {
      kind: 'scalar',
      type: 'color',
      cssVar: '--comparison-slider-handle-color',
      default: '--color-bg',
    },
    'divider-width': {
      kind: 'scalar',
      type: 'spacing',
      cssVar: '--comparison-slider-divider-width',
      default: 'calc(var(--spacing) * 0.5)',
      minValue: 0.25,
      maxValue: 2,
      step: 0.25,
    },
    'divider-color': {
      kind: 'scalar',
      type: 'color',
      cssVar: '--comparison-slider-divider-color',
      default: '--color-bg',
    },
    'default-cursor': {
      kind: 'scalar',
      type: 'cursor',
      cssVar: '--comparison-slider-cursor',
      default: '--cursor-interactive',
    },
  },
} satisfies RegistryItem

export default comparisonSliderMeta
