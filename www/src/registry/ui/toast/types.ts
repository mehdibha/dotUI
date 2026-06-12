import type {
  ToastManagerAddOptions,
  Toast as ToastPrimitive,
} from '@base-ui/react/toast'

export type ToastVariant =
  | 'neutral'
  | 'success'
  | 'error'
  | 'danger'
  | 'warning'
  | 'info'
  | 'loading'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ToastData {
  /**
   * Props forwarded to the root toast element.
   */
  rootProps?: Omit<
    ToastPrimitive.Root.Props,
    'children' | 'className' | 'swipeDirection' | 'toast'
  >
}

/**
 * Options for a toast, passed to the toast manager when adding it to the queue. These include the toast's title, description, type, timeout, and custom data.
 */
export interface ToastProps extends ToastManagerAddOptions<ToastData> {}
