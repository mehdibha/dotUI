import { createStyles } from '@/lib/styles'

import videoPlayerMeta from './meta'

const { useStyles, styles } = createStyles(videoPlayerMeta, {
  base: {
    slots: {
      root: 'group/video-player relative isolate flex w-full flex-col overflow-clip rounded-(--video-player-radius)',
      video:
        'block aspect-video w-full bg-black object-contain in-data-fullscreen:aspect-auto in-data-fullscreen:min-h-0 in-data-fullscreen:grow in-data-idle:cursor-none',
      controls: 'z-10 flex flex-col',
      row: 'flex items-center',
      seekSlider:
        '[--slider-fill-color:var(--video-player-accent,var(--color-fg))] [--slider-size:var(--video-player-seek-size)]',
      volume: 'flex items-center',
      volumeSlider: '[--slider-fill-color:var(--color-fg)]',
      time: 'whitespace-nowrap text-fg-muted tabular-nums',
    },
  },
  density: {
    compact: {
      slots: {
        controls: 'gap-0.5 p-1.5',
        row: 'gap-0.5',
        time: 'px-1.5 text-xs',
        volumeSlider: 'w-14',
      },
    },
    default: {
      slots: {
        controls: 'gap-1 p-2',
        row: 'gap-1',
        time: 'px-2 text-xs',
        volumeSlider: 'w-20',
      },
    },
    comfortable: {
      slots: {
        controls: 'gap-1.5 p-2.5',
        row: 'gap-1.5',
        time: 'px-2.5 text-sm',
        volumeSlider: 'w-24',
      },
    },
  },
  params: {
    /* ---------------------------- Controls style ---------------------------- */
    'controls-style': {
      // Overlay controls sit on arbitrary video content, so they pin
      // light-on-dark foreground tokens locally instead of following the
      // page theme.
      overlay: {
        slots: {
          controls: [
            'absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/35 to-transparent pt-8',
            '[--color-fg-muted:rgb(255_255_255/0.72)] [--color-fg:#fff] [--color-inverse:#fff] [--color-neutral:rgb(255_255_255/0.25)]',
            'transition-opacity duration-300 in-data-idle:not-focus-within:pointer-events-none in-data-idle:not-focus-within:opacity-0',
          ],
        },
      },
      floating: {
        slots: {
          controls: [
            'absolute inset-x-2 bottom-2 rounded-[max(calc(var(--video-player-radius)-var(--spacing)*2),var(--radius-sm))] bg-black/55 backdrop-blur-md',
            '[--color-fg-muted:rgb(255_255_255/0.72)] [--color-fg:#fff] [--color-inverse:#fff] [--color-neutral:rgb(255_255_255/0.25)]',
            'transition-opacity duration-300 in-data-idle:not-focus-within:pointer-events-none in-data-idle:not-focus-within:opacity-0',
          ],
        },
      },
      bar: {
        slots: {
          root: 'border',
          controls: 'border-t bg-bg',
        },
      },
    },
    /* ------------------------------ Seek thumb ------------------------------ */
    'seek-thumb': {
      hover: {
        slots: {
          seekSlider: [
            '**:data-slider-thumb:opacity-0 **:data-slider-thumb:transition-opacity',
            'focus-within:**:data-slider-thumb:opacity-100 hover:**:data-slider-thumb:opacity-100',
          ],
        },
      },
      always: {},
      hidden: {
        slots: {
          seekSlider: '**:data-slider-thumb:hidden',
        },
      },
    },
  },
})

export type VideoPlayerStyles = typeof styles

export { useStyles }
