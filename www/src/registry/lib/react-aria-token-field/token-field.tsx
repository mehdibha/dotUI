/*
 * Vendored from adobe/react-spectrum#10318 (react-aria-components TokenField),
 * unreleased as of react-aria-components 1.19. Delete this module and import
 * from react-aria-components/TokenField once it ships. Adapted to the published
 * 1.19 API: `useSlot` is inlined (unpublished internal) and the `dom.*` element
 * factory is replaced with plain elements.
 *
 * Copyright 2026 Adobe. Licensed under the Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0
 */

'use client'

import * as React from 'react'
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  ForwardedRef,
  HTMLAttributes,
  RefCallback,
  RefObject,
} from 'react'
import { FieldInputContext } from 'react-aria-components/Autocomplete'
import { LabelContext } from 'react-aria-components/Label'
import {
  Provider,
  useContextProps,
  useSlottedContext,
} from 'react-aria-components/slots'
import type { ContextValue, SlotProps } from 'react-aria-components/slots'
import { TextContext } from 'react-aria-components/Text'
import { useRenderProps } from 'react-aria-components/useRenderProps'
import type {
  RenderProps,
  StyleRenderProps,
} from 'react-aria-components/useRenderProps'
import { filterDOMProps } from 'react-aria/filterDOMProps'
import { mergeProps } from 'react-aria/mergeProps'
import { mergeRefs } from 'react-aria/mergeRefs'
import { createHideableComponent } from 'react-aria/private/collections/Hidden'
import { useLayoutEffect } from 'react-aria/private/utils/useLayoutEffect'
import { useFocusRing } from 'react-aria/useFocusRing'
import { useHover } from 'react-aria/useHover'
import type { HoverProps } from 'react-aria/useHover'
import { useObjectRef } from 'react-aria/useObjectRef'

import type { TokenSegment, TokenSegmentList } from './segment-list'
import { useTokenFieldState } from './state'
import type { TokenFieldState } from './state'
import { useToken, useTokenField } from './use-token-field'
import type { AriaTokenFieldProps } from './use-token-field'

// Generic-preserving forwardRef, mirroring RAC's internal forwardRefType.
type forwardRefType = <T, P = object>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null

// Inlined from RAC's internal utils (unpublished): detects whether a slotted
// element (e.g. a Label) actually rendered.
function useSlot(
  initialState: boolean | (() => boolean) = true,
): [RefCallback<Element>, boolean] {
  let [hasSlot, setHasSlot] = useState(initialState)
  let hasRun = useRef(false)

  let ref = useCallback((el: Element | null) => {
    hasRun.current = true
    setHasSlot(!!el)
  }, [])

  useLayoutEffect(() => {
    if (!hasRun.current) {
      setHasSlot(false)
    }
  }, [])

  return [ref, hasSlot]
}

// MARK: TokenField

export interface TokenFieldRenderProps {
  /**
   * Whether the token field is disabled.
   *
   * @selector [data-disabled]
   */
  isDisabled: boolean
  /**
   * Whether the token field is read only.
   *
   * @selector [data-readonly]
   */
  isReadOnly: boolean
}

export interface TokenFieldProps<T extends TokenSegmentList = TokenSegmentList>
  extends
    AriaTokenFieldProps<T>,
    RenderProps<TokenFieldRenderProps>,
    SlotProps {}

export interface TokenInputRenderProps {
  /**
   * Whether the token input is currently hovered with a mouse.
   *
   * @selector [data-hovered]
   */
  isHovered: boolean
  /**
   * Whether the token input is focused, either via a mouse or keyboard.
   *
   * @selector [data-focused]
   */
  isFocused: boolean
  /**
   * Whether the token input is keyboard focused.
   *
   * @selector [data-focus-visible]
   */
  isFocusVisible: boolean
  /**
   * Whether the token input is disabled.
   *
   * @selector [data-disabled]
   */
  isDisabled: boolean
  /**
   * Whether the token input is read only.
   *
   * @selector [data-readonly]
   */
  isReadOnly: boolean
}

