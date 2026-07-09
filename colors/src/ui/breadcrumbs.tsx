'use client'

import { ChevronRightIcon } from 'lucide-react'
import * as BreadcrumbsPrimitive from 'react-aria-components/Breadcrumbs'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import { tv } from 'tailwind-variants'
const breadcrumbsVariants = tv({
  slots: {
    root: 'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-fg-muted',
    item: 'inline-flex items-center gap-1',
    link: [
      'focus-reset focus-visible:focus-ring',
      'inline-flex items-center gap-1 rounded px-0.5 leading-none transition-colors disabled:cursor-default disabled:not-current:text-fg-disabled current:text-fg hover:[a]:text-fg',
    ],
    separator: '[&_svg]:size-4',
  },
})

interface BreadcrumbsProps<
  T extends object,
> extends BreadcrumbsPrimitive.BreadcrumbsProps<T> {
  ref?: React.RefObject<HTMLOListElement>
}
const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) => {
  const { root } = breadcrumbsVariants()
  return (
    <BreadcrumbsPrimitive.Breadcrumbs
      data-breadcrumbs=""
      className={root({ className })}
      {...props}
    />
  )
}

interface BreadcrumbItemProps extends React.ComponentProps<
  typeof BreadcrumbsPrimitive.Breadcrumb
> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
  const { item } = breadcrumbsVariants()
  return (
    <BreadcrumbsPrimitive.Breadcrumb
      data-breadcrumb-item=""
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    />
  )
}

interface BreadcrumbLinkProps extends React.ComponentProps<
  typeof BreadcrumbsPrimitive.Link
> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
  const { link } = breadcrumbsVariants()
  return (
    <BreadcrumbsPrimitive.Link
      data-breadcrumb-link=""
      className={composeRenderProps(className, (className) =>
        link({ className }),
      )}
      {...props}
    />
  )
}

interface BreadcrumbSeparatorProps extends React.ComponentProps<'span'> {}
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  const { separator } = breadcrumbsVariants()
  return (
    <span
      data-breadcrumb-separator=""
      aria-hidden="true"
      className={separator({ className })}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </span>
  )
}

export type {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbSeparatorProps,
  BreadcrumbsProps,
}
export { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs }
