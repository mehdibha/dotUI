import type * as React from 'react'
import type { VariantProps } from 'tailwind-variants'

import { useStyles } from './styles'
import type { BadgeStyles } from './styles'

// MARK: badgeStyles

interface BadgeProps
  extends React.ComponentProps<'span'>, VariantProps<BadgeStyles> {}
const Badge = ({
  className,
  appearance,
  variant,
  size,
  ...props
}: BadgeProps) => {
  const styles = useStyles()
  return (
    <span
      role="presentation"
      data-badge=""
      className={styles({ appearance, variant, size, className })}
      {...props}
    />
  )
}

export type { BadgeProps }
export { Badge }
