import { createStyles } from '@/lib/styles'

import videoPlayerMeta from './meta'

const { useStyles, styles } = createStyles(videoPlayerMeta, {
  base: {
    slots: {
      root: 'group relative aspect-video w-full overflow-hidden rounded-(--video-player-radius) bg-black text-white',
      video: 'size-full',
      bigButton:
        'absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-105 [&_svg]:size-7',
      controls:
        'absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 pt-8 opacity-0 transition-opacity group-hover:opacity-100 group-data-[paused]:opacity-100 [&_[data-button]]:text-white [&_[data-button]]:hover:bg-white/15',
      time: 'px-1.5 text-xs text-white/90 tabular-nums',
      spacer: 'flex-1',
    },
  },
})

export type VideoPlayerStyles = typeof styles

export { useStyles }
