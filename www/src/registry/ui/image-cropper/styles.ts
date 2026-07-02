import { createStyles } from '@/lib/styles'

import imageCropperMeta from './meta'

const { useStyles, styles } = createStyles(imageCropperMeta, {
  base: {
    slots: {
      root: 'flex w-full flex-col gap-4',
      cropper:
        'relative h-72 w-full overflow-hidden rounded-(--image-cropper-radius) bg-neutral',
      controls: 'flex flex-col gap-4',
      control: 'flex items-center gap-3',
      controlLabel: 'w-14 shrink-0 text-fg-muted',
      actions: 'flex items-center justify-end gap-2',
    },
  },
  density: {
    compact: {
      slots: {
        controlLabel: 'text-xs',
      },
    },
    default: {
      slots: {
        controlLabel: 'text-sm',
      },
    },
    comfortable: {
      slots: {
        controlLabel: 'text-sm',
      },
    },
  },
})

export type ImageCropperStyles = typeof styles

export { useStyles }
