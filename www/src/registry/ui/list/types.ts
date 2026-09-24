import type * as GridListPrimitives from "react-aria-components/GridList"

/**
 * A list displays rows of content — navigation, settings, choices — grouped
 * on rounded cards or as plain full-bleed rows.
 */
export interface ListProps<T> extends GridListPrimitives.GridListProps<T> {}

/**
 * A row of a List. Compose `ListItemIcon`, `ListItemLabel`,
 * `ListItemDescription` and `ListItemValue`; a plain string becomes the label.
 */
export interface ListItemProps<
  T,
> extends GridListPrimitives.GridListItemProps<T> {
  /**
   * The color treatment of the row. `accent` rows are actions, drawn in the
   * link color.
   * @default 'default'
   */
  variant?: "default" | "accent" | "danger"
  /**
   * Whether the row shows a trailing chevron. Defaults to true for rows with
   * an `href`.
   */
  hasChevron?: boolean
}

/** The leading icon or avatar of a row. */
export interface ListItemIconProps extends React.ComponentProps<"span"> {}

/** The primary text of a row. */
export interface ListItemLabelProps extends React.ComponentProps<"span"> {}

/** Secondary text under the label. */
export interface ListItemDescriptionProps extends React.ComponentProps<"span"> {}

/** Trailing content: a value, a badge, a switch. */
export interface ListItemValueProps extends React.ComponentProps<"span"> {}

/** A group of rows. */
export interface ListSectionProps<
  T,
> extends GridListPrimitives.GridListSectionProps<T> {}

/** The heading of a ListSection. */
export interface ListSectionHeaderProps extends React.ComponentProps<
  typeof GridListPrimitives.GridListHeader
> {}
