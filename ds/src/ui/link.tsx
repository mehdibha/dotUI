'use client'

import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as LinkPrimitives from 'react-aria-components/Link'
import { type VariantProps, tv } from 'tailwind-variants'
const linkVariants = tv({
  base: [
    'focus-reset focus-visible:focus-ring',
    'inline-flex items-center gap-1 transition-colors disabled:text-fg-disabled',
  ],
  variants: {
    variant: {
      accent: 'text-fg-accent',
      quiet: 'font-medium text-fg underline underline-offset-2',
      unstyled: '',
    },
  },
  defaultVariants: {
    variant: 'accent',
  },
})

interface LinkProps
  extends LinkPrimitives.LinkProps, VariantProps<typeof linkVariants> {}

const Link = ({ variant, ...props }: LinkProps) => {
  const styles = linkVariants
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
