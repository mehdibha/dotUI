import { createStyles } from '@/lib/styles'

import commandMeta from './meta'

const { useStyles, styles } = createStyles(commandMeta, {
  base: {
    base: [
      'group/command flex w-full flex-col gap-1 text-fg',
      'max-h-[inherit] overflow-y-auto',

      // ListBox — frameless, scrollable
      // "**:data-listbox:max-h-72 **:data-listbox:scroll-py-1 **:data-listbox:overflow-y-auto **:data-listbox:p-0 **:data-listbox:outline-hidden",
    ],
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    style: {
      1: {
        base: [
          'p-1.5 **:data-listbox:p-0 **:data-search-field:pb-0 **:data-listbox:**:data-separator:-mx-1.5 **:data-listbox:**:data-separator:my-1.5 **:[[data-search-field]>[data-input-group]]:rounded-sm',
        ],
      },
      2: {
        base: [
          '**:[[data-search-field]>[data-input-group]]:border-0 **:[[data-search-field]>[data-input-group]]:bg-transparent **:[[data-search-field]>[data-input-group]]:ring-0',
          '**:data-search-field:border-b',
          'in-data-modal:**:data-search-field:p-0.5',
        ],
      },
      3: {},
    },
  },
})

export type CommandStyles = typeof styles

export { useStyles }
