import { createStyles } from '@/modules/core/styles'

import cardMeta from './meta'

const { useStyles, styles } = createStyles(cardMeta, {
  base: {
    slots: {
      root: 'group/card flex flex-col rounded-(--card-radius) border bg-card has-[>img:first-child]:pt-0 *:[img]:first:rounded-t-(--card-radius) *:[img]:last:rounded-b-(--card-radius)',
      header:
        'group/card-header @container/card-header grid auto-rows-min items-start rounded-t-(--card-radius) has-data-card-action:grid-cols-[1fr_auto] has-data-card-description:grid-rows-[auto_auto]',
      title: 'font-heading',
      description: 'text-fg-muted',
      action: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
      content: '',
      footer: 'flex items-center rounded-b-(--card-radius)',
    },
  },
  density: {
    compact: {
      slots: {
        root: 'gap-4 py-4 text-xs/relaxed has-data-card-footer:pb-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-card-footer:pb-0',
        header:
          'gap-1 px-4 group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3',
        title: 'text-sm font-medium',
        description: 'text-xs/relaxed',
        content: 'px-4 group-data-[size=sm]/card:px-3',
        footer:
          'px-4 pb-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pb-3 [.border-t]:pt-4 group-data-[size=sm]/card:[.border-t]:pt-3',
      },
    },
    default: {
      slots: {
        root: 'gap-4 py-4 text-xs/relaxed has-data-card-footer:pb-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-card-footer:pb-0',
        header:
          'gap-1 px-4 group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3',
        title: 'text-base leading-snug font-medium',
        description: 'text-sm',
        content: 'px-4 group-data-[size=sm]/card:px-3',
        footer:
          'px-4 pb-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pb-3 [.border-t]:pt-4 group-data-[size=sm]/card:[.border-t]:pt-3',
      },
    },
    comfortable: {
      slots: {
        root: 'gap-6 py-6 text-sm has-data-card-footer:pb-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 data-[size=sm]:has-data-card-footer:pb-0',
        header:
          'gap-1 px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4',
        title:
          'text-base leading-normal font-medium group-data-[size=sm]/card:text-sm',
        description: 'text-sm',
        content: 'px-6 group-data-[size=sm]/card:px-4',
        footer:
          'px-6 pb-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pb-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4',
      },
    },
  },
  params: {
    style: {
      default: {
        slots: {
          root: '',
          header: '',
          title: '',
          description: '',
          action: '',
          content: '',
          footer: '',
        },
      },
      tasnim: {
        slots: {
          root: '',
          header: '',
          title: '',
          description: '',
          action: '',
          content: '',
          footer: 'border-t bg-neutral-900/50',
        },
      },
    },
  },
})

export type CardStyles = typeof styles

export { useStyles }
