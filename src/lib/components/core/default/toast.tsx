"use client";

import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react";
import { Toaster as Toaster_, toast as toast_ } from "sonner";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";
import { Button } from "./button";

const toastVariants = tv({
  base: "text-sm w-full p-4 rounded-md bg-bg text-fg flex justify-between items-center gap-4 [&_svg]:size-4 shadow-md",
  variants: {
    type: {
      default: "border",
      success: "text-fg-success border border-border-success",
      warning: "text-fg-warning border border-border-warning",
      error: "text-fg-danger border border-border-danger",
      info: "text-fg-accent border border-border-accent",
    },
    muted: {
      true: "",
    },
    fill: {
      true: "",
    },
  },
  compoundVariants: [
    {
      type: "default",
      fill: true,
      className: "bg-bg-inverse text-fg-inverse border-none",
    },
    {
      type: "default",
      muted: true,
      className: "bg-bg-muted text-fg",
    },
    {
      type: "success",
      fill: true,
      className: "bg-bg-success text-fg-onSuccess border-none",
    },
    {
      type: "success",
      muted: true,
      className: "bg-bg-success-muted text-fg-onMutedSuccess",
    },
    {
      type: "warning",
      fill: true,
      className: "bg-bg-warning text-fg-onWarning border-none",
    },
    {
      type: "warning",
      muted: true,
      className: "bg-bg-warning-muted text-fg-onMutedWarning",
    },
    {
      type: "error",
      fill: true,
      className: "bg-bg-danger text-fg-onDanger border-none",
    },
    {
      type: "error",
      muted: true,
      className: "bg-bg-danger-muted text-fg-onMutedDanger",
    },
    {
      type: "info",
      fill: true,
      className: "bg-bg-accent text-fg-onInfo border-none",
    },
    {
      type: "info",
      muted: true,
      className: "bg-bg-accent-muted text-fg-onMutedInfo",
    },
  ],
  defaultVariants: {
    type: "default",
  },
});

const icons = {
  default: null,
  success: <CheckCircle2Icon />,
  warning: <AlertTriangleIcon />,
  error: <AlertCircleIcon />,
  info: <InfoIcon />,
};

const Toaster = () => {
  return (
    <Toaster_
      expand={false} // Toasts will be expanded by default.
      visibleToasts={3} // Amount of visible toasts.
      hotkey={["altKey", "KeyT"]} // Keyboard shortcut that will move focus to the toaster area.
      gap={14} // gap between toasts when expanded.
      position="bottom-right" // Default position of the toasts.
      offset="32px" // offset from the edges of the screen.
      dir="ltr" // direction of toast text
      toastOptions={{
        unstyled: true,
        className: "w-[calc(100%-32px)] lg:w-[var(--width)]",
      }}
    />
  );
};

type ToastOptions = {
  description?: string | React.ReactNode;
  variant?: "default" | "muted" | "fill";
  important?: boolean;
  duration?: number;
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
  dismissible?: boolean;
  icon?: React.ReactNode;
  id?: string | number;
  action?: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  onAutoClose?: () => void;
  onUndo?: () => void;
  showDismissButton?: boolean;
};

type ToastInternalFn = (
  message: string | React.ReactNode,
  type: "default" | "success" | "error" | "info" | "warning",
  data?: ToastOptions
) => string | number;

const toastMessage: ToastInternalFn = (
  message,
  type,
  options_ = { variant: "default" }
) => {
  const {
    variant = "default",
    description,
    dismissible = true,
    action,
    onUndo,
    showDismissButton = true,
    icon,
    ...options
  } = options_;

  return toast_.custom(
    (t) => (
      <div
        className={cn(
          toastVariants({
            type: type,
            muted: variant === "muted",
            fill: variant === "fill",
          }),
          !!action && "flex-col items-start justify-normal"
        )}
      >
        <div className="flex items-center gap-4">
          {icon ?? icons[type]}
          <div className="text-pretty break-all leading-normal">
            <div className="font-semibold">{message}</div>
            {description && (
              <div
                className={cn("text-fg-muted", {
                  "text-fg/70": variant === "fill",
                  "text-fg-inverse/70":
                    ["default", "warning"].includes(type) && variant == "fill",
                })}
              >
                {description}
              </div>
            )}
          </div>
        </div>
        {action ? (
          <div className="flex w-full items-center justify-end space-x-2">
            {showDismissButton && (
              <Button
                variant="ghost"
                size="sm"
                isDisabled={!dismissible}
                onPress={() => toast_.dismiss(t)}
              >
                Dismiss
              </Button>
            )}
            <Button type="primary" size="sm" onPress={action.onClick}>
              {action.label}
            </Button>
          </div>
        ) : (
          <div className="flex shrink-0 space-x-1">
            {onUndo && (
              <Button
                variant="ghost"
                shape="square"
                size="sm"
                className={cn("h-6 w-6", {
                  "text-fg-inverse active:bg-bg-inverse/20 hover:bg-bg-inverse/10":
                    ["default", "warning"].includes(type) && variant == "fill",
                })}
                onPress={onUndo}
              >
                <RotateCcwIcon />
              </Button>
            )}
            {showDismissButton && (
              <Button
                variant="ghost"
                shape="square"
                size="sm"
                className={cn("h-6 w-6", {
                  "text-fg-inverse active:bg-bg-inverse/20 hover:bg-bg-inverse/10":
                    ["default", "warning"].includes(type) && variant == "fill",
                })}
                isDisabled={!dismissible}
                onPress={() => toast_.dismiss(t)}
              >
                <XIcon />
              </Button>
            )}
          </div>
        )}
      </div>
    ),
    options
  );
};

const toast = Object.assign(
  (message: string | React.ReactNode, options?: ToastOptions) =>
    toastMessage(message, "default", options),
  {
    success: (message: string | React.ReactNode, options?: ToastOptions) =>
      toastMessage(message, "success", options),
    info: (message: string | React.ReactNode, options?: ToastOptions) =>
      toastMessage(message, "info", options),
    warning: (message: string | React.ReactNode, options?: ToastOptions) =>
      toastMessage(message, "warning", options),
    error: (message: string | React.ReactNode, options?: ToastOptions) =>
      toastMessage(message, "error", options),
  }
);

export { Toaster, toast };
