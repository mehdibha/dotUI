import type { ReactNode } from 'react'
import type { Key } from 'react-aria-components/Menu'

import type { PopoverProps } from '@/registry/ui/popover'

/**
 * A mention input lets users type a trigger character (like `@`) to open an
 * inline list of suggestions and insert one as a token in the text.
 *
 * `Mention` wires the behaviour onto composed primitives — a `TextField` +
 * `TextArea` for the input, a `Popover` + `Menu`/`MenuItem` for the
 * suggestions — by injecting their props through context, so no bespoke
 * sub-components are needed.
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
  /** Where the suggestions popover is placed relative to the caret. @default "bottom start" */
  placement?: PopoverProps['placement']
  className?: string
  children?: ReactNode
}
