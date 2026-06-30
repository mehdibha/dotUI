import { createStyles } from '@/lib/styles'

import segmentedControlMeta from './meta'

const { useStyles, styles } = createStyles(segmentedControlMeta, {
  base: {
    slots: {
      root: 'inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-fg-muted',
      item: [
        'relative isolate inline-flex cursor-default items-center justify-center rounded-md border border-transparent font-medium whitespace-nowrap focus-reset transition-[color] select-none focus-visible:focus-ring',
        'text-fg-muted hover:text-fg selected:text-fg-on-selected',
        'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        '**:[svg]:pointer-events-none **:[svg]:shrink-0',
      ],
      // The sliding pill. SelectionIndicator positions/sizes it over the selected
      // item; the transition makes it glide. `inset-0` + `isolate` on the item sit
      // it behind the content (which is `z-10`).
      indicator:
        'pointer-events-none absolute inset-0 rounded-md bg-selected shadow-sm duration-150 ease-out motion-safe:transition-[translate,width,height]',
      itemContent: 'relative z-10 inline-flex items-center [gap:inherit]',
    },
  },
  density: {
    compact: {
      slots: {
        item: 'gap-1.5 px-2 py-1 text-xs has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 **:[svg]:not-with-[size]:size-3.5',
      },
    },
    default: {
      slots: {
        item: 'gap-1.5 px-2.5 py-1 text-sm has-data-icon-end:pr-2 has-data-icon-start:pl-2 **:[svg]:not-with-[size]:size-4',
      },
    },
    comfortable: {
      slots: {
        item: 'gap-2 px-3 py-1.5 text-sm has-data-icon-end:pr-2.5 has-data-icon-start:pl-2.5 **:[svg]:not-with-[size]:size-4',
      },
    },
  },
})

export type SegmentedControlStyles = typeof styles

export { useStyles }
