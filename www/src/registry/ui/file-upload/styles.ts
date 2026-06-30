import { createStyles } from '@/lib/styles'

import fileUploadMeta from './meta'

const { useStyles, styles } = createStyles(fileUploadMeta, {
  base: {
    slots: {
      prompt: 'flex flex-col items-center justify-center gap-2 text-center',
      icon: 'size-6 text-fg-muted',
      promptLabel: 'text-sm font-medium',
      promptDescription: 'text-xs text-fg-muted',
      list: 'mt-3 flex flex-col gap-2',
      item: 'flex items-center gap-3 rounded-(--file-upload-radius) border bg-card p-2.5 data-[status=error]:border-border-danger',
      itemIcon: 'size-5 shrink-0 text-fg-muted',
      itemInfo: 'flex min-w-0 flex-1 flex-col',
      itemName: 'truncate text-sm font-medium',
      itemMeta: 'text-xs text-fg-muted',
    },
  },
})

export type FileUploadStyles = typeof styles

export { useStyles }
