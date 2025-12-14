import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
} from "react-aria-components";

/**
 * A tag group is a focusable list of labels, categories, keywords, filters, or other items,
 * with support for keyboard navigation, selection, and removal.
 */
export interface TagGroupProps extends AriaTagGroupProps {}

/**
 * A tag list is a container for tags within a TagGroup.
 */
export interface TagListProps<T> extends AriaTagListProps<T> {}

/**
 * A Tag is an individual item within a TagList.
 */
export interface TagProps extends AriaTagProps {}
