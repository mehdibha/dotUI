import { createStyles } from '@/lib/styles'

import lightboxMeta from './meta'

const { useStyles, styles } = createStyles(lightboxMeta, {
  base: {
    slots: {
      root: 'flex flex-col gap-2',
      grid: 'grid grid-cols-2 gap-2 sm:grid-cols-3',
      thumbnail: [
        'group/thumb relative aspect-square overflow-hidden rounded-(--lightbox-radius) bg-muted',
        'cursor-pointer transition-opacity outline-none',
        'hover:opacity-90 focus-visible:focus-ring active:opacity-80',
      ],
      thumbnailImage:
        'size-full object-cover transition-transform duration-200 group-hover/thumb:scale-105',
      viewer: 'flex flex-col items-center gap-3 p-0',
      figure:
        'relative flex w-full items-center justify-center overflow-hidden rounded-(--lightbox-radius) bg-black',
      image: 'max-h-[70vh] w-auto max-w-full object-contain',
      caption: 'text-center text-sm text-fg-muted',
      controls:
        'pointer-events-none absolute inset-0 flex items-center justify-between p-2',
      navButton: 'pointer-events-auto',
      closeButton: 'absolute top-2 right-2 z-10',
      counter:
        'absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white',
    },
  },
})

export type LightboxStyles = typeof styles

export { useStyles }
