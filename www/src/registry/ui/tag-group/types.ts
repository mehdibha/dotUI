import * as TagGroupPrimitives from "react-aria-components/TagGroup";

/**
 * A tag group is a focusable list of labels, categories, keywords, filters, or other items,
 * with support for keyboard navigation, selection, and removal.
 */
export interface TagGroupProps extends TagGroupPrimitives.TagGroupProps {}

/**
 * A tag list is a container for tags within a TagGroup.
 */
export interface TagListProps<T> extends TagGroupPrimitives.TagListProps<T> {}

/**
 * A Tag is an individual item within a TagList.
 */
export interface TagProps extends TagGroupPrimitives.TagProps {}
