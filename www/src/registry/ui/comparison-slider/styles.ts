import { createStyles } from '@/lib/styles'

import comparisonSliderMeta from './meta'

const { useStyles, styles } = createStyles(comparisonSliderMeta, {
  base: {
    slots: {
      root: 'relative isolate w-full touch-none overflow-hidden rounded-(--comparison-slider-radius) select-none',
      after: 'block w-full select-none [&>*]:block [&>*]:w-full',
      before:
        'pointer-events-none absolute inset-0 overflow-hidden [&>*]:size-full [&>*]:object-cover',
      control: 'absolute inset-0',
      divider:
        'pointer-events-none absolute inset-y-0 z-10 w-(--comparison-slider-divider-width) -translate-x-1/2 bg-(--comparison-slider-divider-color)',
      thumb:
        'absolute top-1/2 z-20 grid size-(--comparison-slider-handle-size) -translate-y-1/2 cursor-(--comparison-slider-cursor) place-items-center rounded-full bg-(--comparison-slider-handle-color) text-fg shadow-md outline-hidden focus-visible:focus-ring',
    },
  },
})

export type ComparisonSliderStyles = typeof styles

export { useStyles }
