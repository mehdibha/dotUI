import type { ReactNode } from 'react'
import type { Key } from 'react-aria-components/Menu'

import type { TextAreaProps } from '@/registry/ui/input'
import type { MenuContentProps, MenuItemProps } from '@/registry/ui/menu'
import type { PopoverProps } from '@/registry/ui/popover'

/**
 * A mention input lets users type a trigger character (like `@`) to open an
 * inline list of suggestions and insert one as a token in the text.
 */
export interface MentionProps {
  /** The character that opens the suggestions list. @default "@" */
  trigger?: string
  /** The text value (controlled). */
  value?: string
  /** The default text value (uncontrolled). */
  defaultValue?: string
  /** Handler called when the text value changes. */
  onChange?: (value: string) => void
  /**
   * Maps the key of a selected item to the text inserted after the trigger
   * character. @default String(key)
   */
  getItemText?: (key: Key) => string
  className?: string
  children?: ReactNode
}

/**
 * The text area users type into. Renders a label and description when provided.
 */
export interface MentionInputProps extends Omit<
  TextAreaProps,
  'value' | 'defaultValue' | 'onChange'
> {
  /** A label rendered above the input. */
  label?: ReactNode
  /** A description rendered below the input. */
  description?: ReactNode
  /** Class name applied to the surrounding field wrapper. */
  fieldClassName?: string
}

/**
 * The popover and list of suggestions, anchored at the trigger character.
 */
export interface MentionListProps<T extends object> extends Omit<
  MenuContentProps<T>,
  'onAction'
> {
  /** Where the popover is placed relative to the caret. @default "bottom start" */
  placement?: PopoverProps['placement']
  /** Called with the key of the selected item. */
  onAction?: (key: Key) => void
}

/**
 * A single suggestion shown in the list.
 */
export interface MentionItemProps<T extends object> extends MenuItemProps<T> {}
