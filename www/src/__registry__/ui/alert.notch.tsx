"use client";

import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { createScopedContext } from "@/registry/lib/utils";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import { tv } from "tailwind-variants";

const alertStyles = tv({
  slots: {
    root: "bg-bg-muted text-fg flex items-center gap-4 rounded-lg border-l-8 p-4 [&_svg]:size-4",
    title: "mr-1 leading-normal font-medium tracking-tight",
    content: "text-sm",
  },
  variants: {
    variant: {
      neutral: { root: "border-bg-primary" },
      success: {
        root: "border-bg-success",
      },
      warning: {
        root: "border-bg-warning",
      },
      danger: {
        root: "border-bg-danger",
      },
      info: {
        root: "border-bg-info",
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
  neutral: null,
  danger: <AlertCircleIcon />,
  success: <CheckCircle2Icon />,
  warning: <AlertTriangleIcon />,
  info: <InfoIcon />,
};

interface AlertProps extends AlertRootProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode | null;
}

function Alert({
  variant = "neutral",
  title,
  description,
  action,
  icon,
  ...props
}: AlertProps) {
  const resolvedIcon = icon === undefined ? defaultIcons[variant] : icon;
  return (
    <AlertRoot variant={variant} {...props}>
      {resolvedIcon}
      <div className="flex-1 space-y-0.5">
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertContent>{description}</AlertContent>}
      </div>
      {action}
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
  return <p className={content({ variant, className })} {...props} />;
}

export type { AlertProps, AlertRootProps, AlertTitleProps, AlertContentProps };
export { Alert, AlertRoot, AlertTitle, AlertContent };
