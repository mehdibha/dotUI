import { createStyles } from '@/lib/styles'

import dialogMeta from './meta'

const { useStyles, styles } = createStyles(dialogMeta, {
  base: {
    slots: {
      content:
        'relative flex max-h-[inherit] min-h-0 flex-col gap-4 outline-none has-data-command:p-0 [@container_(height<31.25rem)]:overflow-y-auto',
      header: 'flex flex-col',
      title: '',
      description: 'text-fg-muted',
      body: 'flex min-h-0 flex-1 flex-col gap-2 in-data-modal:[@container_(height<31.25rem)]:mx-0 in-data-modal:[@container_(height<31.25rem)]:shrink-0 in-data-modal:[@container_(height<31.25rem)]:overflow-y-visible in-data-modal:[@container_(height<31.25rem)]:px-0',
      footer: 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      closeButton: 'absolute',
    },
  },
  density: {
    compact: {
      slots: {
        content: 'p-4 text-xs/relaxed in-data-popover:p-2.5',
        title: 'text-sm font-medium',
        description: '',
        closeButton: 'top-2 right-2',
        body: '-mx-4 px-4 in-data-popover:-mx-2.5 in-data-popover:px-2.5',
      },
    },
    default: {
      slots: {
        content: 'p-4 text-sm in-data-popover:p-2.5 in-data-popover:text-xs',
        header: 'gap-2 in-data-popover:gap-0.5 in-data-popover:text-sm',
        title: 'font-medium in-data-modal:text-base in-data-modal:leading-none',
        description: '',
        closeButton: 'top-2 right-2',
        body: '-mx-4 px-4 in-data-popover:-mx-2.5 in-data-popover:px-2.5',
      },
    },
    comfortable: {
      slots: {
        content: 'p-6 text-sm in-data-popover:p-4',
        header: 'gap-2 in-data-popover:gap-1',
        title:
          'text-lg font-semibold in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium',
        description: '',
        closeButton: 'top-4 right-4',
        body: '-mx-6 px-6 in-data-popover:-mx-4 in-data-popover:px-4',
      },
    },
  },
})

export type DialogStyles = typeof styles

export { useStyles }
