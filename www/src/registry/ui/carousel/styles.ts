import { createStyles } from '@/lib/styles'

import carouselMeta from './meta'

const { useStyles, styles } = createStyles(carouselMeta, {
  base: {
    slots: {
      root: 'relative',
      viewport: 'overflow-hidden',
      container:
        'flex data-[orientation=horizontal]:-ml-4 data-[orientation=vertical]:-mt-4 data-[orientation=vertical]:flex-col',
      item: 'min-w-0 shrink-0 grow-0 basis-full data-[orientation=horizontal]:pl-4 data-[orientation=vertical]:pt-4',
      previous:
        'absolute top-1/2 left-3 -translate-y-1/2 data-[orientation=vertical]:top-3 data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:-translate-x-1/2 data-[orientation=vertical]:translate-y-0 data-[orientation=vertical]:rotate-90',
      next: 'absolute top-1/2 right-3 -translate-y-1/2 data-[orientation=vertical]:top-auto data-[orientation=vertical]:right-auto data-[orientation=vertical]:bottom-3 data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:-translate-x-1/2 data-[orientation=vertical]:translate-y-0 data-[orientation=vertical]:rotate-90',
      dots: 'mt-3 flex items-center justify-center gap-2',
      dot: 'size-2 rounded-full bg-border transition-colors data-[active]:bg-primary',
    },
  },
})

export type CarouselStyles = typeof styles

export { useStyles }
