import * as React from "react";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";

const alertVariants = tv({
  slots: {
    root: "rounded-lg border p-4 flex items-center gap-4",
    title: "font-medium leading-normal tracking-tight mr-1",
    content: "text-sm",
  },
  variants: {
    type: {
      default: { root: "border text-fg" },
      success: { root: "text-fg-success border border-border-success" },
      warning: { root: "text-fg-warning border border-border-warning" },
      danger: { root: "text-fg-danger border border-border-danger" },
      info: { root: "text-fg-info border border-border-info" },
    },
    variant: {
      default: {},
      muted: {},
      fill: {},
    },
  },
  compoundSlots: [
    {
      slots: ["root"],
      type: "default",
      variant: "fill",
      className: "bg-bg-inverse text-fg-inverse border-none",
    },
    {
      slots: ["root"],
      type: "default",
      variant: "muted",
      className: "bg-bg-muted text-fg",
    },
    {
      slots: ["root"],
      type: "success",
      variant: "fill",
      className: "bg-bg-success text-fg-onSuccess border-none",
    },
    {
      slots: ["root"],
      type: "success",
      variant: "muted",
      className: "bg-bg-success-muted text-fg-onMutedSuccess",
    },
    {
      slots: ["root"],
      type: "warning",
      variant: "fill",
      className: "bg-bg-warning text-fg-onWarning border-none]",
    },
    {
      slots: ["root"],
      type: "warning",
      variant: "muted",
      className: "bg-bg-warning-muted text-fg-onMutedWarning",
    },
    {
      slots: ["root"],
      type: "danger",
      variant: "fill",
      className: "bg-bg-danger text-fg-onDanger border-none",
    },
    {
      slots: ["root"],
      type: "danger",
      variant: "muted",
      className: "bg-bg-danger-muted text-fg-onMutedDanger",
    },
    {
      slots: ["root"],
      type: "info",
      variant: "fill",
      className: "bg-bg-info text-fg-onInfo border-none",
    },
    {
      slots: ["root"],
      type: "info",
      variant: "muted",
      className: "bg-bg-info-muted text-fg-onMutedInfo",
    },
  ],
  defaultVariants: {
    type: "default",
    variant: "default",
  },
});

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const icons = {
  default: <InfoIcon />,
  success: <CheckCircle2Icon />,
  warning: <AlertTriangleIcon />,
  danger: <AlertCircleIcon />,
  info: <InfoIcon />,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { title, children, className, variant, type = "default", icon, action, ...props },
    ref
  ) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, type }).root(), className)}
      {...props}
    >
      {(icon ?? icons[type]) && (
        <span className="[&_svg]:size-4">{icon ?? icons[type]}</span>
      )}
      <div className="flex-1">
        {title && (
          <h5 className={cn(alertVariants({ variant, type }).title())}>{title}</h5>
        )}
        {children && (
          <div
            className={cn(
              alertVariants({ variant, type }).content(),
              !!title && "mt-0.5"
            )}
          >
            {children}
          </div>
        )}
      </div>
      {action && <div className="ml-2 shrink-0">{action}</div>}
    </div>
  )
);
Alert.displayName = "Alert";

export { Alert };