export interface TokenInputProps<T extends TokenSegmentList = TokenSegmentList>
  extends HoverProps, StyleRenderProps<TokenInputRenderProps>, SlotProps {
  /** A function that renders a token for each token segment in the token field. */
  children: (
    segment: TokenSegment<T extends TokenSegmentList<infer V> ? V : never>,
  ) => React.ReactElement
}

interface TokenInputContextValue {
  tokenFieldProps: HTMLAttributes<HTMLDivElement>
  state: TokenFieldState
  isDisabled: boolean
  isReadOnly: boolean
  autocompleteProps?: HTMLAttributes<HTMLDivElement>
  ref: RefObject<HTMLDivElement | null>
}

export const TokenFieldContext =
  createContext<ContextValue<TokenFieldProps, HTMLDivElement>>(null)
const TokenInputContext = createContext<TokenInputContextValue | null>(null)

/**
 * A token field allows users to enter text with inline tokens. Use it to build AI prompt fields,
 * tag inputs, structured search fields, mention inputs, and multi-select comboboxes.
 */
export const TokenField = /*#__PURE__*/ createHideableComponent(
  function TokenField<T extends TokenSegmentList = TokenSegmentList>(
    props: TokenFieldProps<T>,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    ;[props, ref] = useContextProps(
      props as unknown as TokenFieldProps,
      ref,
      TokenFieldContext,
    ) as unknown as [TokenFieldProps<T>, ForwardedRef<HTMLDivElement>]
    let [labelRef, label] = useSlot(
      !props['aria-label'] && !props['aria-labelledby'],
    )

    let fieldCtx = useSlottedContext(FieldInputContext, props.slot)
    let {
      value: _autocompleteValue,
      onChange: onAutocompleteChange,
      ref: autocompleteRef,
      ...autocompleteProps
    } = (fieldCtx ?? {}) as HTMLAttributes<HTMLDivElement> & {
      value?: string
      onChange?: (value: string) => void
      ref?: ForwardedRef<HTMLDivElement>
    }
    let inputRef = useObjectRef(autocompleteRef)

    let isDisabled = props.isDisabled || false
    let isReadOnly = props.isReadOnly || false

    let state = useTokenFieldState<T>({
      ...props,
      onChange: (value: T) => {
        props.onChange?.(value)
        onAutocompleteChange?.(value.toString())
      },
    })

    let { tokenFieldProps, labelProps, descriptionProps } = useTokenField(
      {
        ...props,
        // @ts-expect-error - not a public prop, used to determine if the label slot is present
        label,
        role:
          props.role ||
          (autocompleteProps.role as TokenFieldProps['role']) ||
          'textbox',
      },
      state,
      inputRef,
    )

    let renderProps = useRenderProps({
      ...props,
      values: {
        isDisabled,
        isReadOnly,
      },
      defaultClassName: 'react-aria-TokenField',
    })

    let DOMProps = filterDOMProps(
      props as Parameters<typeof filterDOMProps>[0],
      {
        global: true,
      },
    )

    return (
      <div
        {...DOMProps}
        {...renderProps}
        ref={ref}
        slot={props.slot || undefined}
        data-disabled={isDisabled || undefined}
        data-readonly={isReadOnly || undefined}
      >
        <Provider
          values={[
            [
              LabelContext,
              { ...labelProps, elementType: 'span', ref: labelRef },
            ],
            [
              TextContext,
              {
                slots: {
                  description: descriptionProps,
                },
              },
            ],
            [
              TokenInputContext,
              {
                tokenFieldProps,
                state: state as unknown as TokenFieldState,
                isDisabled,
                isReadOnly,
                autocompleteProps:
                  autocompleteProps as HTMLAttributes<HTMLDivElement>,
                ref: inputRef as RefObject<HTMLDivElement | null>,
              },
            ],
          ]}
        >
          {renderProps.children}
        </Provider>
      </div>
    )
  },
)

