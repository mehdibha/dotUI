/*
 * Vendored from adobe/react-spectrum#10318 (react-stately useTokenFieldState),
 * unreleased as of react-aria-components 1.19. Delete this module and import
 * from react-aria-components/TokenField once it ships.
 *
 * Copyright 2026 Adobe. Licensed under the Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import { useState } from 'react'
import { useControlledState } from 'react-stately/useControlledState'

import { TokenSegmentList } from './segment-list'

export interface TokenFieldStateProps<
  T extends TokenSegmentList = TokenSegmentList,
> {
  /** The current value (controlled). */
  value?: T
  /** The default value (uncontrolled). */
  defaultValue?: T
  /** Handler that is called when the value changes. */
  onChange?: (value: T) => void
}

export interface TokenFieldState<
  T extends TokenSegmentList = TokenSegmentList,
> {
  /** The current value of the token field. */
  value: T
  /** Sets the value of the token field. */
  setValue: (fn: T | ((value: T) => T)) => void
  /** Whether the token field is composing. */
  isComposing: boolean
  /** Sets the composing state of the token field. */
  setComposing: (isComposing: boolean) => void
}

export function useTokenFieldState<
  T extends TokenSegmentList = TokenSegmentList,
>(props: TokenFieldStateProps<T>): TokenFieldState<T> {
  let {
    value: valueProp,
    defaultValue: defaultValueProp = new TokenSegmentList([]) as T,
    onChange,
  } = props

  let [value, setValue] = (
    useControlledState as (
      value: T | undefined,
      defaultValue: T,
      onChange?: (value: T) => void,
    ) => [T, TokenFieldState<T>['setValue']]
  )(valueProp, defaultValueProp, onChange)
  let [isComposing, setComposing] = useState(false)

  return {
    value,
    setValue,
    isComposing,
    setComposing,
  }
}
