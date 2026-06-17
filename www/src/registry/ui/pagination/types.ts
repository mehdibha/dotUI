import type * as LinkPrimitives from 'react-aria-components/Link'

/**
 * Pagination lets users navigate through large sets of content split across
 * multiple pages. It renders a `nav` landmark labelled "pagination".
 */
export interface PaginationProps extends React.ComponentProps<'nav'> {}

/**
 * The list that holds the pagination items.
 */
export interface PaginationListProps extends React.ComponentProps<'ul'> {}

/**
 * A single item in the pagination list.
 */
export interface PaginationItemProps extends React.ComponentProps<'li'> {}

/**
 * A pagination link. Provide an `href` to navigate, or an `onPress` handler to
 * drive client-side state. Built on top of the Link button, so it shares its
 * `variant` and `size`.
 */
export interface PaginationLinkProps extends React.ComponentProps<
  typeof LinkPrimitives.Link
> {
  /**
   * Whether this link represents the current page. Sets `aria-current="page"`
   * and switches to the active visual style.
   */
  isActive?: boolean

  /**
   * The visual style of the link.
   * @default isActive ? 'default' : 'quiet'
   */
  variant?: 'default' | 'primary' | 'quiet' | 'link' | 'warning' | 'danger'

  /**
   * The size of the link.
   * @default "md"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'

  /**
   * Render the link as a square cell sized like an icon button. Page numbers
   * use this; `PaginationPrevious`/`PaginationNext` opt out by default.
   * @default true
   */
  isIconOnly?: boolean
}

/**
 * A link that navigates to the previous page. Renders a leading chevron and,
 * unless `isIconOnly` is set, a "Previous" label hidden on small screens.
 */
export interface PaginationPreviousProps extends Omit<
  PaginationLinkProps,
  'children'
> {
  /** Overrides the default "Previous" label. */
  children?: React.ReactNode
}

/**
 * A link that navigates to the next page. Renders a trailing chevron and,
 * unless `isIconOnly` is set, a "Next" label hidden on small screens.
 */
export interface PaginationNextProps extends Omit<
  PaginationLinkProps,
  'children'
> {
  /** Overrides the default "Next" label. */
  children?: React.ReactNode
}

/**
 * A non-interactive indicator for a gap of skipped pages.
 */
export interface PaginationEllipsisProps extends React.ComponentProps<'span'> {}
