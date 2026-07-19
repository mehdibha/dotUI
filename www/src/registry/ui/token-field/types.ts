import type { Ref } from 'react'

import type {
  TokenFieldProps as TokenFieldPrimitiveProps,
  TokenInputProps as TokenInputPrimitiveProps,
  TokenProps as TokenPrimitiveProps,
} from '@/registry/lib/react-aria-token-field'

/**
 * A token field lets users enter text with inline tokens — mentions, tags, or
 * object references. Use it to build AI prompt fields, tag inputs, structured
 * search fields, and mention inputs.
 *
 * The value is a `TokenSegmentList` of text and token segments; subclass it
 * and override `tokenize` to convert typed text into tokens automatically.
 * Built on the `TokenField` primitive vendored from React Aria's upcoming
 * release (adobe/react-spectrum#10318).
 */
export interface TokenFieldProps extends Omit<
  TokenFieldPrimitiveProps,
  'className' | 'style'
> {
  ref?: Ref<HTMLDivElement>
  className?: string
}

/**
 * The editable area of a `TokenField`: a content-editable surface that renders
 * the value's text and inline tokens.
 */
export interface TokenInputProps extends Omit<
  TokenInputPrimitiveProps,
  'children' | 'className' | 'style'
> {
  /** Text shown while the field is empty. */
  placeholder?: string
  className?: string
  /**
   * Renders each inline token. @default a `Token` with the segment's text
   */
  children?: TokenInputPrimitiveProps['children']
}

/** An inline token within a `TokenInput`. */
export interface TokenProps extends Omit<
  TokenPrimitiveProps,
  'className' | 'style'
> {
  className?: string
}
