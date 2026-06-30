import { createStyles } from '@/lib/styles'

import audioPlayerMeta from './meta'

const { useStyles, styles } = createStyles(audioPlayerMeta, {
  base: {
    slots: {
      root: 'flex w-full items-center gap-3 rounded-(--audio-player-radius) border bg-card p-2 text-fg',
      info: 'flex min-w-0 flex-1 flex-col gap-1',
      title: 'truncate text-sm leading-none font-medium',
      artist: 'truncate text-xs text-fg-muted',
      seek: 'flex items-center gap-2',
      time: 'shrink-0 text-xs text-fg-muted tabular-nums',
      volume: 'flex shrink-0 items-center gap-1',
    },
  },
})

export type AudioPlayerStyles = typeof styles

export { useStyles }
