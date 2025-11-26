import type { ToastProps as AriaToastProps } from "react-aria-components";

export interface Toast {
  title: string;
  description?: string;
  /**
   * The visual style of the toast.
   * @default 'neutral'
   */
  variant?: "success" | "error" | "warning" | "info" | "neutral" | "danger";
}

export interface ToastProps extends AriaToastProps<Toast> {}
