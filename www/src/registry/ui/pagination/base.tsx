'use client'

import type * as React from 'react'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from '@/registry/icons'
import { LinkButton } from '@/registry/ui/button'
import type { LinkButtonProps } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: Pagination

interface PaginationProps extends React.ComponentProps<'nav'> {}
const Pagination = ({ className, ...props }: PaginationProps) => {
  const { root } = useStyles()()
  return (
    <nav
      aria-label="pagination"
      data-pagination=""
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: PaginationList

interface PaginationListProps extends React.ComponentProps<'ul'> {}
const PaginationList = ({ className, ...props }: PaginationListProps) => {
  const { list } = useStyles()()
  return (
    <ul
      role="list"
      data-pagination-list=""
      className={list({ className })}
      {...props}
    />
  )
}

// MARK: PaginationItem

interface PaginationItemProps extends React.ComponentProps<'li'> {}
const PaginationItem = ({ className, ...props }: PaginationItemProps) => {
  const { item } = useStyles()()
  return (
    <li data-pagination-item="" className={item({ className })} {...props} />
  )
}

// MARK: PaginationLink

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

// MARK: PaginationPrevious

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

// MARK: PaginationNext

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

// MARK: PaginationEllipsis

interface PaginationEllipsisProps extends React.ComponentProps<'span'> {}
const PaginationEllipsis = ({
  className,
  ...props
}: PaginationEllipsisProps) => {
  const { ellipsis } = useStyles()()
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
