import type { ReactNode } from 'react'
import type { Key } from 'react-aria-components/Menu'

import type {
  TokenFieldProps,
  TokenInputProps,
  TokenProps,
} from '@/registry/lib/token-field'
import type { PopoverProps } from '@/registry/ui/popover'

/**
 * A mention input lets users type a trigger character (like `@` or `/`) to
 * open an inline list of suggestions and insert one as an inline token.
 *
 * `Mention` wires the behaviour onto the `TokenField` primitive — a
 * `MentionInput` for the editable area, a `Popover` + `Menu`/`MenuItem` for
 * the suggestions — by injecting their props through context. The value is a
 * `TokenSegmentList` of text and token segments.
 */
export interface MentionProps extends Omit<
  TokenFieldProps,
  'children' | 'className' | 'style' | 'role' | 'slot'
> {
  /**
   * The character(s) that open the suggestions list: a string for a single
   * trigger, or a regular expression matching several (e.g. `/[@/]/` for
   * `@`-mentions and `/`-commands). @default "@"
   */
  trigger?: string | RegExp
  /**
   * Maps the key of a selected item to the text inserted after the trigger
   * character. @default String(key)
   */
  getItemText?: (key: Key) => string
  /** Where the suggestions popover is placed relative to the caret. @default "bottom start" */
  placement?: PopoverProps['placement']
  className?: string
  /**
   * The composed input and suggestions. A function receives the active trigger
   * and query, so the suggestions can depend on which trigger the user typed.
   */
  children?: ReactNode | ((state: MentionState) => ReactNode)
}

/** The active mention passed to a `Mention`'s render-function children. */
export interface MentionState {
  /** The trigger text that opened the suggestions (e.g. `"@"` or `"/"`), or null while closed. */
  trigger: string | null
  /** The text typed after the trigger. */
  query: string
}

/**
 * The editable area of a `Mention`: a content-editable surface that renders
 * the value's text and inline tokens.
 */
export interface MentionInputProps extends Omit<
  TokenInputProps,
  'children' | 'className' | 'style'
> {
  /** Text shown while the field is empty. */
  placeholder?: string
  className?: string
  /**
   * Renders each inline token. @default a `MentionToken` with the token's text
   */
  children?: TokenInputProps['children']
}

/** An inline token within a `MentionInput`. */
export interface MentionTokenProps extends Omit<
  TokenProps,
  'className' | 'style'
> {
  className?: string
}
