'use client'

import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as LinkPrimitives from 'react-aria-components/Link'
import type { VariantProps } from 'tailwind-variants'

import { useStyles } from './styles'
import type { LinkStyles } from './styles'

// MARK: linkStyles

interface LinkProps
  extends LinkPrimitives.LinkProps, VariantProps<LinkStyles> {}

const Link = ({ variant, ...props }: LinkProps) => {
  const styles = useStyles()
  return (
    <LinkPrimitives.Link
      {...props}
      className={composeRenderProps(props.className, (className) =>
        styles({ variant, className }),
      )}
    />
  )
}

export type { LinkProps }
export { Link }
