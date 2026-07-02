import { createStyles } from '@/lib/styles'

import videoCallUiMeta from './meta'

const { useStyles, styles } = createStyles(videoCallUiMeta, {
  base: {
    slots: {
      root: 'flex flex-col gap-3 rounded-(--video-call-ui-radius) bg-zinc-950 p-3',
      grid: 'grid flex-1 gap-3',
      tile: 'group/tile relative aspect-video overflow-hidden rounded-(--video-call-ui-radius) bg-zinc-900 ring-1 ring-white/10',
      media: 'absolute inset-0 size-full object-cover',
      placeholder:
        'absolute inset-0 flex items-center justify-center bg-zinc-800',
      label:
        'absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-md bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm',
      labelText: 'truncate',
      mutedIndicator:
        'absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm [&>svg]:size-3.5',
      controls:
        'flex items-center justify-center gap-2 rounded-(--video-call-ui-radius) bg-zinc-900 p-2',
    },
  },
})

export type VideoCallUiStyles = typeof styles

export { useStyles }
