import { createStyles } from '@/lib/styles'

import pdfViewerMeta from './meta'

const { useStyles, styles } = createStyles(pdfViewerMeta, {
  base: {
    slots: {
      root: 'flex w-full flex-col overflow-hidden rounded-(--pdf-viewer-radius) border bg-card',
      toolbar: 'flex items-center justify-between gap-2 border-b bg-card',
      group: 'flex items-center gap-1',
      pageInfo:
        'min-w-24 text-center text-sm text-fg-muted tabular-nums select-none',
      zoomInfo:
        'min-w-12 text-center text-sm text-fg-muted tabular-nums select-none',
      viewport: 'flex justify-center overflow-auto bg-muted',
      document: 'flex flex-col items-center gap-4',
      page: 'overflow-hidden bg-bg shadow-sm',
      message: 'flex items-center justify-center p-8 text-sm text-fg-muted',
    },
  },
  density: {
    compact: {
      slots: {
        toolbar: 'px-2 py-1.5',
        viewport: 'p-3',
      },
    },
    default: {
      slots: {
        toolbar: 'px-3 py-2',
        viewport: 'p-4',
      },
    },
    comfortable: {
      slots: {
        toolbar: 'px-4 py-3',
        viewport: 'p-6',
      },
    },
  },
})

export type PdfViewerStyles = typeof styles

export { useStyles }
