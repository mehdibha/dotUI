'use client'

import type * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'
import { tv } from 'tailwind-variants'

import { LinkButton } from '@/ui/button'
import type { LinkButtonProps } from '@/ui/button'
const paginationVariants = tv({
  slots: {
    root: 'mx-auto flex w-full justify-center',
    list: 'flex flex-row items-center gap-1',
    item: '',
    ellipsis:
      'flex size-8 items-center justify-center text-fg-muted [&_svg]:size-4',
  },
})

interface PaginationProps extends React.ComponentProps<'nav'> {}
const Pagination = ({ className, ...props }: PaginationProps) => {
  const { root } = paginationVariants()
  return (
    <nav
      aria-label="pagination"
      data-pagination=""
      className={root({ className })}
      {...props}
    />
  )
}

interface PaginationListProps extends React.ComponentProps<'ul'> {}
const PaginationList = ({ className, ...props }: PaginationListProps) => {
  const { list } = paginationVariants()
  return (
    <ul
      role="list"
      data-pagination-list=""
      className={list({ className })}
      {...props}
    />
  )
}

interface PaginationItemProps extends React.ComponentProps<'li'> {}
const PaginationItem = ({ className, ...props }: PaginationItemProps) => {
  const { item } = paginationVariants()
  return (
    <li data-pagination-item="" className={item({ className })} {...props} />
  )
}

interface PaginationLinkProps extends LinkButtonProps {
  isActive?: boolean
}
const PaginationLink = ({
  isActive,
  variant,
  isIconOnly = true,
  ...props
}: PaginationLinkProps) => {
  return (
    <LinkButton
      aria-current={isActive ? 'page' : undefined}
      data-pagination-link=""
      variant={variant ?? (isActive ? 'default' : 'quiet')}
      isIconOnly={isIconOnly}
      {...props}
    />
  )
}

interface PaginationPreviousProps extends Omit<
  PaginationLinkProps,
  'children'
> {
  children?: React.ReactNode
}
const PaginationPrevious = ({
  isIconOnly = false,
  children,
  ...props
}: PaginationPreviousProps) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      data-pagination-previous=""
      isIconOnly={isIconOnly}
      {...props}
    >
      <ChevronLeftIcon />
      {!isIconOnly && (
        <span className="hidden sm:inline">{children ?? 'Previous'}</span>
      )}
    </PaginationLink>
  )
}

interface PaginationNextProps extends Omit<PaginationLinkProps, 'children'> {
  children?: React.ReactNode
}
const PaginationNext = ({
  isIconOnly = false,
  children,
  ...props
}: PaginationNextProps) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      data-pagination-next=""
      isIconOnly={isIconOnly}
      {...props}
    >
      {!isIconOnly && (
        <span className="hidden sm:inline">{children ?? 'Next'}</span>
      )}
      <ChevronRightIcon />
    </PaginationLink>
  )
}

interface PaginationEllipsisProps extends React.ComponentProps<'span'> {}
const PaginationEllipsis = ({
  className,
  ...props
}: PaginationEllipsisProps) => {
  const { ellipsis } = paginationVariants()
  return (
    <span
      aria-hidden="true"
      data-pagination-ellipsis=""
      className={ellipsis({ className })}
      {...props}
    >
      <MoreHorizontalIcon />
    </span>
  )
}

export type {
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationListProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
}
export {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
}
