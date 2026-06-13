import { createStyles } from '@/modules/core/styles'

import accordionMeta from './meta'

const { useStyles, styles } = createStyles(accordionMeta, {
  base: {
    slots: {
      root: 'flex w-full flex-col',
      item: 'group/accordion-item w-full disabled:text-fg-disabled disabled:**:[svg]:text-fg-disabled **:data-button:[&[slot=trigger]]:w-full **:data-button:[&[slot=trigger]]:justify-between **:data-button:[&[slot=trigger]]:text-left',
      heading: 'flex',
      trigger: [
        'focus-reset focus-visible:focus-ring',
        'flex flex-1 cursor-interactive items-start justify-between gap-4 rounded-md py-3 text-left text-sm font-medium transition-shadow disabled:pointer-events-none',
      ],
      panel:
        'h-(--disclosure-panel-height) overflow-clip text-sm text-fg-muted opacity-0 duration-300 ease-fluid-out group-expanded/accordion-item:opacity-100 motion-safe:transition-[height,opacity]',
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    style: {
      default: {
        slots: {
          root: '',
          item: 'not-last:border-b',
          heading: '',
          trigger: '',
          panel: '',
        },
      },
      hammamet: {
        slots: {
          root: 'border',
          item: 'not-last:border-b',
          heading: '',
          trigger: '',
          panel: '',
        },
      },
    },
  },
})

export type AccordionStyles = typeof styles

export { useStyles }
