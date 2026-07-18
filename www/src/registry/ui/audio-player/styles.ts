import { createStyles } from '@/lib/styles'

import audioPlayerMeta from './meta'

const { useStyles, styles } = createStyles(audioPlayerMeta, {
  base: {
    slots: {
      root: 'group/audio-player flex w-full items-center rounded-(--audio-player-radius) shadow-(--audio-player-shadow)',
      seekSlider: 'grow',
      volumeSlider: 'w-20 shrink-0',
      time: 'shrink-0 font-mono text-fg-muted tabular-nums group-data-disabled/audio-player:text-fg-disabled',
    },
  },
  density: {
    compact: {
      slots: {
        root: 'gap-1.5 p-2',
        time: 'text-[0.6875rem]',
      },
    },
    default: {
      slots: {
        root: 'gap-2 p-3',
        time: 'text-xs',
      },
    },
    comfortable: {
      slots: {
        root: 'gap-3 p-4',
        time: 'text-sm',
      },
    },
  },
  params: {
    style: {
      card: {
        slots: {
          root: 'border bg-card',
        },
      },
      soft: {
        slots: {
          root: 'bg-muted',
        },
      },
      plain: {
        slots: {
          root: 'p-0 shadow-none',
        },
      },
    },
    'seek-thumb': {
      visible: {},
      'on-hover': {
        slots: {
          seekSlider: [
            '[&_[data-slider-thumb]]:opacity-0 [&_[data-slider-thumb]]:transition-opacity',
            '[&_[data-slider-thumb][data-dragging]]:opacity-100 [&_[data-slider-thumb][data-focus-visible]]:opacity-100 [&:hover_[data-slider-thumb]]:opacity-100',
          ],
        },
      },
      hidden: {
        slots: {
          seekSlider:
            '[&_[data-slider-thumb]]:opacity-0 [&_[data-slider-thumb][data-focus-visible]]:opacity-100',
        },
      },
    },
  },
})

export type AudioPlayerStyles = typeof styles

export { useStyles }
