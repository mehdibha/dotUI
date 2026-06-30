import { createStyles } from '@/lib/styles'

import onboardingTourMeta from './meta'

const { useStyles, styles } = createStyles(onboardingTourMeta, {
  base: {
    slots: {
      // Applied to driver.js' `.driver-popover` via the `popoverClass` option so
      // the coachmark bubble inherits the design system's surface, text and radius
      // tokens. The selectors reach into driver.js' own popover DOM (title,
      // description, footer, nav buttons) which it renders inside `.driver-popover`.
      popover: [
        'rounded-(--onboarding-tour-radius) border bg-popover text-fg shadow-lg',
        '[&_.driver-popover-title]:font-medium [&_.driver-popover-title]:text-fg',
        '[&_.driver-popover-description]:text-fg-muted',
        '[&_.driver-popover-progress-text]:text-fg-muted',
        '[&_.driver-popover-arrow]:hidden',
        '[&_.driver-popover-close-btn]:text-fg-muted [&_.driver-popover-close-btn]:hover:text-fg',
        '[&_.driver-popover-footer_button]:rounded-(--btn-radius) [&_.driver-popover-footer_button]:border [&_.driver-popover-footer_button]:bg-bg [&_.driver-popover-footer_button]:text-fg [&_.driver-popover-footer_button]:shadow-none [&_.driver-popover-footer_button]:hover:bg-muted',
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type OnboardingTourStyles = typeof styles

export { useStyles }