// MARK: TokenInput

/**
 * A token input represents the editable area within a token field.
 */
export const TokenInput = /*#__PURE__*/ (forwardRef as forwardRefType)(
  function TokenInput<T extends TokenSegmentList = TokenSegmentList>(
    props: TokenInputProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement | null>,
  ) {
    let {
      tokenFieldProps,
      state,
      isDisabled = false,
      isReadOnly = false,
      autocompleteProps,
      ref: contextRef,
    } = useContext(TokenInputContext)!
    let ref = useMemo(
      () => mergeRefs(contextRef, forwardedRef),
      [contextRef, forwardedRef],
    )
    let { children, ...domProps } = props

    let { isHovered, hoverProps } = useHover(domProps)
    let { isFocused, isFocusVisible, focusProps } = useFocusRing()

    let renderProps = useRenderProps({
      ...domProps,
      defaultClassName: 'react-aria-TokenInput',
      values: {
        isHovered,
        isFocused,
        isFocusVisible,
        isDisabled,
        isReadOnly,
      },
    })

    let DOMProps = filterDOMProps(
      domProps as Parameters<typeof filterDOMProps>[0],
      {
        global: true,
      },
    )

    return (
      <div
        {...mergeProps(
          DOMProps,
          renderProps,
          focusProps,
          hoverProps,
          tokenFieldProps,
          autocompleteProps,
        )}
        ref={ref}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-disabled={isDisabled || undefined}
        data-readonly={isReadOnly || undefined}
        style={{ ...renderProps.style, ...tokenFieldProps.style }}
      >
        <CompositionRenderBlocker isComposing={state.isComposing}>
          {state.value.segments.map((v, i) => {
            switch (v.type) {
              case 'token': {
                let token = children(
                  v as TokenSegment<
                    T extends TokenSegmentList<infer V> ? V : never
                  >,
                )
                return (
                  // Wrap tokens in zero-width spaces so the cursor is placed correctly.
                  <span key={i}>
                    {'\u200b'}
                    {token}
                    {'\u200b'}
                  </span>
                )
              }
              case 'text':
                return v.text
            }
          })}
          {/* Force cursor to the next line if the last segment ends with a newline. */}
          {state.value.segments.at(-1)?.text.endsWith('\n') && <br />}
        </CompositionRenderBlocker>
      </div>
    )
  },
)

// MARK: Token

export interface TokenRenderProps {
  /**
   * Whether the token is selected.
   *
   * @selector [data-selected]
   */
  isSelected: boolean
  /**
   * Whether the token is disabled.
   *
   * @selector [data-disabled]
   */
  isDisabled: boolean
}

export interface TokenProps extends RenderProps<TokenRenderProps> {}

/**
 * A token represents an inline segment within a token field.
 */
export const Token = forwardRef(function Token(
  props: TokenProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  let { isDisabled } = useContext(TokenInputContext)!
  let objectRef = useObjectRef(ref)
  let { tokenProps, isSelected } = useToken(objectRef)

  let renderProps = useRenderProps({
    ...props,
    defaultClassName: 'react-aria-Token',
    values: {
      isSelected,
      isDisabled,
    },
  })

  let DOMProps = filterDOMProps(props as Parameters<typeof filterDOMProps>[0], {
    global: true,
  })

  return (
    <span
      ref={objectRef}
      {...mergeProps(DOMProps, renderProps, tokenProps)}
      data-selected={isSelected || undefined}
      data-disabled={isDisabled || undefined}
      style={{
        ...renderProps.style,
        ...tokenProps.style,
      }}
    >
      {renderProps.children}
    </span>
  )
})

// Prevents React from re-rendering during composition events.
const CompositionRenderBlocker = memo(
  ({ children }: { children: React.ReactNode; isComposing: boolean }) =>
    children,
  (prevProps, nextProps) =>
    nextProps.isComposing ? true : prevProps.children === nextProps.children,
)
