'use client'

import * as React from 'react'

import {
  Token as TokenPrimitive,
  TokenField as TokenFieldPrimitive,
  TokenInput as TokenInputPrimitive,
  TokenSegmentList,
} from '@/registry/lib/react-aria-token-field'
import type {
  TokenFieldProps as TokenFieldPrimitiveProps,
  TokenInputProps as TokenInputPrimitiveProps,
  TokenProps as TokenPrimitiveProps,
} from '@/registry/lib/react-aria-token-field'

import { useStyles } from './styles'

// MARK: tokenFieldStyles

// MARK: TokenField

interface TokenFieldProps extends Omit<
  TokenFieldPrimitiveProps,
  'className' | 'style'
> {
  ref?: React.Ref<HTMLDivElement>
  className?: string
}

/**
 * A token field lets users enter text with inline tokens — mentions, tags, or
 * object references. The field root provides the label and description slots;
 * compose a `TokenInput` for the editable area, and a `Label` before it when
 * you want a visible label.
 */
function TokenField({ className, ...props }: TokenFieldProps) {
  const { root } = useStyles()()
  return <TokenFieldPrimitive className={root({ className })} {...props} />
}

// MARK: TokenInput

interface TokenInputProps extends Omit<
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

/**
 * The editable area of a `TokenField`: a content-editable surface that renders
 * the value's text and inline tokens. Tokens render as `Token`s unless a
 * render function is provided.
 */
function TokenInput({
  placeholder,
  className,
  children,
  ...props
}: TokenInputProps) {
  const { input } = useStyles()()
  return (
    <TokenInputPrimitive
      data-token-input=""
      data-placeholder={placeholder}
      className={input({ className })}
      {...props}
    >
      {children ?? ((segment) => <Token>{segment.text}</Token>)}
    </TokenInputPrimitive>
  )
}

// MARK: Token

interface TokenProps extends Omit<TokenPrimitiveProps, 'className' | 'style'> {
  className?: string
}

/** An inline token within a `TokenInput`. */
function Token({ className, ...props }: TokenProps) {
  const { token } = useStyles()()
  return <TokenPrimitive className={token({ className })} {...props} />
}

// MARK: exports

export type { TokenFieldProps, TokenInputProps, TokenProps }
export { Token, TokenField, TokenInput, TokenSegmentList }
