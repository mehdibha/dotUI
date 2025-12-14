import type { ToastProps as AriaToastProps } from "react-aria-components";

/**
 * Missing description.
 */
export interface Toast {
  title: string;
  description?: string;
  /**
   * The visual style of the toast.
   * @default 'neutral'
   */
  variant?: "success" | "error" | "warning" | "info" | "neutral" | "danger";
}

/**
 * A Toast displays a brief, temporary notification of actions, errors, or other events in an application.
 */
export interface ToastProps extends AriaToastProps<Toast> {}
