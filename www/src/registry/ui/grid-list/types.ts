import type * as GridListPrimitives from 'react-aria-components/GridList'
import type * as TextPrimitives from 'react-aria-components/Text'

/**
 * A grid list displays a list of interactive items, with support for keyboard
 * navigation, single or multiple selection, and row actions.
 */
export interface GridListProps<T> extends GridListPrimitives.GridListProps<T> {
  /**
   * Whether the grid list is in a loading state. Renders a loader directly
   * after the items.
   */
  isLoading?: boolean
  /** Handler that is called when more items should be loaded, e.g. while scrolling near the bottom. */
  onLoadMore?: () => void
}

/**
 * A GridListItem represents an individual item in a GridList.
 */
export interface GridListItemProps<
  T,
> extends GridListPrimitives.GridListItemProps<T> {}

/**
 * The main label of a GridListItem.
 */
export interface GridListItemLabelProps extends React.ComponentProps<
  typeof TextPrimitives.Text
> {}

/**
 * Secondary text rendered below a GridListItem label.
 */
export interface GridListItemDescriptionProps extends React.ComponentProps<
  typeof TextPrimitives.Text
> {}

/**
 * A GridListSection groups related items within a GridList.
 */
export interface GridListSectionProps<
  T,
> extends GridListPrimitives.GridListSectionProps<T> {}

/**
 * Header rendered at the top of a GridListSection.
 */
export interface GridListSectionHeaderProps extends React.ComponentProps<
  typeof GridListPrimitives.GridListHeader
> {}
