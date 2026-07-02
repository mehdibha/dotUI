import { createStyles } from '@/lib/styles'

import voiceMessageMeta from './meta'

const { useStyles, styles } = createStyles(voiceMessageMeta, {
  base: {
    slots: {
      root: [
        'group/voice-message flex w-fit max-w-full items-center gap-3 rounded-(--voice-message-radius) bg-muted p-2 pr-3',
      ],
      waveform: ['min-w-0 flex-1 cursor-pointer'],
      time: ['shrink-0 text-xs text-fg-muted tabular-nums select-none'],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type VoiceMessageStyles = typeof styles

export { useStyles }
