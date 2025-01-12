"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";
import { createScopedContext } from "@/lib/helpers";

const alertStyles = tv({
  slots: {
    root: "flex items-center gap-4 rounded-lg border p-4 [&_svg]:size-4",
    title: "mr-1 font-medium leading-normal tracking-tight",
    content: "text-sm",
  },
  variants: {
    variant: {
      neutral: { root: "bg-bg-muted text-fg" },
      success: {
        root: "bg-bg-success text-fg-onSuccess",
      },
      warning: {
        root: "bg-bg-warning text-fg-onWarning",
      },
      danger: {
        root: "bg-bg-danger text-fg-onDanger",
      },
      info: {
        root: "bg-bg-info text-fg-onInfo",
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
