import type * as GridListPrimitives from 'react-aria-components/GridList'
import type * as SearchFieldPrimitives from 'react-aria-components/SearchField'
import type * as SelectPrimitives from 'react-aria-components/Select'

/** An emoji as reported by `onEmojiSelect` and the picker footer. */
export interface Emoji {
  /** The emoji character, with the active skin tone applied. */
  emoji: string
  /** The emoji's display name, e.g. "grinning face". */
  label: string
  /** The emoji's unicode hexcode, stable across skin tones. */
  hexcode: string
}

/** The skin tone applied to emojis that support one. */
export type EmojiSkinTone =
  | 'none'
  | 'light'
  | 'medium-light'
  | 'medium'
  | 'medium-dark'
  | 'dark'

/**
 * An emoji picker lets users browse, search and select an emoji, with support
 * for skin tones and keyboard navigation.
 */
export interface EmojiPickerProps extends Omit<
  React.ComponentProps<'div'>,
  'onSelect'
> {
  /** Handler called when the user picks an emoji. */
  onEmojiSelect?: (emoji: Emoji) => void
  /** The active skin tone (controlled). */
  skinTone?: EmojiSkinTone
  /**
   * The initial skin tone (uncontrolled).
   * @default 'none'
   */
  defaultSkinTone?: EmojiSkinTone
  /** Handler called when the active skin tone changes. */
  onSkinToneChange?: (skinTone: EmojiSkinTone) => void
}

/**
 * A search field that filters the emoji grid by name and keywords.
 */
export interface EmojiPickerSearchProps extends React.ComponentProps<
  typeof SearchFieldPrimitives.SearchField
> {
  /**
   * The placeholder text of the search input.
   * @default 'Search emojis'
   */
  placeholder?: string
}

/**
 * The scrollable emoji grid, grouped by category.
 */
export interface EmojiPickerContentProps extends Omit<
  GridListPrimitives.GridListProps<object>,
  'children' | 'items' | 'layout'
> {}

/**
 * A select that changes the skin tone applied to emojis in the grid.
 */
export interface EmojiPickerSkinToneSelectorProps extends Omit<
  SelectPrimitives.SelectProps<object>,
  'children' | 'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange'
> {}

/**
 * Footer previewing the hovered or focused emoji and its name.
 */
export interface EmojiPickerFooterProps extends React.ComponentProps<'div'> {}
