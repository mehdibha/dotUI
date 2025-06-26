"use client";

import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import { tv } from "tailwind-variants";

import { createScopedContext } from "@dotui/ui/lib/utils";

const alertStyles = tv({
  slots: {
    root: "@container flex w-full items-center gap-4 rounded-lg border p-4 text-sm [&_svg]:size-4",
    title: "text-base leading-normal font-medium tracking-tight",
    content: "text-fg-muted",
  },
  variants: {
    variant: {
      neutral: { root: "bg-bg-muted text-fg border" },
      success: {
        root: "border-border-success bg-bg-success-muted text-fg-success border",
      },
      warning: {
        root: "border-border-warning bg-bg-warning-muted text-fg-warning border",
      },
      danger: {
        root: "border-border-danger bg-bg-danger-muted text-fg-danger border",
      },
      info: {
        root: "border-border-info bg-bg-info-muted text-fg-info border",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const { root, title, content } = alertStyles();

const [AlertProvider, useAlertContext] =
  createScopedContext<VariantProps<typeof alertStyles>>("AlertRoot");

const defaultIcons = {
  neutral: <InfoIcon />,
  danger: <AlertCircleIcon />,
  success: <CheckCircle2Icon />,
  warning: <AlertTriangleIcon />,
  info: <InfoIcon />,
};

interface AlertProps extends AlertRootProps {
  title?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode | null;
}

function Alert({
  variant = "neutral",
  title,
  action,
  icon,
  children,
  ...props
}: AlertProps) {
  const resolvedIcon = icon === undefined ? defaultIcons[variant] : icon;
  return (
    <AlertRoot variant={variant} {...props}>
      {resolvedIcon}
      <div className="flex flex-1 flex-col items-start gap-4 @sm:flex-row @sm:items-center">
        <div className="flex-1 space-y-0.5">
          {title && <AlertTitle>{title}</AlertTitle>}
          {children && <AlertContent>{children}</AlertContent>}
        </div>
        {action}
      </div>
    </AlertRoot>
  );
}

interface AlertRootProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertStyles> {}

function AlertRoot({ className, variant, ...props }: AlertRootProps) {
  return (
    <AlertProvider variant={variant}>
      <div role="alert" className={root({ variant, className })} {...props} />
    </AlertProvider>
  );
}

interface AlertTitleProps extends React.ComponentProps<"h5"> {}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  const { variant } = useAlertContext("AlertTitle");
  return <h5 className={title({ variant, className })} {...props} />;
}

interface AlertContentProps extends React.ComponentProps<"p"> {}

function AlertContent({ className, ...props }: AlertContentProps) {
  const { variant } = useAlertContext("AlertTitle");
  return <div className={content({ variant, className })} {...props} />;
}

export type { AlertProps, AlertRootProps, AlertTitleProps, AlertContentProps };
export { Alert, AlertRoot, AlertTitle, AlertContent };
