import { createStyles } from '@/lib/styles'

import stepperMeta from './meta'

const { useStyles, styles } = createStyles(stepperMeta, {
  base: {
    slots: {
      root: 'flex w-full items-center gap-3',
      item: 'group/step flex flex-1 items-center gap-3 last:flex-none last:[&_[data-stepper-separator]]:hidden',
      indicator: [
        'flex size-(--stepper-indicator-size) shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors [&_svg]:size-[1.1em]',
        'data-[status=inactive]:border-border data-[status=inactive]:text-fg-muted',
        'data-[status=active]:border-primary data-[status=active]:text-fg',
        'data-[status=completed]:border-primary data-[status=completed]:bg-primary data-[status=completed]:text-fg-on-primary',
      ],
      separator:
        'h-0.5 flex-1 rounded-full bg-border transition-colors data-[status=completed]:bg-primary',
      title:
        'text-sm leading-none font-medium whitespace-nowrap data-[status=inactive]:text-fg-muted',
      description: 'mt-0.5 text-xs text-fg-muted',
    },
  },
})

export type StepperStyles = typeof styles

export { useStyles }
